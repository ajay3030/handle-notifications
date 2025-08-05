const { Server } = require('socket.io');
const { connectedUsers } = require('../services/notificationService');
let io;

module.exports = (server) => {
  io = new Server(server, {
    cors: { 
      origin: [
      'http://localhost:5173',
      process.env.FRONTEND_URL || 'http://localhost:5173'
    ], 
      methods: ['GET', 'POST'] }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('register_user', (userId) => {
      connectedUsers.set(userId, socket.id);
      socket.userId = userId;
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    socket.on('disconnect', () => {
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
        console.log(`User ${socket.userId} disconnected`);
      }
    });
  });

  return io;
};

module.exports.getIO = () => io;