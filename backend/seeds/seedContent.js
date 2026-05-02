import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { contentFetcher } from '../services/contentFetcher.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@newstube.com' });
    
    if (!adminExists) {
      await User.create({
        username: 'admin',
        email: 'admin@newstube.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin user created');
    }
    
    // Fetch initial content
    await contentFetcher.fetchTrendingContent();
    console.log('Content seeded successfully');
    
    console.log('\nAdmin Credentials:');
    console.log('Email: admin@newstube.com');
    console.log('Password: admin123');
    
    process.exit();
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();