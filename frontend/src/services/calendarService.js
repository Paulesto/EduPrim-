import api from './api'

const calendarService = {
  getAll: () => api.get('/school/calendars'),
  create: (data) => api.post('/school/calendars', data),
  update: (id, data) => api.put(`/school/calendars/${id}`, data),
  delete: (id) => api.delete(`/school/calendars/${id}`),
}

export default calendarService