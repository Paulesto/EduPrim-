import api from './api'

const subjectService = {
  getAll: () => api.get('/school/subjects'),
  create: (data) => api.post('/school/subjects', data),
  update: (id, data) => api.put(`/school/subjects/${id}`, data),
  delete: (id) => api.delete(`/school/subjects/${id}`),
}

export default subjectService