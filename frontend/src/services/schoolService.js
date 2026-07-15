import api from './api'

const schoolService = {
  getAll: () => api.get('/super-admin/schools'),
  getOne: (id) => api.get(`/super-admin/schools/${id}`),
  create: (data) => api.post('/super-admin/schools', data),
  update: (id, data) => api.put(`/super-admin/schools/${id}`, data),
  delete: (id) => api.delete(`/super-admin/schools/${id}`),
}

export default schoolService