import api from './api'

const classroomService = {
  getAll: () => api.get('/school/classrooms'),
  create: (data) => api.post('/school/classrooms', data),
  update: (id, data) => api.put(`/school/classrooms/${id}`, data),
  delete: (id) => api.delete(`/school/classrooms/${id}`),
}

export default classroomService