import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import contactRoutes from './route/contactRoute.js';
import serverless from 'serverless-http';

dotenv.config();

const app = express();

// Allowed origins
const allowedOrigins = [
  'https://portfolio-fc1v.vercel.app', // frontend production
  'http://localhost:3000'               // frontend local
];

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow Postman, curl, etc.
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

app.options('*', cors()); // handle preflight requests

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', contactRoutes);

// Health check
app.get('/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    success: true,
    message: 'Server is running',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// 404 & error handlers
app.use('*', (req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use((err, req, res, next) => res.status(500).json({ success: false, message: err.message || 'Internal server error' }));

// MongoDB connection (serverless-friendly)
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000
    }).then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
};

// Export serverless handler for Vercel
export default serverless(app);

// Local dev server
if (process.env.NODE_ENV !== 'production') {
  connectDB().then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Local server running on port ${PORT}`));
  });
}
