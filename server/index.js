import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import contactRoutes from './route/contactRoute.js';
import serverless from 'serverless-http';

dotenv.config();

const app = express();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS - allow both localhost and frontend production
const allowedOrigins = [
  'https://portfolio-fc1v.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173' // Vite dev server
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // preflight request
  }
  next();
});

// Routes
app.use('/api', contactRoutes);

// Health check - doesn't depend on MongoDB
app.get('/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.status(200).json({ 
      success: true, 
      message: 'Server running successfully', 
      database: dbStatus,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(200).json({ 
      success: true, 
      message: 'Server running (database connection issues)',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Portfolio Server API is running!',
    endpoints: {
      health: '/api/health',
      contact: '/api/contact (POST)',
      contacts: '/api/contacts (GET)'
    },
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error. Please try again later.',
    timestamp: new Date().toISOString()
  });
});

// MongoDB connection with timeout handling
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    console.log('🔗 Attempting MongoDB connection...');
    
    const options = {
      serverSelectionTimeoutMS: 5000, // Reduced from 10s to 5s
      socketTimeoutMS: 10000,
      maxPoolSize: 1,
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI, options)
      .then(mongoose => {
        console.log('✅ MongoDB connected successfully');
        return mongoose;
      })
      .catch(error => {
        console.error('❌ MongoDB connection failed:', error.message);
        console.log('⚠️ Continuing without database connection');
        // Don't throw error - allow server to start without DB
        return null;
      });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
};

// Export serverless handler
export default async function handler(req, res) {
  try {
    // Try to connect to DB, but don't fail if it doesn't work
    await connectDB().catch(() => {
      console.log('🔄 Proceeding without database connection');
    });
    
    return serverless(app)(req, res);
  } catch (error) {
    console.error('Server handler error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred',
      timestamp: new Date().toISOString()
    });
  }
}

// Local dev - only start server if not in Vercel
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  connectDB().then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Local server running on port ${PORT}`));
  }).catch(error => {
    console.log('🚀 Local server running without database connection on port 5000');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Local server running on port ${PORT} (no DB)`));
  });
}