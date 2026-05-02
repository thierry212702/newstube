import axios from 'axios';
import Article from '../models/Article.js';
import Video from '../models/Video.js';

class ContentFetcher {
  constructor() {
    this.newsSources = [
      {
        name: 'BBC News',
        url: 'https://newsapi.org/v2/top-headlines?sources=bbc-news',
        category: 'general'
      },
      {
        name: 'Reuters',
        url: 'https://newsapi.org/v2/top-headlines?sources=reuters',
        category: 'general'
      },
      {
        name: 'TechCrunch',
        url: 'https://newsapi.org/v2/top-headlines?sources=techcrunch',
        category: 'technology'
      },
      {
        name: 'ESPN',
        url: 'https://newsapi.org/v2/top-headlines?sources=espn',
        category: 'sports'
      }
    ];

    this.trendingVideos = [
      {
        title: "Understanding Global Markets",
        description: "Expert analysis of current market trends",
        category: "business",
        duration: "15:30",
        thumbnailUrl: "https://picsum.photos/seed/market/640/360"
      },
      {
        title: "Tech Innovations 2024",
        description: "Latest technology breakthroughs",
        category: "technology",
        duration: "12:45",
        thumbnailUrl: "https://picsum.photos/seed/tech/640/360"
      },
      {
        title: "Climate Action Summit",
        description: "World leaders discuss climate change",
        category: "environment",
        duration: "20:15",
        thumbnailUrl: "https://picsum.photos/seed/climate/640/360"
      },
      {
        title: "Sports Highlights",
        description: "This week's biggest sports moments",
        category: "sports",
        duration: "8:30",
        thumbnailUrl: "https://picsum.photos/seed/sports/640/360"
      },
      {
        title: "Political Analysis",
        description: "Deep dive into current political landscape",
        category: "politics",
        duration: "25:00",
        thumbnailUrl: "https://picsum.photos/seed/politics/640/360"
      },
      {
        title: "Health & Wellness Update",
        description: "Latest health news and research",
        category: "health",
        duration: "10:20",
        thumbnailUrl: "https://picsum.photos/seed/health/640/360"
      }
    ];
  }

  async fetchTrendingContent() {
    try {
      // Fetch news articles
      await this.fetchNewsArticles();
      
      // Generate trending videos
      await this.updateTrendingVideos();
      
      // Update engagement scores
      await this.updateEngagementScores();
      
      console.log('Content updated successfully');
    } catch (error) {
      console.error('Content fetch error:', error);
    }
  }

  async fetchNewsArticles() {
    // If NewsAPI key is available, fetch real news
    if (process.env.NEWS_API_KEY) {
      for (const source of this.newsSources) {
        try {
          const response = await axios.get(source.url, {
            headers: {
              'X-Api-Key': process.env.NEWS_API_KEY
            }
          });

          for (const article of response.data.articles) {
            await this.saveArticle(article, source.category);
          }
        } catch (error) {
          console.log(`Using fallback for ${source.name}`);
          await this.generateFallbackArticles(source.category);
        }
      }
    } else {
      // Generate sample articles
      await this.generateFallbackArticles('general');
    }
  }

  async saveArticle(articleData, category) {
    try {
      const existing = await Article.findOne({ title: articleData.title });
      
      if (!existing) {
        await Article.create({
          title: articleData.title,
          content: articleData.content || articleData.description,
          summary: articleData.description,
          author: articleData.author || 'Staff Writer',
          source: articleData.source?.name || 'Unknown',
          sourceUrl: articleData.url,
          category: category || 'general',
          imageUrl: articleData.urlToImage,
          publishedAt: articleData.publishedAt || new Date(),
          aiGenerated: false
        });
      }
    } catch (error) {
      console.error('Save article error:', error);
    }
  }

  async generateFallbackArticles(category) {
    const sampleArticles = [
      {
        title: "Global Markets Show Strong Recovery",
        content: "Financial markets worldwide are showing signs of recovery...",
        summary: "Markets rebound amid positive economic indicators",
        category: "business",
        tags: ["markets", "economy", "finance"]
      },
      {
        title: "AI Revolution in Healthcare",
        content: "Artificial intelligence is transforming the healthcare industry...",
        summary: "How AI is changing medical diagnosis and treatment",
        category: "technology",
        tags: ["AI", "healthcare", "innovation"]
      },
      {
        title: "World Leaders Meet for Climate Summit",
        content: "Global leaders gather to discuss climate change initiatives...",
        summary: "International cooperation on environmental challenges",
        category: "environment",
        tags: ["climate", "environment", "politics"]
      },
      {
        title: "Sports: Championship Finals Result",
        content: "An exciting conclusion to the season...",
        summary: "Dramatic finish in championship game",
        category: "sports",
        tags: ["sports", "championship", "highlights"]
      },
      {
        title: "New Study Reveals Health Benefits of Exercise",
        content: "Research shows significant improvements in mental health...",
        summary: "Exercise linked to better mental and physical health",
        category: "health",
        tags: ["health", "wellness", "research"]
      },
      {
        title: "Technology Giants Announce New Products",
        content: "Major tech companies reveal their latest innovations...",
        summary: "New gadgets and software unveiled at tech conference",
        category: "technology",
        tags: ["tech", "innovation", "products"]
      },
      {
        title: "Political Developments Shape Policy",
        content: "Recent political events are influencing national policies...",
        summary: "How current politics affects everyday life",
        category: "politics",
        tags: ["politics", "government", "policy"]
      },
      {
        title: "Education Reform Proposed",
        content: "New education policies aim to improve learning outcomes...",
        summary: "Changes coming to education system",
        category: "education",
        tags: ["education", "reform", "learning"]
      }
    ];

    for (const article of sampleArticles) {
      const exists = await Article.findOne({ title: article.title });
      if (!exists) {
        await Article.create({
          ...article,
          author: "AI Writer",
          source: "Newstube",
          imageUrl: `https://picsum.photos/seed/${article.category}/800/400`,
          readTime: Math.floor(Math.random() * 10) + 3,
          wordCount: Math.floor(Math.random() * 1000) + 500,
          views: Math.floor(Math.random() * 1000),
          likes: Math.floor(Math.random() * 100),
          engagement: Math.floor(Math.random() * 5000),
          isBreaking: Math.random() > 0.8,
          isTrending: Math.random() > 0.7,
          aiGenerated: true
        });
      }
    }
  }

  async updateTrendingVideos() {
    for (const video of this.trendingVideos) {
      const exists = await Video.findOne({ title: video.title });
      if (!exists) {
        await Video.create({
          ...video,
          channel: "Newstube",
          channelAvatar: "https://picsum.photos/seed/channel/100/100",
          tags: [video.category],
          views: Math.floor(Math.random() * 10000),
          likes: Math.floor(Math.random() * 1000),
          comments: Math.floor(Math.random() * 100),
          engagement: Math.floor(Math.random() * 50000),
          isTrending: true,
          isRecommended: true
        });
      }
    }
  }

  async updateEngagementScores() {
    const articles = await Article.find();
    for (const article of articles) {
      article.calculateEngagement();
      await article.save();
    }

    const videos = await Video.find();
    for (const video of videos) {
      video.calculateEngagement();
      await video.save();
    }
  }
}

export const contentFetcher = new ContentFetcher();