import { WebSocketServer } from 'ws';
import http from 'http';
import { Player } from "../src/gameLogic/Player.ts";




function main() {
  const server = http.createServer();
  const wss = new WebSocketServer({ server });
  
  let players: Player[] = [];
  
  wss.on('connection', (socket) => {
    socket.on('message', (msg) => {
      const data = JSON.parse(msg.toString());
    
  
      if (data.type === 'join') {
          const existingPlayer = players.find(p => p.name === data.name);
        
          if (!existingPlayer) {
            const newPlayer = new Player(data.name);
            players.push(newPlayer);
          }
        
          // Create a list of just player names to send to clients
          const playerNames = players.map(p => p.name);
        
          const update = JSON.stringify({ type: 'players', players: playerNames });
        
          wss.clients.forEach((client) => {
            if (client.readyState === socket.OPEN) {
              console.log("Sending update to client:", update);
              client.send(update);
            }
          })
        }
        
    });
  });
  
  server.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
  });

}


main();