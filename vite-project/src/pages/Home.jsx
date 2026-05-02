import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPlay, FiFileText, FiZap, FiArrowRight } from 'react-icons/fi'
import ArticleCard from '../components/ArticleCard'
import VideoCard from '../components/VideoCard'
import TrendingTopics from '../components/TrendingTopics'
import { articleAPI, videoAPI } from '../services/api'

const Home = () => {
  const [articles, setArticles] = useState([])
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [articleRes, videoRes] = await Promise.all([
          articleAPI.getAll({ limit: 6 }),
          videoAPI.getAll({ limit: 6 })
        ])
        setArticles(articleRes.data.data)
        setVideos(videoRes.data.data)
      } catch (error) {
        console.error('Fetch error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 lg:p-12 mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
              Your AI-Powered
              <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent"> News Hub</span>
            </h1>
            <p className="text-slate-400 text-lg mb-6">
              Discover personalized news, trending videos, and get instant answers from our AI assistant.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/ai-chat"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:shadow-lg transition-all"
              >
                <FiZap /> Ask AI Assistant
              </Link>
              <Link
                to="/feed"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white font-semibold hover:bg-slate-700 transition-all"
              >
                Personalize Feed <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'articles', 'videos'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-brand-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Videos Grid */}
          {(activeTab === 'all' || activeTab === 'videos') && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FiPlay className="text-brand-400" /> Latest Videos
                </h2>
                <Link to="/videos" className="text-brand-400 text-sm hover:underline">
                  View All
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {videos.slice(0, 4).map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            </div>
          )}

          {/* Articles Grid */}
          {(activeTab === 'all' || activeTab === 'articles') && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FiFileText className="text-brand-400" /> Top Stories
                </h2>
                <Link to="/articles" className="text-brand-400 text-sm hover:underline">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {articles.slice(0, 4).map((article) => (
                  <ArticleCard key={article._id} article={article} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <TrendingTopics />
          
          {/* Quick Stats */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-4">Today's Updates</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">New Articles</span>
                <span className="text-brand-400 font-semibold">{articles.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">New Videos</span>
                <span className="text-brand-400 font-semibold">{videos.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">AI Ready</span>
                <span className="text-green-400 font-semibold">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home