const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.SOCKET_CORS_ORIGIN ? process.env.SOCKET_CORS_ORIGIN.split(',') : ['http://localhost:5173'],
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join role channel (e.g. role:pharmacist)
    socket.on('join-role', (role) => {
      socket.join(`role:${role}`);
      console.log(`Socket ${socket.id} joined role:${role}`);
    });

    // Join user specific channel (for personal notifications)
    socket.on('join-user', (userId) => {
      socket.join(`user:${userId}`);
    });

    // Join patient specific channel (for following patient journey)
    socket.on('join-patient', (patientId) => {
      socket.join(`patient:${patientId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { initSocket, getIo };
