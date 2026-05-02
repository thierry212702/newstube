import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import Article from '../models/Article.js';
import Video from '../models/Video.js';
import User from '../models/User.js';
import ChatHistory from '../models/ChatHistory.js';

const router = express.Router();

router.use(protect);
router.use(admin);

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [totalArticles, totalVideos, totalUsers, totalChats] = await Promise.all([
      Article.countDocuments(),
      Video.countDocuments(),
      User.countDocuments(),
      ChatHistory.countDocuments()
    ]);
    
    const articlesByCategory = await Article.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    const topArticles = await Article.find()
      .sort({ engagement: -1 })
      .limit(10);
    
    res.json({
      success: true,
      data: {
        totalArticles,
        totalVideos,
        totalUsers,
        totalChats,
        articlesByCategory,
        topArticles
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Content management
router.post('/articles', async (req, res) => {
  try {
    const article = await Article.create({
      ...req.body,
      author: req.user.username
    });
    
    res.status(201).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/articles/:id', async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;