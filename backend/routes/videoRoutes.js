import express from 'express';
import Video from '../models/Video.js';
import { optional } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', optional, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const videos = await Video.find()
      .sort({ engagement: -1, publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    const total = await Video.countDocuments();
    
    res.json({
      success: true,
      data: videos,
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

router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }
    
    video.views += 1;
    video.calculateEngagement();
    await video.save();
    
    const relatedVideos = await Video.find({
      _id: { $ne: video._id },
      category: video.category
    })
    .sort({ engagement: -1 })
    .limit(10);
    
    res.json({
      success: true,
      data: {
        ...video.toObject(),
        relatedVideos
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;