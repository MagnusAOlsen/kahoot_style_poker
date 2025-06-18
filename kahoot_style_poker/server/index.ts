import { WebSocketServer } from 'ws';
import http from 'http';

const server = http.createServer();
const wss = new WebSocketServer({ server });

let players: string[] = [];

wss.on('connection', (socket) => {
  socket.on('message', (msg) => {
    const data = JSON.parse(msg.toString());
  

    if (data.type === 'join') {
      if (!players.includes(data.name)) players.push(data.name);
      const update = JSON.stringify({ type: 'players', players });
      wss.clients.forEach((client) => {
        if (client.readyState === socket.OPEN) {
            console.log("NEW TEST!")
            console.log("Sending update to client")
            console.log(update + "this is update")
          client.send(update);
        }
      });
    }
  });
});

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
