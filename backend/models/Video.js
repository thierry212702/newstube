import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  description: String,
  videoUrl: String,
  thumbnailUrl: String,
  duration: String,
  channel: String,
  channelAvatar: String,
  category: {
    type: String,
    required: true,
    index: true
  },
  tags: [String],
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: {
    type: Number,
    default: 0
  },
  engagement: {
    type: Number,
    default: 0
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  isRecommended: {
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

videoSchema.methods.calculateEngagement = function() {
  this.engagement = (this.views * 1) + 
                    (this.likes * 2) + 
                    (this.comments * 3);
  return this.engagement;
};

export default mongoose.model('Video', videoSchema);