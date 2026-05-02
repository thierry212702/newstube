import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FiSearch, FiMenu, FiX, FiBell, FiUser, FiLogOut, FiSettings, FiHome, FiPlay, FiFileText, FiTrendingUp } from 'react-icons/fi'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, logout, isAdmin } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/articles?search=${searchQuery}`)
      setSearchQuery('')
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-b border-slate-700/50 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">
                Newstube
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              <Link
                to="/"
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  location.pathname === '/' ? 'text-brand-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FiHome /> Home
              </Link>
              <Link
                to="/videos"
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  location.pathname === '/videos' ? 'text-brand-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FiPlay /> Videos
              </Link>
              <Link
                to="/articles"
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  location.pathname === '/articles' ? 'text-brand-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FiFileText /> Articles
              </Link>
              <Link
                to="/feed"
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  location.pathname === '/feed' ? 'text-brand-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FiTrendingUp /> For You
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search news, videos, topics..."
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-sm"
              />
            </div>
          </form>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* AI Chat Link */}
            <Link
              to="/ai-chat"
              className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white text-sm font-medium hover:shadow-lg transition-all"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              AI Chat
            </Link>

            {/* Notifications */}
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <FiBell className="text-xl" />
            </button>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="px-3 py-1.5 bg-amber-500/20 text-amber-400 rounded-lg text-xs font-medium border border-amber-500/30"
                  >
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center">
                    <FiUser className="text-white text-sm" />
                  </div>
                  <span className="text-sm text-slate-400 hidden lg:block">{user.username}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <FiLogOut />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 rounded-lg text-white text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white"
            >
              {isOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-slate-700 py-4">
            <div className="flex flex-col gap-3">
              <form onSubmit={handleSearch} className="md:hidden mb-3">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  />
                </div>
              </form>
              {['/', '/videos', '/articles', '/feed', '/ai-chat'].map((path) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    location.pathname === path
                      ? 'bg-brand-600/20 text-brand-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {path === '/' ? 'Home' : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar