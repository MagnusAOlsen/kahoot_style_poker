import { WebSocketServer } from 'ws';
import http from 'http';
import { Player } from "../src/gameLogic/Player.ts";
import { Game } from "../src/gameLogic/Game.ts";

async function broadcast(wss, message) {
  const msg = JSON.stringify(message);
  wss.clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(msg);
    }
  });
}

async function playRound(game, wss, clients) {
  game.startNewRound();
  for (const [socket, name] of clients.entries()) {
    const player = game.players.find(p => p.name === name);
    if (player && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'player', player }));
    }
  }
  
  broadcast(wss, { type: "roundStarted" });

  for (const player of game.players) {
    player.notifyTurn = (playerName) => {
      const socket = [...clients.entries()].find(([_, name]) => name === playerName)?.[0];
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'yourTurn' }));
      }
    };
  }

  for (let i = 0; i < 4; i++) {
    await game.collectBets();
    game.nextPhase();
    broadcast(wss, { type: "communityCards", cards: game.getCommunityCards() });
  }

  const rankings = game.rankPlayers();
  game.payOut(rankings);
  broadcast(wss, { type: "roundOver", rankings });
}

function main() {
  const server = http.createServer();
  const wss = new WebSocketServer({ server });

  let players: Player[] = [];
  const clients = new Map();
  let game: Game | null = null;

  wss.on('connection', (socket) => {
    socket.on('message', (msg) => {
      const data = JSON.parse(msg.toString());
      const playerName = clients.get(socket);
      const player = players.find(p => p.name === playerName);

      switch (data.type) {
        case 'join': {
          if (!players.find(p => p.name === data.name) && players.length < 8) {
            const newPlayer = new Player(data.name);
            players.push(newPlayer);
          }
          clients.set(socket, data.name);
          broadcast(wss, { type: 'players', players });
          break;
        }

        case 'startGame': {
          game = new Game(players);
          broadcast(wss, { type: 'gameStarted' });
          setTimeout(() => playRound(game, wss, clients), 500);
          break;
        }

        /* case 'startGame': {
          console.log("Starting game loop with players:", players.map(p => p.name));
          
          if (!game) {
            game = new Game(players); // Only create the Game instance once
          }
        
          const loopRounds = async () => {
            while (true) {
              await broadcast(wss, { type: 'gameStarted' });
        
              await playRound(game, wss, clients);
        
              await new Promise(resolve => setTimeout(resolve, 1000)); // small pause between rounds
            }
          };
        
          loopRounds();
          break;
        } */

        case 'reconnect': {
          const reconnectingName = data.name;
          const reconnectingPlayer = players.find(p => p.name === reconnectingName);
          if (reconnectingPlayer) {
            for (const [sock, name] of clients.entries()) {
              if (name === data.name && sock !== socket) {
                clients.delete(sock);
                sock.close();
              }
            }
            clients.set(socket, data.name);
            socket.send(JSON.stringify({ type: 'player', player: reconnectingPlayer, isMyTurn: game?.currentPlayer?.name === reconnectingName }));
          }
          break;
        }

        case 'raise': {
          if (player) {
            player.respondToBet(data.amount);
              socket.send(JSON.stringify({ type: 'player', player }));
              broadcast(wss, { type: 'players', players: players });
          }
          break;
        }

        case 'call': {
          if (player) {

            player.respondToBet(-1);
              socket.send(JSON.stringify({ type: 'player', player }));
              broadcast(wss, { type: 'players', players: players });
           
          }
          break;
        }

        case 'fold': {
          if (player) {
            player.respondToBet(-2);
            socket.send(JSON.stringify({ type: 'player', player }));
            broadcast(wss, { type: 'players', players: players });
            
          }
          break;
        }

        default:
          console.log("Unknown message type:", data.type);
      }
    });
  });

  server.listen(3000, () => {
    console.log('Server listening on http://192.168.86.28:3000');
  });
}

main();
