import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { aiService } from '../services/aiService.js';
import ChatHistory from '../models/ChatHistory.js';

const router = express.Router();

// POST /api/ai/chat - Chat with AI assistant
router.post('/chat', protect, async (req, res) => {
  try {
    const { message, chatId } = req.body;
    
    let chatHistory;
    
    if (chatId) {
      chatHistory = await ChatHistory.findById(chatId);
    }
    
    if (!chatHistory) {
      chatHistory = new ChatHistory({
        userId: req.user._id,
        messages: [],
        context: { language: 'en' }
      });
    }
    
    // Add user message
    chatHistory.messages.push({
      role: 'user',
      content: message
    });
    
    // Get AI response
    const context = chatHistory.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    const aiResponse = await aiService.generateResponse(message, context);
    
    // Add AI response
    chatHistory.messages.push({
      role: 'assistant',
      content: aiResponse
    });
    
    await chatHistory.save();
    
    res.json({
      success: true,
      data: {
        chatId: chatHistory._id,
        response: aiResponse,
        messages: chatHistory.messages
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/ai/history - Get chat history
router.get('/history', protect, async (req, res) => {
  try {
    const chats = await ChatHistory.find({ 
      userId: req.user._id,
      isActive: true 
    })
    .sort({ updatedAt: -1 })
    .limit(20);
    
    res.json({
      success: true,
      data: chats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/ai/summarize - Summarize text
router.post('/summarize', async (req, res) => {
  try {
    const { text } = req.body;
    const summary = await aiService.summarizeArticle(text);
    
    res.json({
      success: true,
      data: { summary }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/ai/fact-check - Check facts
router.post('/fact-check', async (req, res) => {
  try {
    const { text } = req.body;
    const result = await aiService.detectFakeNews(text);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;