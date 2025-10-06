import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import contactRoutes from './route/contactRoute.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Define allowed origins explicitly
const allowedOrigins = [
  'https://portfolio-fc1v.vercel.app', // Your deployed frontend
  'http://localhost:3000' // Local dev
];

// ✅ Enhanced CORS setup (handles preflight too)
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (like curl/postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// ✅ Ensure preflight requests get a proper response
app.options('*', cors());

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use('/api', contactRoutes);

// Health check route
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    success: true,
    message: 'Server is running successfully',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Server Error:', error.message);
  res.status(500).json({
    success: false,
    message: error.message || 'Internal server error'
  });
});

// Database connection and server start
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('⚠️ Database connection failed:', error.message);
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} (no DB connection)`);
    });
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

// Start server
startServer();
