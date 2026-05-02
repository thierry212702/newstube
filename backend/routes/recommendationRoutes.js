import express from 'express';
import { protect, optional } from '../middleware/authMiddleware.js';
import { recommendationEngine } from '../services/recommendationEngine.js';
import Article from '../models/Article.js';
import Video from '../models/Video.js';

const router = express.Router();

// GET /api/recommendations/feed - Personalized feed
router.get('/feed', optional, async (req, res) => {
  try {
    let feed;
    
    if (req.user) {
      feed = await recommendationEngine.getPersonalizedFeed(req.user._id);
    } else {
      feed = await recommendationEngine.getTrendingContent();
    }
    
    res.json({
      success: true,
      data: feed
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/recommendations/trending - Trending content
router.get('/trending', async (req, res) => {
  try {
    const articles = await Article.find({ isTrending: true })
      .sort({ engagement: -1 })
      .limit(10);
    
    const videos = await Video.find({ isTrending: true })
      .sort({ engagement: -1 })
      .limit(5);
    
    res.json({
      success: true,
      data: {
        articles,
        videos
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/recommendations/interaction
router.post('/interaction', protect, async (req, res) => {
  try {
    const { contentId, contentType, interactionType } = req.body;
    
    await recommendationEngine.updateUserPreferences(
      req.user._id,
      contentId,
      contentType,
      interactionType
    );
    
    res.json({
      success: true,
      message: 'Interaction recorded'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;