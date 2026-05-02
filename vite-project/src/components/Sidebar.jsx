import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiPlay, FiFileText, FiTrendingUp, FiBookmark, FiClock, FiThumbsUp, FiMessageSquare, FiGlobe, FiMonitor, FiHeart, FiActivity, FiBriefcase } from 'react-icons/fi'

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  const mainLinks = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/feed', icon: FiTrendingUp, label: 'For You' },
    { path: '/videos', icon: FiPlay, label: 'Videos' },
    { path: '/articles', icon: FiFileText, label: 'Articles' },
  ]

  const categories = [
    { icon: FiGlobe, label: 'World', query: 'world' },
    { icon: FiBriefcase, label: 'Business', query: 'business' },
    { icon: FiMonitor, label: 'Technology', query: 'technology' },
    { icon: FiActivity, label: 'Sports', query: 'sports' },
    { icon: FiHeart, label: 'Health', query: 'health' },
  ]

  const libraryLinks = [
    { path: '/history', icon: FiClock, label: 'History' },
    { path: '/liked', icon: FiThumbsUp, label: 'Liked' },
    { path: '/saved', icon: FiBookmark, label: 'Saved' },
  ]

  return (
    <aside className={`hidden lg:block fixed left-0 top-16 bottom-0 bg-slate-900 border-r border-slate-700/50 overflow-y-auto transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-sm transition-colors mb-4"
        >
          {collapsed ? '→' : '← Collapse'}
        </button>

        {/* Main Navigation */}
        <div className="space-y-1 mb-6">
          {mainLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? 'bg-brand-600/20 text-brand-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <link.icon className="text-lg flex-shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          ))}
        </div>

        {/* Categories */}
        {!collapsed && <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Categories</h3>}
        <div className="space-y-1 mb-6">
          {categories.map((cat) => (
            <Link
              key={cat.query}
              to={`/articles?category=${cat.query}`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <cat.icon className="text-lg flex-shrink-0" />
              {!collapsed && <span>{cat.label}</span>}
            </Link>
          ))}
        </div>

        {/* Library */}
        {!collapsed && <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Library</h3>}
        <div className="space-y-1">
          {libraryLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <link.icon className="text-lg flex-shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar