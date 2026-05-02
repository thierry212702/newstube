import axios from 'axios'

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getProfile: () => API.get('/auth/profile'),
  updatePreferences: (data) => API.put('/auth/preferences', data),
}

export const articleAPI = {
  getAll: (params) => API.get('/articles', { params }),
  getById: (id) => API.get(`/articles/${id}`),
  like: (id) => API.post(`/articles/${id}/like`),
}

export const videoAPI = {
  getAll: (params) => API.get('/videos', { params }),
  getById: (id) => API.get(`/videos/${id}`),
}

export const aiAPI = {
  chat: (data) => API.post('/ai/chat', data),
  getHistory: () => API.get('/ai/history'),
  summarize: (text) => API.post('/ai/summarize', { text }),
  factCheck: (text) => API.post('/ai/fact-check', { text }),
}

export const recommendationAPI = {
  getFeed: () => API.get('/recommendations/feed'),
  getTrending: () => API.get('/recommendations/trending'),
  recordInteraction: (data) => API.post('/recommendations/interaction', data),
}

export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  createArticle: (data) => API.post('/admin/articles', data),
  updateArticle: (id, data) => API.put(`/admin/articles/${id}`, data),
  deleteArticle: (id) => API.delete(`/admin/articles/${id}`),
}

export default API