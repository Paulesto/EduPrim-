import { useState, useEffect, useCallback } from 'react'
import teacherService from '../../services/teacherService'
import exportService from '../../services/exportService'
import { useAuth } from '../../context/AuthContext'
import Pagination from '../../components/ui/Pagination'
import Toast from '../../components/ui/Toast'
import ConfirmModal from '../../components/ui/ConfirmModal'

const Teachers = () => {
  const { user } = useAuth()
  const [teachers, setTeachers] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editTeacher, setEditTeacher] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', telephone: '' })
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  const fetchTeachers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await teacherService.getAll({ search, page, per_page: 10 })
      setTeachers(res.data.teachers)
      setPagination(res.data.pagination)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [search, page])

  useEffect(() => {
    const timer = setTimeout(fetchTeachers, 300)
    return () => clearTimeout(timer)
  }, [fetchTeachers])

const handleExportPDF = async () => {
  try {
    const res = await teacherService.getAll({ per_page: 1000 })
    exportService.exportTeachersPDF(res.data.teachers, user?.school?.nom || 'EduPrim')
    showToast('PDF exporté avec succès !')
  } catch (err) {
    showToast('Erreur lors de l\'export', 'error')
  }
}

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
        showToast('Enseignant modifié avec succès !')
      } else {
        await teacherService.create(form)
        showToast('Enseignant ajouté avec succès !')
      }
      setShowModal(false)
      fetchTeachers()
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue')
    }
  }

  const handleDelete = async () => {
    try {
      await teacherService.delete(deleteId)
      showToast('Enseignant supprimé avec succès !')
      setDeleteId(null)
      fetchTeachers()
    } catch (err) {
      showToast('Erreur lors de la suppression', 'error')
    }
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {deleteId && (
        <ConfirmModal
          message="Êtes-vous sûr de vouloir supprimer cet enseignant ?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
  <div>
    <h1 className="text-xl font-semibold text-gray-800">Enseignants</h1>
    <p className="text-sm text-gray-400 mt-1">{pagination?.total || 0} enseignant(s)</p>
  </div>
  <div className="flex gap-3">
    <button
      onClick={handleExportPDF}
      className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium cursor-pointer flex items-center gap-2"
    >
      📄 Exporter PDF
    </button>
    <button
      onClick={openCreate}
      className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium cursor-pointer"
    >
      + Ajouter un enseignant
    </button>
  </div>
</div>

      {/* Search */}
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Rechercher par nom, prénom ou email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <div className="text-2xl mb-2">⏳</div>
          <p className="text-gray-400 text-sm">Chargement...</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['Enseignant', 'Email', 'Téléphone', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teachers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center">
                    <div className="text-3xl mb-2">👨‍🏫</div>
                    <p className="text-gray-400 text-sm">Aucun enseignant trouvé</p>
                  </td>
                </tr>
              ) : teachers.map(teacher => (
                <tr key={teacher.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        {teacher.nom[0]}{teacher.prenom[0]}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{teacher.nom} {teacher.prenom}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{teacher.email}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{teacher.telephone}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(teacher)}
                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium hover:bg-blue-100 cursor-pointer">
                        Modifier
                      </button>
                      <button onClick={() => setDeleteId(teacher.id)}
                        className="px-3 py-1 bg-red-50 text-red-600 rounded-md text-xs font-medium hover:bg-red-100 cursor-pointer">
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination pagination={pagination} onPageChange={setPage} />
        </div>
      )}

      {/* Modal */}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Nom</label>
                  <input type="text" value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400"
                    required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Prénom</label>
                  <input type="text" value={form.prenom}
                    onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400"
                    required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
                <input type="email" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400"
                  required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Téléphone</label>
                <input type="text" value={form.telephone}
                  onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400"
                  required />
              </div>
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