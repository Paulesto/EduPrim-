import { useState, useEffect } from 'react'
import api from '../../services/api'

const Admins = () => {
  const [admins, setAdmins] = useState([])
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editAdmin, setEditAdmin] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', telephone: '', school_id: '' })
  const [error, setError] = useState('')

  const fetchAdmins = async () => {
    try {
      const res = await api.get('/super-admin/admins')
      setAdmins(res.data.admins)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchSchools = async () => {
    try {
      const res = await api.get('/super-admin/schools')
      setSchools(res.data.schools)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchAdmins()
    fetchSchools()
  }, [])

  const openCreate = () => {
    setEditAdmin(null)
    setForm({ name: '', email: '', telephone: '', school_id: '' })
    setError('')
    setShowModal(true)
  }

  const openEdit = (admin) => {
    setEditAdmin(admin)
    setForm({ name: admin.name, email: admin.email, telephone: admin.telephone || '', school_id: admin.school_id || '' })
    setError('')
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editAdmin) {
        await api.put(`/super-admin/admins/${editAdmin.id}`, form)
      } else {
        await api.post('/super-admin/admins', form)
      }
      setShowModal(false)
      fetchAdmins()
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue')
    }
  }

  const handleToggle = async (id) => {
    try {
      await api.put(`/super-admin/admins/${id}/toggle`)
      fetchAdmins()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet administrateur ?')) return
    try {
      await api.delete(`/super-admin/admins/${id}`)
      fetchAdmins()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Administrateurs</h1>
          <p className="text-sm text-gray-400 mt-1">{admins.length} administrateur(s)</p>
        </div>
        <button onClick={openCreate}
          className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer">
          + Nouvel administrateur
        </button>
      </div>

      {loading ? <p className="text-gray-400">Chargement...</p> : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['Nom', 'Email', 'Téléphone', 'École', 'Statut', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {admins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">Aucun administrateur trouvé</td>
                </tr>
              ) : admins.map(admin => (
                <tr key={admin.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{admin.name}</td>
                  <td className="px-4 py-3 text-gray-500">{admin.email}</td>
                  <td className="px-4 py-3 text-gray-500">{admin.telephone || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{admin.school?.nom || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      admin.is_active
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {admin.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(admin)}
                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium hover:bg-blue-100 cursor-pointer">
                        Modifier
                      </button>
                      <button onClick={() => handleToggle(admin.id)}
                        className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer ${
                          admin.is_active
                            ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}>
                        {admin.is_active ? 'Désactiver' : 'Activer'}
                      </button>
                      <button onClick={() => handleDelete(admin.id)}
                        className="px-3 py-1 bg-red-50 text-red-600 rounded-md text-xs font-medium hover:bg-red-100 cursor-pointer">
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[460px] shadow-2xl">
            <h2 className="text-base font-semibold text-gray-800 mb-5">
              {editAdmin ? "Modifier l'administrateur" : 'Nouvel administrateur'}
            </h2>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg mb-4">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Nom', key: 'name', type: 'text' },
                { label: 'Email', key: 'email', type: 'email' },
                { label: 'Téléphone', key: 'telephone', type: 'text' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">{field.label}</label>
                  <input
                    type={field.type}
                    value={form[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-400 focus:ring-1 focus:ring-green-100"
                    required
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">École</label>
                <select
                  value={form.school_id}
                  onChange={(e) => setForm({ ...form, school_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-400 focus:ring-1 focus:ring-green-100"
                  required
                >
                  <option value="">Sélectionner une école</option>
                  {schools.map(school => (
                    <option key={school.id} value={school.id}>{school.nom}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm cursor-pointer hover:bg-gray-50">
                  Annuler
                </button>
                <button type="submit"
                  className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 cursor-pointer">
                  {editAdmin ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admins