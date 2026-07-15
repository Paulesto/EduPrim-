import { useState, useEffect } from 'react'
import teacherService from '../../services/teacherService'

const Teachers = () => {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editTeacher, setEditTeacher] = useState(null)
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', telephone: '' })
  const [error, setError] = useState('')

  const fetchTeachers = async () => {
    try {
      const res = await teacherService.getAll()
      setTeachers(res.data.teachers)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTeachers() }, [])

  const openCreate = () => {
    setEditTeacher(null)
    setForm({ nom: '', prenom: '', email: '', telephone: '' })
    setError('')
    setShowModal(true)
  }

  const openEdit = (teacher) => {
    setEditTeacher(teacher)
    setForm({ nom: teacher.nom, prenom: teacher.prenom, email: teacher.email, telephone: teacher.telephone })
    setError('')
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editTeacher) {
        await teacherService.update(editTeacher.id, form)
      } else {
        await teacherService.create(form)
      }
      setShowModal(false)
      fetchTeachers()
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet enseignant ?')) return
    try {
      await teacherService.delete(id)
      fetchTeachers()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Enseignants</h1>
          <p className="text-sm text-gray-400 mt-1">{teachers.length} enseignant(s)</p>
        </div>
        <button onClick={openCreate}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium cursor-pointer">
          + Ajouter un enseignant
        </button>
      </div>

      {loading ? <p className="text-gray-400">Chargement...</p> : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['Nom', 'Prénom', 'Email', 'Téléphone', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teachers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">Aucun enseignant trouvé</td>
                </tr>
              ) : teachers.map(teacher => (
                <tr key={teacher.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{teacher.nom}</td>
                  <td className="px-4 py-3 text-gray-500">{teacher.prenom}</td>
                  <td className="px-4 py-3 text-gray-500">{teacher.email}</td>
                  <td className="px-4 py-3 text-gray-500">{teacher.telephone}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(teacher)}
                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium hover:bg-blue-100 cursor-pointer">
                        Modifier
                      </button>
                      <button onClick={() => handleDelete(teacher.id)}
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
              {editTeacher ? "Modifier l'enseignant" : 'Ajouter un enseignant'}
            </h2>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg mb-4">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Nom', key: 'nom', type: 'text' },
                { label: 'Prénom', key: 'prenom', type: 'text' },
                { label: 'Email', key: 'email', type: 'email' },
                { label: 'Téléphone', key: 'telephone', type: 'text' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">{field.label}</label>
                  <input
                    type={field.type}
                    value={form[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                    required
                  />
                </div>
              ))}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm cursor-pointer hover:bg-gray-50">
                  Annuler
                </button>
                <button type="submit"
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 cursor-pointer">
                  {editTeacher ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Teachers