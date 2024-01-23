// src/app.js

const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Socket.IO setup
io.on('connection', socket => {
  console.log('User connected:', socket.id);

  // Handle chat messages
  socket.on('chat message', msg => {
    io.emit('chat message', { username: socket.username, message: msg });
  });

  // Handle username assignment
  socket.on('set username', username => {
    socket.username = username;
    io.emit('chat message', { username: 'Server', message: `${username} has joined the chat` });
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    io.emit('chat message', { username: 'Server', message: `${socket.username} has left the chat` });
  });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Server is running on http://localhost:${PORT}`);

});
