import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout:30000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('alertaUrbano_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('alertaUrbano_token')
      localStorage.removeItem('alertaUrbano_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  register: (dados) => api.post('/auth/register', dados),
  login: (dados) => api.post('/auth/login', dados),
  getMe: () => api.get('/auth/me'),
}

export const reportService = {
  getAll: (filtros) => api.get('/reports', { params: filtros }),
  getById: (id) => api.get(`/reports/${id}`),
  getHighlights: () => api.get('/reports/highlights'),
  getStats: () => api.get('/reports/stats'),
  getUserReports: (userId) => api.get(`/reports/user/${userId}`),
  create: (formData) => api.post('/reports', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  like: (id) => api.put(`/reports/${id}/like`),
  repost: (id) => api.put(`/reports/${id}/repost`),
}

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getReports: (filtros) => api.get('/admin/reports', { params: filtros }),
  updateStatus: (id, dados) => api.put(`/admin/reports/${id}/status`, dados),
  deleteReport: (id) => api.delete(`/admin/reports/${id}`),
  getUsers: () => api.get('/admin/users'),
}

export default api