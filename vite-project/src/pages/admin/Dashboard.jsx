import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiUsers, FiFileText, FiPlay, FiMessageSquare, FiTrendingUp, FiPlus } from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { adminAPI } from '../../services/api'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const { data } = await adminAPI.getStats()
      setStats(data.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { icon: FiFileText, label: 'Articles', value: stats?.totalArticles || 0, color: 'from-blue-600 to-blue-700', link: '/admin/articles' },
    { icon: FiPlay, label: 'Videos', value: stats?.totalVideos || 0, color: 'from-purple-600 to-purple-700', link: '/admin/videos' },
    { icon: FiUsers, label: 'Users', value: stats?.totalUsers || 0, color: 'from-green-600 to-green-700', link: '/admin/users' },
    { icon: FiMessageSquare, label: 'AI Chats', value: stats?.totalChats || 0, color: 'from-orange-600 to-orange-700', link: '/admin' },
  ]

  const chartData = stats?.articlesByCategory || []

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-400 mt-1">Manage your Newstube platform</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/articles/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition-colors"
          >
            <FiPlus /> Add Article
          </Link>
          <Link
            to="/admin/videos/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-medium transition-colors"
          >
            <FiPlus /> Add Video
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-brand-500/50 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="text-xl text-white" />
              </div>
              <FiTrendingUp className="text-green-400" />
            </div>
            <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
            <p className="text-slate-400 text-sm">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-6">Articles by Category</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="_id" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="count" fill="#0284c7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-slate-400 text-center py-12">No data yet</p>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/admin/articles" className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
          <FiFileText className="text-3xl text-blue-400 mb-3" />
          <h3 className="text-lg font-semibold text-white">Manage Articles</h3>
          <p className="text-slate-400 text-sm">Create and edit news articles</p>
        </Link>
        <Link to="/admin/videos" className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
          <FiPlay className="text-3xl text-purple-400 mb-3" />
          <h3 className="text-lg font-semibold text-white">Manage Videos</h3>
          <p className="text-slate-400 text-sm">Add and manage video content</p>
        </Link>
        <Link to="/admin/users" className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-green-500/50 transition-all">
          <FiUsers className="text-3xl text-green-400 mb-3" />
          <h3 className="text-lg font-semibold text-white">Manage Users</h3>
          <p className="text-slate-400 text-sm">View and manage user accounts</p>
        </Link>
        <Link to="/" className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-brand-500/50 transition-all">
          <FiPlay className="text-3xl text-brand-400 mb-3" />
          <h3 className="text-lg font-semibold text-white">View Site</h3>
          <p className="text-slate-400 text-sm">Go to the main website</p>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard