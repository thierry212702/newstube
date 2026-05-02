import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import AIAssistant from './components/AIAssistant'
import Home from './pages/Home'
import Feed from './pages/Feed'
import Videos from './pages/Videos'
import Articles from './pages/Articles'
import AIChat from './pages/AIChat'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/admin/Dashboard'
import ArticleManagement from './pages/admin/ArticleManagement'
import VideoManagement from './pages/admin/VideoManagement'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-16">
        <Sidebar />
        <main className="flex-1 ml-0 lg:ml-64 p-4 lg:p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/ai-chat" element={<AIChat />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/articles" element={<ProtectedRoute><ArticleManagement /></ProtectedRoute>} />
            <Route path="/admin/articles/new" element={<ProtectedRoute><ArticleManagement /></ProtectedRoute>} />
            <Route path="/admin/videos" element={<ProtectedRoute><VideoManagement /></ProtectedRoute>} />
            <Route path="/admin/videos/new" element={<ProtectedRoute><VideoManagement /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
      <AIAssistant />
      <Footer />
    </div>
  )
}

export default App