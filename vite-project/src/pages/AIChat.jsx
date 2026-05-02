import { useState, useEffect, useRef } from 'react'
import { FiSend, FiZap, FiRefreshCw, FiMessageSquare } from 'react-icons/fi'
import { aiAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const AIChat = () => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [chatId, setChatId] = useState(null)
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const { user } = useAuth()

  useEffect(() => {
    scrollToBottom()
    loadHistory()
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadHistory = async () => {
    try {
      const { data } = await aiAPI.getHistory()
      if (data.data.length > 0) {
        setChatId(data.data[0]._id)
        setMessages(data.data[0].messages)
      }
    } catch (error) {
      console.error('History error:', error)
    }
  }

  const sendMessage = async () => {
    if (!message.trim() || !user) return

    const userMessage = { role: 'user', content: message }
    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setLoading(true)

    try {
      const { data } = await aiAPI.chat({ message, chatId })
      const aiMessage = data.data.messages[data.data.messages.length - 1]
      setMessages(data.data.messages)
      setChatId(data.data.chatId)
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }])
    } finally {
      setLoading(false)
      scrollToBottom()
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <FiZap className="text-purple-400" />
          AI Assistant
        </h1>
        <p className="text-slate-400 mt-2">
          Ask me anything about news, get explanations, or fact-check information
        </p>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="h-[600px] overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <FiMessageSquare className="text-6xl text-slate-700 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Start a Conversation</h3>
              <p className="text-slate-400 max-w-md">
                Ask about current events, get news summaries, or have complex topics explained in simple terms
              </p>
              <div className="grid grid-cols-2 gap-3 mt-6">
                {[
                  "What's happening in the world today?",
                  "Explain quantum computing",
                  "Fact-check the latest climate news",
                  "Summarize tech trends 2024"
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setMessage(suggestion)}
                    className="p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-left text-sm text-slate-300 hover:border-brand-500 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-4 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white'
                      : 'bg-slate-700/50 border border-slate-600 text-slate-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-xs mt-2 opacity-70">
                    {msg.role === 'user' ? 'You' : 'Newstube AI'}
                  </p>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-700/50 border border-slate-600 p-4 rounded-2xl">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-slate-700">
          <div className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about news, get explanations..."
              className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-brand-500 outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !message.trim()}
              className="px-6 py-3 bg-gradient-to-r from-brand-600 to-brand-700 rounded-xl text-white font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
            >
              <FiSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIChat