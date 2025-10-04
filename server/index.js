import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import contactRoutes from './route/contactRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes - MUST COME BEFORE STATIC FILES
app.use('/contact', contactRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Contact API Server is running!',
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Database connection
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));
}

// Serve static files from client dist - AFTER API ROUTES
app.use(express.static(path.join(__dirname, '../client/dist')));

// FIXED: Use a parameter-based catch-all that works with path-to-regexp
app.get('/:any*?', (req, res) => {
  // Skip if it's an API route that should have been handled already
  if (req.path.startsWith('/api/') || req.path.startsWith('/contact') || req.path === '/health') {
    return res.status(404).json({ error: 'Route not found' });
  }
  
  // Serve SPA for all other routes
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;