import UserPreference from '../models/UserPreference.js';
import Article from '../models/Article.js';
import Video from '../models/Video.js';

class RecommendationEngine {
  // YouTube-like recommendation algorithm
  async getPersonalizedFeed(userId, limit = 20) {
    try {
      const preferences = await UserPreference.findOne({ userId });
      
      if (!preferences) {
        return this.getTrendingContent(limit);
      }

      // Calculate user interests based on interaction history
      const userInterests = this.calculateUserInterests(preferences);
      
      // Get content based on user interests
      const articles = await Article.find({
        $or: [
          { category: { $in: userInterests.categories } },
          { tags: { $in: userInterests.topics } }
        ]
      })
      .sort({ engagement: -1, publishedAt: -1 })
      .limit(limit * 0.6);

      const videos = await Video.find({
        $or: [
          { category: { $in: userInterests.categories } },
          { tags: { $in: userInterests.topics } }
        ]
      })
      .sort({ engagement: -1, publishedAt: -1 })
      .limit(limit * 0.4);

      // Mix and rank content
      const mixedFeed = this.mixAndRank(articles, videos, userInterests);
      
      return mixedFeed.slice(0, limit);
    } catch (error) {
      console.error('Recommendation error:', error);
      return this.getTrendingContent(limit);
    }
  }

  calculateUserInterests(preferences) {
    const categories = preferences.categoryWeights
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5)
      .map(c => c.category);

    const topics = preferences.topicWeights
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 10)
      .map(t => t.topic);

    return { categories, topics };
  }

  mixAndRank(articles, videos, userInterests) {
    const mixed = [];
    let articleIndex = 0;
    let videoIndex = 0;

    // Interleave articles and videos
    while (articleIndex < articles.length || videoIndex < videos.length) {
      // Add 2 articles
      for (let i = 0; i < 2 && articleIndex < articles.length; i++) {
        mixed.push({
          ...articles[articleIndex].toObject(),
          contentType: 'article',
          score: this.calculateScore(articles[articleIndex], userInterests)
        });
        articleIndex++;
      }

      // Add 1 video
      if (videoIndex < videos.length) {
        mixed.push({
          ...videos[videoIndex].toObject(),
          contentType: 'video',
          score: this.calculateScore(videos[videoIndex], userInterests)
        });
        videoIndex++;
      }
    }

    // Sort by score
    return mixed.sort((a, b) => b.score - a.score);
  }

  calculateScore(content, userInterests) {
    let score = content.engagement || 0;
    
    // Boost score for user interests
    if (userInterests.categories.includes(content.category)) {
      score *= 2;
    }
    
    // Boost recent content
    const hoursAgo = (Date.now() - new Date(content.publishedAt)) / (1000 * 60 * 60);
    if (hoursAgo < 24) score *= 1.5;
    if (hoursAgo < 6) score *= 2;
    
    // Boost trending content
    if (content.isTrending) score *= 1.3;
    
    return score;
  }

  async getTrendingContent(limit = 20) {
    const articles = await Article.find()
      .sort({ engagement: -1, publishedAt: -1 })
      .limit(limit * 0.6);

    const videos = await Video.find()
      .sort({ engagement: -1, publishedAt: -1 })
      .limit(limit * 0.4);

    return [...articles.map(a => ({ ...a.toObject(), contentType: 'article' })),
            ...videos.map(v => ({ ...v.toObject(), contentType: 'video' }))];
  }

  async updateUserPreferences(userId, contentId, contentType, interactionType) {
    let preferences = await UserPreference.findOne({ userId });
    
    if (!preferences) {
      preferences = new UserPreference({ userId });
    }

    const content = contentType === 'article' 
      ? await Article.findById(contentId)
      : await Video.findById(contentId);

    if (!content) return;

    // Update category weights
    this.updateWeight(preferences.categoryWeights, content.category, interactionType);
    
    // Update topic weights
    if (content.tags) {
      content.tags.forEach(tag => {
        this.updateWeight(preferences.topicWeights, tag, interactionType);
      });
    }

    // Add to interaction history
    preferences.interactionHistory.push({
      contentId,
      contentType,
      interactionType,
      timestamp: new Date()
    });

    // Keep only last 1000 interactions
    if (preferences.interactionHistory.length > 1000) {
      preferences.interactionHistory = preferences.interactionHistory.slice(-1000);
    }

    preferences.lastUpdated = new Date();
    await preferences.save();
  }

  updateWeight(weights, item, interactionType) {
    const existing = weights.find(w => w[Object.keys(w)[0]] === item);
    const boostValue = {
      view: 1,
      like: 3,
      save: 5,
      share: 4,
      comment: 2
    };

    if (existing) {
      existing.weight += boostValue[interactionType] || 1;
      existing.lastInteraction = new Date();
    } else {
      weights.push({
        [Object.keys(weights[0] || {})[0] || 'value']: item,
        weight: boostValue[interactionType] || 1,
        lastInteraction: new Date()
      });
    }
  }
}

export const recommendationEngine = new RecommendationEngine();