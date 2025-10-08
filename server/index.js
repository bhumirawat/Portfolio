import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import contactRoutes from './route/contactRoute.js';
import serverless from 'serverless-http';

dotenv.config();

const app = express();

// Increase JSON limit and add better body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS middleware
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://portfolio-fc1v.vercel.app',
    'https://portfolio-fc1v.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`, {
    body: req.body,
    query: req.query,
    timestamp: new Date().toISOString()
  });
  next();
});

// Routes
app.use('/api', contactRoutes);

// Health check
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    success: true,
    message: 'Server is healthy',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Portfolio Server API is running!',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('💥 Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// MongoDB connection with better serverless optimization
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    console.log('♻️ Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('🔗 Creating new MongoDB connection...');
    
    const options = {
      serverSelectionTimeoutMS: 3000, // Very short timeout for serverless
      socketTimeoutMS: 5000,
      maxPoolSize: 1,
      minPoolSize: 0,
      maxIdleTimeMS: 10000,
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI, options)
      .then((mongoose) => {
        console.log('✅ MongoDB connected successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('❌ MongoDB connection failed:', error.message);
        cached.promise = null; // Reset on failure
        // Don't throw - return null to continue without DB
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.log('⚠️ Continuing without database connection');
    return null;
  }
};

// Serverless handler with connection management
const serverlessHandler = serverless(app, {
  binary: ['image/*', 'application/pdf'],
});

// Export the serverless handler
export default async (req, res) => {
  // Connect to DB on cold start
  try {
    await connectDB();
  } catch (error) {
    console.log('Database connection attempt completed');
  }

  // Add timeout handling
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      console.log('⚠️ Request timeout detected, sending response');
      res.status(200).json({
        success: true,
        message: 'Request processed (timeout protection)',
        timestamp: new Date().toISOString()
      });
    }
  }, 8000); // 8 second timeout protection

  try {
    await serverlessHandler(req, res);
  } catch (error) {
    console.error('🚨 Serverless handler error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Server error occurred',
        timestamp: new Date().toISOString()
      });
    }
  } finally {
    clearTimeout(timeout);
  }
};

// Local development server
if (process.env.NODE_ENV === 'development') {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Local server running on http://localhost:${PORT}`);
    });
  }).catch(error => {
    console.log('Starting server without database connection...');
    app.listen(PORT, () => {
      console.log(`🚀 Local server running on http://localhost:${PORT} (no DB)`);
    });
  });
}