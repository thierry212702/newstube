import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  summary: String,
  author: String,
  source: String,
  sourceUrl: String,
  category: {
    type: String,
    required: true,
    index: true
  },
  tags: [String],
  imageUrl: String,
  readTime: Number,
  wordCount: Number,
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  saves: {
    type: Number,
    default: 0
  },
  engagement: {
    type: Number,
    default: 0
  },
  isBreaking: {
    type: Boolean,
    default: false
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  aiGenerated: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Index for search and recommendations
articleSchema.index({ title: 'text', content: 'text', tags: 'text' });
articleSchema.index({ category: 1, engagement: -1 });
articleSchema.index({ publishedAt: -1, engagement: -1 });

// Calculate engagement score
articleSchema.methods.calculateEngagement = function() {
  this.engagement = (this.views * 1) + 
                    (this.likes * 2) + 
                    (this.shares * 3) + 
                    (this.saves * 4);
  return this.engagement;
};

export default mongoose.model('Article', articleSchema);