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

async function playRound(game, wss, clients, dealerPosition) {
  game.startNewRound(dealerPosition);
  broadcast(wss, { type: 'players', players: game.players });
  for (const [socket, name] of clients.entries()) {
    const player = game.players.find(p => p.name === name);
    if (player && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'player', player }));
    }
  }
  
  broadcast(wss, { type: "communityCards", cards: game.getCommunityCards() });

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
  await game.payOut(rankings, async (playerName) => {
    const socket = [...clients.entries()].find(([_, name]) => name === playerName)?.[0];
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'showFoldedCards' }));
    }
  }
  );
  await game.waitForAllPlayersToReveal();
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
          
          const loopRounds = async () => {
            let dealerPosition = 0;
            while (true) {
              const playersWithCash = players.filter(p => p.chips > 0);
              if (playersWithCash.length < 2) break;
          
              broadcast(wss, { type: 'gameStarted' });
              broadcast(wss, { type: 'players', players });
              
              game = new Game(players);
              await playRound(game, wss, clients, dealerPosition);
          
              await new Promise(resolve => setTimeout(resolve, 3000));

              for (const player of players) {
                if (player.leave) {
                  players.splice(players.indexOf(player), 1);
                  clients.delete([...clients.entries()].find(([_, name]) => name === player.name)?.[0]);
                }
                else if (player.addOn) {
                  player.chips = 150;
                  player.addOn = false;
                }
              }
          
              // ✅ Rotate dealer only to active players
              do {
                dealerPosition = (dealerPosition + 1) % players.length;
              } while (players[dealerPosition].chips === 0);
            }
          };
          
          loopRounds();
          break;
        }


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

        case 'showLeftCard': {
          if (player && game) {
            player.showLeftCard = true;
            player.showRightCard = false;
            player.showBothCards = false;
            broadcast(wss, { type: 'players', players });
            broadcast(wss, { type: 'communityCards', cards: game.getCommunityCards() });
            game.checkIfAllPlayersRevealed(); // ✅ trigger check
          }
          break;
        }
        
        case 'showRightCard': {
          if (player && game) {
            player.showLeftCard = false;
            player.showRightCard = true;
            player.showBothCards = false;
            broadcast(wss, { type: 'players', players });
            broadcast(wss, { type: 'communityCards', cards: game.getCommunityCards() });
            game.checkIfAllPlayersRevealed(); // ✅ trigger check
          }
          break;
        }
        case 'showBothCards': {
          if (player && game) {
            player.showLeftCard = false;
            player.showRightCard = false;
            player.showBothCards = true;
            broadcast(wss, { type: 'players', players });
            broadcast(wss, { type: 'communityCards', cards: game.getCommunityCards() });
            game.checkIfAllPlayersRevealed(); // ✅ trigger check
          }
          break;
        }

        case 'addOn': {
          if (player) {
            player.addOn = true;
          }
          break;
        }
        
        case 'leave': {
          if (player) {
            player.leave = true;
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
