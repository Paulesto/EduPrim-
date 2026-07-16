import api from './api'

const teacherService = {
  getAll: (params = {}) => api.get('/school/teachers', { params }),
  getOne: (id) => api.get(`/school/teachers/${id}`),
  create: (data) => api.post('/school/teachers', data),
  update: (id, data) => api.put(`/school/teachers/${id}`, data),
  delete: (id) => api.delete(`/school/teachers/${id}`),
}

export default teacherService
