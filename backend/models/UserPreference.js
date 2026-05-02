import mongoose from 'mongoose';

const userPreferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  categoryWeights: [{
    category: String,
    weight: Number,
    lastInteraction: Date
  }],
  topicWeights: [{
    topic: String,
    weight: Number,
    lastInteraction: Date
  }],
  preferredSources: [{
    source: String,
    weight: Number
  }],
  contentPreferences: {
    preferredLength: {
      type: String,
      enum: ['short', 'medium', 'long']
    },
    preferredContentType: {
      type: String,
      enum: ['article', 'video', 'both'],
      default: 'both'
    }
  },
  interactionHistory: [{
    contentId: mongoose.Schema.Types.ObjectId,
    contentType: String,
    interactionType: String,
    timestamp: Date
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('UserPreference', userPreferenceSchema);