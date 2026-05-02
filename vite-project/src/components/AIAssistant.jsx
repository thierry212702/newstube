import { useState } from 'react'
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi'
import { aiAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [chatId, setChatId] = useState(null)
  const { user } = useAuth()

  const sendMessage = async () => {
    if (!message.trim() || !user) return
    
    setLoading(true)
    try {
      const { data } = await aiAPI.chat({ 
        message, 
        chatId 
      })
      
      setChatHistory(data.data.messages)
      setChatId(data.data.chatId)
      setMessage('')
    } catch (error) {
      console.error('AI chat error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-brand-600 to-brand-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-50"
      >
        {isOpen ? <FiX className="text-2xl text-white" /> : <FiMessageCircle className="text-2xl text-white" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl flex flex-col z-50">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Newstube AI Assistant
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-xl ${
                    msg.role === 'user'
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-700 text-slate-200'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 p-3 rounded-xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask me anything about news..."
                className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-brand-500 outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 rounded-xl text-white transition-colors"
              >
                <FiSend />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AIAssistant