import { WebSocketServer } from 'ws';
import http from 'http';
import { Player } from "../src/gameLogic/Player.ts";




function main() {
  const server = http.createServer();
  const wss = new WebSocketServer({ server });
  
  let players: Player[] = [];
  const clients = new Map<WebSocket, string>();
  
  wss.on('connection', (socket) => {
    
    socket.on('message', (msg) => {
      const data = JSON.parse(msg.toString());
      console.log("Received message:", data);
      console.log(clients.size);
    
  
      if (data.type === 'join') {
          const existingPlayer = players.find(p => p.name === data.name);
        
          if (!existingPlayer && players.length < 8) {
            const newPlayer = new Player(data.name);
            players.push(newPlayer);
          }
          clients.set(socket, data.name);
        
          // Create a list of just player names to send to clients
          /* const playerNames = players.map(p => p.name); */
        
          const update = JSON.stringify({ type: 'players', players: players });
        
          wss.clients.forEach((client) => {
            if (client.readyState === socket.OPEN) {
              console.log("Sending update to client:", update);
              client.send(update);
            }
          })
        } 

      else if (data.type === 'startGame') {
        
        console.log("Starting game with players:", players);
 
        clients.forEach((name, clientSocket) => {
          const player = players.find(p => p.name === name);
          if (player && clientSocket.readyState === WebSocket.OPEN) {
            clientSocket.send(JSON.stringify({ type: "gameStarted", player }));
            console.log(`Game started for player: ${player.name}`);
          }
        });
      }
    });
  });
  
  server.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
  });

}


main();