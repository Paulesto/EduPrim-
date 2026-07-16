import api from './api'

const studentService = {
  getAll: (params = {}) => api.get('/school/students', { params }),
  getOne: (id) => api.get(`/school/students/${id}`),
  create: (data) => api.post('/school/students', data),
  update: (id, data) => api.put(`/school/students/${id}`, data),
  delete: (id) => api.delete(`/school/students/${id}`),
}

export default studentService