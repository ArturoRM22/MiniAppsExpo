import app from './app.js';
import { Server as webSocketServer } from 'socket.io';
import http from 'http';
import sockets from './sockets.js';

const server = http.createServer(app);

const io = new webSocketServer(server, {
  cors: {
    origin: ['http://localhost:8081', 'exp://192.168.100.5:8081'], // Multiple origins allowed
    methods: ["GET", "POST"],
    credentials: true
  }
});
 
const PORT = 3001;

sockets(io);

server.listen(PORT);

console.log(`Listening on port ${PORT}`);
