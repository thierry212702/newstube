import express from 'express';
import Article from '../models/Article.js';
import { protect, optional } from '../middleware/authMiddleware.js';
import { recommendationEngine } from '../services/recommendationEngine.js';
import { aiService } from '../services/aiService.js';

const router = express.Router();

// GET /api/articles - Get all articles with pagination
router.get('/', optional, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;
    const search = req.query.search;
    
    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    const articles = await Article.find(query)
      .sort({ publishedAt: -1, engagement: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    const total = await Article.countDocuments(query);
    
    // Track view for recommendations
    if (req.user && articles.length > 0) {
      recommendationEngine.updateUserPreferences(
        req.user._id,
        articles[0]._id,
        'article',
        'view'
      );
    }
    
    res.json({
      success: true,
      data: articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/articles/:id - Get single article
router.get('/:id', optional, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    
    // Increment views
    article.views += 1;
    article.calculateEngagement();
    await article.save();
    
    // Track user interaction
    if (req.user) {
      recommendationEngine.updateUserPreferences(
        req.user._id,
        article._id,
        'article',
        'view'
      );
    }
    
    // Get AI summary
    const aiSummary = await aiService.summarizeArticle(article.content);
    
    // Get related articles
    const relatedArticles = await Article.find({
      _id: { $ne: article._id },
      category: article.category
    })
    .sort({ engagement: -1 })
    .limit(5);
    
    res.json({
      success: true,
      data: {
        ...article.toObject(),
        aiSummary,
        relatedArticles
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/articles/:id/like
router.post('/:id/like', protect, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    
    article.likes += 1;
    article.calculateEngagement();
    await article.save();
    
    recommendationEngine.updateUserPreferences(
      req.user._id,
      article._id,
      'article',
      'like'
    );
    
    res.json({ success: true, likes: article.likes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;