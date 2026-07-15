import { useState, useEffect } from 'react'
import studentService from '../../services/studentService'
import classroomService from '../../services/classroomService'

const Students = () => {
  const [students, setStudents] = useState([])
  const [classrooms, setClassrooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editStudent, setEditStudent] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    nom: '', prenom: '', sexe: 'M',
    date_naissance: '', adresse: '',
    contact_parent: '', classroom_id: ''
  })
  const [error, setError] = useState('')

  const fetchStudents = async () => {
    try {
      const res = await studentService.getAll()
      setStudents(res.data.students)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchClassrooms = async () => {
    try {
      const res = await classroomService.getAll()
      setClassrooms(res.data.classrooms)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchStudents()
    fetchClassrooms()
  }, [])

  const openCreate = () => {
    setEditStudent(null)
    setForm({ nom: '', prenom: '', sexe: 'M', date_naissance: '', adresse: '', contact_parent: '', classroom_id: '' })
    setError('')
    setShowModal(true)
  }

  const openEdit = (student) => {
    setEditStudent(student)
    setForm({
      nom: student.nom, prenom: student.prenom,
      sexe: student.sexe, date_naissance: student.date_naissance,
      adresse: student.adresse || '', contact_parent: student.contact_parent,
      classroom_id: student.classroom_id,
    })
    setError('')
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editStudent) {
        await studentService.update(editStudent.id, form)
      } else {
        await studentService.create(form)
      }
      setShowModal(false)
      fetchStudents()
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet élève ?')) return
    try {
      await studentService.delete(id)
      setSelectedStudent(null)
      fetchStudents()
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = students.filter(s =>
    `${s.nom} ${s.prenom}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex gap-4">
      {/* Liste */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Élèves</h1>
            <p className="text-sm text-gray-400 mt-1">{students.length} élève(s)</p>
          </div>
          <button onClick={openCreate}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium cursor-pointer">
            + Ajouter un élève
          </button>
        </div>

        <input
          type="text"
          placeholder="Rechercher un élève..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 mb-4"
        />

        {loading ? <p className="text-gray-400">Chargement...</p> : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Élève', 'Sexe', 'Naissance', 'Classe', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">Aucun élève trouvé</td>
                  </tr>
                ) : filtered.map(student => (
                  <tr
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className={`border-b border-gray-100 cursor-pointer transition-colors ${
                      selectedStudent?.id === student.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {student.nom} {student.prenom}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{student.sexe}</td>
                    <td className="px-4 py-3 text-gray-500">{student.date_naissance}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {student.classroom?.nom || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); openEdit(student) }}
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium hover:bg-blue-100 cursor-pointer">
                          Modifier
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(student.id) }}
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
      </div>

      {/* Fiche élève */}
      {selectedStudent && (
        <div className="w-72 flex-shrink-0 bg-white border border-gray-200 rounded-xl overflow-hidden self-start">
          <div className="p-5 text-center border-b border-gray-100">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-xl font-semibold mx-auto mb-3">
              {selectedStudent.nom[0]}{selectedStudent.prenom[0]}
            </div>
            <p className="font-semibold text-gray-800">{selectedStudent.nom} {selectedStudent.prenom}</p>
            <p className="text-xs text-gray-400 mt-1">{selectedStudent.classroom?.nom || '—'}</p>
          </div>
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Informations</p>
            {[
              { label: 'Sexe', value: selectedStudent.sexe === 'M' ? 'Masculin' : 'Féminin' },
              { label: 'Naissance', value: selectedStudent.date_naissance },
              { label: 'Adresse', value: selectedStudent.adresse || '—' },
            ].map(item => (
              <div key={item.label} className="flex gap-2 mb-2 text-xs">
                <span className="text-gray-400 w-20 flex-shrink-0">{item.label}</span>
                <span className="text-gray-700">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Contact parent</p>
            <p className="text-sm text-blue-600">{selectedStudent.contact_parent}</p>
          </div>
          <div className="p-3 flex gap-2">
            <button onClick={() => openEdit(selectedStudent)}
              className="flex-1 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 cursor-pointer">
              Modifier
            </button>
            <button onClick={() => handleDelete(selectedStudent.id)}
              className="flex-1 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 cursor-pointer">
              Supprimer
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[500px] shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-semibold text-gray-800 mb-5">
              {editStudent ? "Modifier l'élève" : 'Ajouter un élève'}
            </h2>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg mb-4">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Nom</label>
                  <input type="text" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Prénom</label>
                  <input type="text" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Sexe</label>
                  <select value={form.sexe} onChange={(e) => setForm({ ...form, sexe: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400">
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Date de naissance</label>
                  <input type="date" value={form.date_naissance} onChange={(e) => setForm({ ...form, date_naissance: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Adresse</label>
                <input type="text" value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Contact parent</label>
                <input type="text" value={form.contact_parent} onChange={(e) => setForm({ ...form, contact_parent: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Classe</label>
                <select value={form.classroom_id} onChange={(e) => setForm({ ...form, classroom_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400" required>
                  <option value="">Sélectionner une classe</option>
                  {classrooms.map(c => (
                    <option key={c.id} value={c.id}>{c.nom} — {c.niveau}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm cursor-pointer hover:bg-gray-50">
                  Annuler
                </button>
                <button type="submit"
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 cursor-pointer">
                  {editStudent ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Students