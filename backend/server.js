import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { contentFetcher } from './services/contentFetcher.js';



// DEBUG - Verify env variables
console.log('\n=== ENVIRONMENT CHECK ===');
console.log('CLOUDFLARE_ACCOUNT_ID:', process.env.CLOUDFLARE_ACCOUNT_ID ? 'SET' : 'NOT SET');
console.log('CLOUDFLARE_API_TOKEN:', process.env.CLOUDFLARE_API_TOKEN ? 'SET' : 'NOT SET');
console.log('=========================\n');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Newstube API',
    version: '1.0.0'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling
app.use(errorHandler);

// Database connection and server start
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Try ports starting from 5001
    const ports = [5001, 5002, 5003, 5004, 5005];
    
    for (const port of ports) {
      try {
        await new Promise((resolve, reject) => {
          const server = app.listen(port, () => {
            console.log(`🚀 Newstube running on port ${port}`);
            console.log(`📍 API: http://localhost:${port}/api`);
            console.log(`❤️  Health: http://localhost:${port}/api/health`);
            
            // Start content fetching
            setInterval(() => {
              contentFetcher.fetchTrendingContent();
            }, 30 * 60 * 1000);
            
            contentFetcher.fetchTrendingContent();
            
            resolve();
          });

          server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
              console.log(`Port ${port} in use, trying next...`);
              server.close();
              reject(err);
            } else {
              reject(err);
            }
          });
        });
        
        // If we get here, server started successfully
        return;
        
      } catch (err) {
        if (err.code !== 'EADDRINUSE') {
          throw err;
        }
      }
    }
    
    console.error('❌ All ports are in use!');
    
  } catch (error) {
    console.error('❌ Failed to start:', error.message);
    process.exit(1);
  }
};

startServer();

export default app;