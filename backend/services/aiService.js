import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';

class AIService {
  constructor() {
    this.accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    this.apiToken = process.env.CLOUDFLARE_API_TOKEN;
    this.baseURL = this.accountId ? 
      `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/ai/run/@cf/meta/llama-3-8b-instruct` : '';
    this.useAI = !!(this.accountId && this.apiToken);
    
    console.log('\n========================================');
    console.log('AI SERVICE STATUS (Cloudflare):');
    console.log('Account ID present:', !!this.accountId);
    console.log('API Token present:', !!this.apiToken);
    console.log('AI Mode:', this.useAI ? 'REAL AI ENABLED' : 'DISABLED');
    console.log('========================================\n');
  }

  async generateResponse(prompt, context = []) {
    if (!this.useAI) {
      return "⚠️ Cloudflare API not configured. Add CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN to your .env file. Get free access at https://dash.cloudflare.com/";
    }

    try {
      console.log('🤖 Calling Cloudflare AI...');
      
      const messages = [
        {
          role: 'system',
          content: 'You are a knowledgeable AI assistant. Answer all questions accurately and helpfully. Provide detailed, informative responses on any topic. Be conversational and natural.'
        }
      ];
      
      if (context && context.length > 0) {
        const recentContext = context.slice(-6);
        for (const msg of recentContext) {
          messages.push({
            role: msg.role,
            content: msg.content
          });
        }
      }
      
      messages.push({
        role: 'user',
        content: prompt
      });

      const response = await axios.post(
        this.baseURL,
        {
          messages: messages,
          max_tokens: 500,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      const reply = response.data?.result?.response;
      
      if (reply && reply.trim()) {
        console.log('✅ AI response received');
        return reply;
      }
      
      console.log('⚠️ Empty response from AI');
      return "I received your question but couldn't generate a response. Please try again.";

    } catch (error) {
      if (error.response) {
        console.error('❌ API Error:', error.response.status);
        
        if (error.response.status === 401) {
          return "⚠️ Invalid Cloudflare API token. Please check your .env file.";
        }
        if (error.response.status === 404) {
          return "⚠️ Invalid Cloudflare Account ID. Please check your .env file.";
        }
        if (error.response.status === 429) {
          return "⚠️ Rate limit exceeded. Please wait a moment and try again.";
        }
      } else if (error.request) {
        console.error('❌ Network Error: No response received');
        return "⚠️ Network error. Please check your internet connection.";
      } else {
        console.error('❌ Error:', error.message);
      }
      
      return "⚠️ Sorry, I encountered an error. Please try again in a moment.";
    }
  }

  async summarizeArticle(articleContent) {
    if (!this.useAI) {
      const sentences = articleContent.split(/[.!?]+/).filter(s => s.trim());
      return sentences.slice(0, 2).join('. ') + '.';
    }

    try {
      const response = await axios.post(
        this.baseURL,
        {
          messages: [
            { role: 'system', content: 'Summarize the following text in 2-3 sentences.' },
            { role: 'user', content: articleContent.substring(0, 2000) }
          ],
          max_tokens: 150,
          temperature: 0.3
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data?.result?.response || articleContent.substring(0, 200) + '...';
    } catch (error) {
      return articleContent.substring(0, 200) + '...';
    }
  }

  async detectFakeNews(articleText) {
    if (!this.useAI) {
      return { labels: ["requires verification"], scores: [0.5] };
    }
    
    try {
      const response = await axios.post(
        this.baseURL,
        {
          messages: [
            { role: 'system', content: 'Analyze if this text is factual or misleading. Respond with JSON.' },
            { role: 'user', content: articleText.substring(0, 1000) }
          ],
          max_tokens: 200,
          temperature: 0.1
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data?.result?.response || { labels: ["unverified"], scores: [1] };
    } catch (error) {
      return { labels: ["unverified"], scores: [1] };
    }
  }
}

export const aiService = new AIService();