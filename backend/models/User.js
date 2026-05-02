import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'creator', 'admin'],
    default: 'user'
  },
  preferences: {
    categories: [String],
    topics: [String],
    sources: [String]
  },
  watchHistory: [{
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'watchHistory.contentType'
    },
    contentType: {
      type: String,
      enum: ['Article', 'Video']
    },
    watchedAt: { type: Date, default: Date.now },
    watchDuration: Number
  }],
  interactions: [{
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'interactions.contentType'
    },
    contentType: {
      type: String,
      enum: ['Article', 'Video']
    },
    type: {
      type: String,
      enum: ['like', 'save', 'share', 'comment']
    },
    timestamp: { type: Date, default: Date.now }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);