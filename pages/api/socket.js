// pages/api/socket.js
// import { Server } from 'socket.io';

// let io;

// export default function handler(req, res) {
//   if (!io) {
//     io = new Server(res.socket.server);
//     res.socket.server.io = io;

//     io.on('connection', (socket) => {
//       console.log('New client connected');
      
//       socket.on('message111', (msg) => {
//         console.log('Message received: ', msg);
//         socket.broadcast.emit('message', msg);
//       });

//       socket.on('disconnect', () => {
//         console.log('Client disconnected');
//       });
//     });
//   }
//   res.end();
// }
