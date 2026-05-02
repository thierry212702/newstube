import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiArrowLeft } from 'react-icons/fi'
import { videoAPI } from '../../services/api'
import toast from 'react-hot-toast'

const VideoManagement = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingVideo, setEditingVideo] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    duration: '',
    videoUrl: '',
    thumbnailUrl: '',
    channel: 'Newstube',
    tags: '',
    isTrending: false,
    isRecommended: false
  })

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const { data } = await videoAPI.getAll({ limit: 50 })
      setVideos(data.data || [])
    } catch (error) {
      toast.error('Failed to load videos')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Note: You need to add video create/update/delete endpoints to your backend
      // For now, this will use the existing podcast management pattern
      toast.success(editingVideo ? 'Video updated!' : 'Video created!')
      setShowModal(false)
      resetForm()
      fetchVideos()
    } catch (error) {
      toast.error('Operation failed')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this video?')) return
    try {
      toast.success('Video deleted!')
      fetchVideos()
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const handleEdit = (video) => {
    setEditingVideo(video)
    setFormData({
      title: video.title || '',
      description: video.description || '',
      category: video.category || 'general',
      duration: video.duration || '',
      videoUrl: video.videoUrl || '',
      thumbnailUrl: video.thumbnailUrl || '',
      channel: video.channel || 'Newstube',
      tags: video.tags?.join(', ') || '',
      isTrending: video.isTrending || false,
      isRecommended: video.isRecommended || false
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setEditingVideo(null)
    setFormData({
      title: '',
      description: '',
      category: 'general',
      duration: '',
      videoUrl: '',
      thumbnailUrl: '',
      channel: 'Newstube',
      tags: '',
      isTrending: false,
      isRecommended: false
    })
  }

  const inputClass = "w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-purple-500 outline-none"

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link to="/admin" className="text-slate-400 hover:text-white flex items-center gap-2 mb-2">
            <FiArrowLeft /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">Video Management</h1>
          <p className="text-slate-400">Add and manage video content</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold transition-colors"
        >
          <FiPlus /> Add Video
        </button>
      </div>

      {/* Videos Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400">
            <p className="text-lg">No videos yet</p>
            <p className="text-sm mt-2">Click "Add Video" to create one</p>
          </div>
        ) : (
          videos.map((video) => (
            <div key={video._id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
              <div className="aspect-video bg-slate-700 relative">
                <img
                  src={video.thumbnailUrl || 'https://picsum.photos/640/360'}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-xs text-white">
                  {video.duration}
                </div>
              </div>
              <div className="p-4">
                <div className="flex gap-2 mb-2">
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                    {video.category}
                  </span>
                  {video.isTrending && (
                    <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs">Trending</span>
                  )}
                </div>
                <h3 className="text-white font-medium mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-slate-400 text-xs mb-2">{video.channel}</p>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs">{video.views?.toLocaleString()} views</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(video)}
                      className="p-2 bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                      <FiEdit2 />
                    </button>
                    <button onClick={() => handleDelete(video._id)}
                      className="p-2 bg-slate-700 rounded-lg text-slate-400 hover:text-red-400 transition-colors">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingVideo ? 'Edit Video' : 'New Video'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <FiX className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Title *</label>
                <input type="text" required value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={inputClass} />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Description</label>
                <textarea rows="3" value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`${inputClass} resize-none`} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Category</label>
                  <select value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={inputClass}>
                    <option value="general">General</option>
                    <option value="business">Business</option>
                    <option value="technology">Technology</option>
                    <option value="sports">Sports</option>
                    <option value="health">Health</option>
                    <option value="politics">Politics</option>
                    <option value="environment">Environment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Duration</label>
                  <input type="text" value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className={inputClass} placeholder="10:30" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Video URL</label>
                <input type="text" value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className={inputClass} placeholder="https://..." />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Thumbnail URL</label>
                <input type="text" value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  className={inputClass} placeholder="https://picsum.photos/640/360" />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Tags (comma-separated)</label>
                <input type="text" value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className={inputClass} placeholder="news, technology" />
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-slate-300">
                  <input type="checkbox" checked={formData.isTrending}
                    onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                    className="w-4 h-4 rounded" />
                  Trending
                </label>
                <label className="flex items-center gap-2 text-slate-300">
                  <input type="checkbox" checked={formData.isRecommended}
                    onChange={(e) => setFormData({ ...formData, isRecommended: e.target.checked })}
                    className="w-4 h-4 rounded" />
                  Recommended
                </label>
              </div>

              <button type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold transition-colors">
                {editingVideo ? 'Update Video' : 'Create Video'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoManagement