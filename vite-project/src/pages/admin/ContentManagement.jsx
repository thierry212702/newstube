import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi'
import { adminAPI } from '../../services/api'
import toast from 'react-hot-toast'

const ContentManagement = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingArticle, setEditingArticle] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    category: 'general',
    author: '',
    tags: ''
  })

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const { data } = await adminAPI.getStats()
      setArticles(data.data.topArticles || [])
    } catch (error) {
      toast.error('Failed to load articles')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      }

      if (editingArticle) {
        await adminAPI.updateArticle(editingArticle._id, payload)
        toast.success('Article updated')
      } else {
        await adminAPI.createArticle(payload)
        toast.success('Article created')
      }
      
      setShowModal(false)
      resetForm()
      fetchArticles()
    } catch (error) {
      toast.error('Operation failed')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article?')) return
    try {
      await adminAPI.deleteArticle(id)
      toast.success('Article deleted')
      fetchArticles()
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const handleEdit = (article) => {
    setEditingArticle(article)
    setFormData({
      title: article.title || '',
      content: article.content || '',
      summary: article.summary || '',
      category: article.category || 'general',
      author: article.author || '',
      tags: article.tags?.join(', ') || ''
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setEditingArticle(null)
    setFormData({
      title: '',
      content: '',
      summary: '',
      category: 'general',
      author: '',
      tags: ''
    })
  }

  const inputClass = "w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-brand-500 outline-none"

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Content Management</h1>
          <p className="text-slate-400">Manage articles and content</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 rounded-xl text-white font-semibold transition-colors"
        >
          <FiPlus /> Add Article
        </button>
      </div>

      {/* Articles Table */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left p-4 text-slate-400 font-medium text-sm">Title</th>
                <th className="text-left p-4 text-slate-400 font-medium text-sm">Category</th>
                <th className="text-left p-4 text-slate-400 font-medium text-sm">Views</th>
                <th className="text-right p-4 text-slate-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article._id} className="border-b border-slate-700/50">
                  <td className="p-4 text-white">{article.title}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-brand-500/20 text-brand-400 rounded text-xs">
                      {article.category}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{article.views || 0}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(article)}
                        className="p-2 bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(article._id)}
                        className="p-2 bg-slate-700 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingArticle ? 'Edit Article' : 'New Article'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <FiX className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Content *</label>
                <textarea
                  required
                  rows="5"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Summary</label>
                <input
                  type="text"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={inputClass}
                  >
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
                  <label className="block text-sm text-slate-400 mb-1">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className={inputClass}
                    placeholder="Staff Writer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className={inputClass}
                  placeholder="news, technology, AI"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 rounded-xl text-white font-semibold transition-colors"
              >
                {editingArticle ? 'Update Article' : 'Create Article'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContentManagement