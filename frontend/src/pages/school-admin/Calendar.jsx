import { useState, useEffect } from 'react'
import calendarService from '../../services/calendarService'

const typeConfig = {
  vacances: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  examen: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  reunion: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
  sortie: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
}

const Calendar = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editEvent, setEditEvent] = useState(null)
  const [form, setForm] = useState({ titre: '', type: 'examen', date_debut: '', date_fin: '', description: '' })
  const [error, setError] = useState('')

  const fetchEvents = async () => {
    try {
      const res = await calendarService.getAll()
      setEvents(res.data.events)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEvents() }, [])

  const openCreate = () => {
    setEditEvent(null)
    setForm({ titre: '', type: 'examen', date_debut: '', date_fin: '', description: '' })
    setError('')
    setShowModal(true)
  }

  const openEdit = (event) => {
    setEditEvent(event)
    setForm({ titre: event.titre, type: event.type, date_debut: event.date_debut, date_fin: event.date_fin, description: event.description || '' })
    setError('')
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editEvent) {
        await calendarService.update(editEvent.id, form)
      } else {
        await calendarService.create(form)
      }
      setShowModal(false)
      fetchEvents()
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet événement ?')) return
    try {
      await calendarService.delete(id)
      fetchEvents()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Calendrier scolaire</h1>
          <p className="text-sm text-gray-400 mt-1">{events.length} événement(s)</p>
        </div>
        <button onClick={openCreate}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium cursor-pointer">
          + Ajouter un événement
        </button>
      </div>

      {loading ? <p className="text-gray-400">Chargement...</p> : (
        <div className="space-y-3">
          {events.length === 0 ? (
            <p className="text-gray-400 text-center py-10">Aucun événement trouvé</p>
          ) : events.map(event => {
            const config = typeConfig[event.type] || typeConfig.examen
            return (
              <div key={event.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                <div className={`w-1 h-12 rounded-full ${config.dot} flex-shrink-0`} />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{event.titre}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{event.date_debut} → {event.date_fin}</p>
                  {event.description && <p className="text-xs text-gray-400 mt-0.5">{event.description}</p>}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                  {event.type}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(event)}
                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium hover:bg-blue-100 cursor-pointer">
                    Modifier
                  </button>
                  <button onClick={() => handleDelete(event.id)}
                    className="px-3 py-1 bg-red-50 text-red-600 rounded-md text-xs font-medium hover:bg-red-100 cursor-pointer">
                    Supprimer
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[480px] shadow-2xl">
            <h2 className="text-base font-semibold text-gray-800 mb-5">
              {editEvent ? "Modifier l'événement" : 'Ajouter un événement'}
            </h2>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg mb-4">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Titre</label>
                <input type="text" value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400">
                  <option value="vacances">Vacances</option>
                  <option value="examen">Examen</option>
                  <option value="reunion">Réunion</option>
                  <option value="sortie">Sortie pédagogique</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Date début</label>
                  <input type="date" value={form.date_debut} onChange={(e) => setForm({ ...form, date_debut: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Date fin</label>
                  <input type="date" value={form.date_fin} onChange={(e) => setForm({ ...form, date_fin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 min-h-[80px]" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm cursor-pointer hover:bg-gray-50">
                  Annuler
                </button>
                <button type="submit"
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 cursor-pointer">
                  {editEvent ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Calendar