  const express = require('express');
  const cors = require('cors');
  require('dotenv').config();

  const http = require('http'); // <-- Needed for wrapping the express app
  const { Server } = require('socket.io'); // <-- Import Socket.IO

  // Routes
  const memeRoutes = require('./routes/memeRoutes');
  const userRoutes = require('./routes/userRoutes');
  const bidRoutes = require('./routes/bidRoutes');
  const upvoteRoutes = require('./routes/upvoteRoutes');
  const leaderboardRoutes = require('./routes/leaderboardRoutes');
  const aiMemeRoutes = require('./routes/aiMemeRoutes'); // New AI Meme Route

  // Express App
  const app = express();
  const port = process.env.PORT || 3000;

  // Wrap app with HTTP server
  const server = http.createServer(app);

  // Create Socket.IO instance
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Attach io instance to app so it can be used in controllers
  app.set('io', io);

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use(memeRoutes);
  app.use(userRoutes);
  app.use(bidRoutes);
  app.use(upvoteRoutes);
  app.use(leaderboardRoutes);
  app.use(aiMemeRoutes); // Use the new AI meme routes

  // Basic route
  app.get('/', (req, res) => {
    res.send('Meme Hustle Backend is running!');
  });

  // Socket connection test (optional)
  io.on('connection', (socket) => {
    console.log('⚡ New client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
    });
  });

  // Start server
  server.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
