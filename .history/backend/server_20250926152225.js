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
    origin: process.env.FRONTEND_URL || 'http://localhost:5173' , // Allow all origins for development
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});


const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 1000, 
  message: {
    error: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});


app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));


app.use('/api/', limiter);

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/results', resultRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

const { broadcastResults } = handleSocketConnection(io);

// MongoDB connection
connectDB();

setInterval(() => {
  broadcastResults();
}, 5000);

const PORT = process.env.PORT || 5000;

cron.schedule('*/4 * * * *', async () => {
    try {
        const response = await axios.get(`${ 'https://x-backend-ujvu.onrender.com' || `http://localhost:${PORT}`}/`, {
            family: 4  // Force IPv4
        });
        console.log('Pinged the server:', response.data);
    } catch (error) {
        console.error('Error pinging the server:', error.message);
    }
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
});