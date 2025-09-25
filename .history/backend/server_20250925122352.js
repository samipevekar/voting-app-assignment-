import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { rateLimit } from 'express-rate-limit';

import authRoutes from './routes/auth.js';
import voteRoutes from './routes/votes.js';
import resultRoutes from './routes/results.js';
import { handleSocketConnection } from './socket/socketHandler.js';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(limiter);
app.use(cors({
  origin: [process.env.FRONTEND_URL || "http://localhost:5173", '*'],
  credentials: true,
  methods: ['GET', 'POST']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/results', resultRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Socket.io
const { broadcastResults } = handleSocketConnection(io);

// MongoDB connection
connectDB();

// Broadcast results every 30 seconds for demo purposes
setInterval(() => {
  broadcastResults();
}, 30000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});