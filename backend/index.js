const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

const frontendUrl = process.env.FRONTEND_URL || 'https://the-restaurant-project.vercel.app';

const io = new Server(server, {
  cors: {
    origin: [frontendUrl, 'https://the-restaurant-project.vercel.app', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors({ origin: [frontendUrl, 'https://the-restaurant-project.vercel.app', 'http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic Route
app.get('/', (req, res) => {
  res.send('AdityaDine API is running');
});

// Socket.io for Real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Table availability updates
  socket.on('join_table_updates', () => {
    socket.join('tables');
  });

  // Order status updates
  socket.on('join_order_updates', (userId) => {
    socket.join(`order_${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// API Routes
app.use('/api/settings', require('./src/routes/settingsRoutes'));
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/menu', require('./src/routes/menuRoutes'));
app.use('/api/bookings', require('./src/routes/bookingRoutes'));
app.use('/api/orders', require('./src/routes/orderRoutes'));
app.use('/api/home-images', require('./src/routes/homeImageRoutes'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
