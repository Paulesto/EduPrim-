import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import studentService from '../../services/studentService'
import classroomService from '../../services/classroomService'
import exportService from '../../services/exportService'
import Pagination from '../../components/ui/Pagination'
import Toast from '../../components/ui/Toast'
import ConfirmModal from '../../components/ui/ConfirmModal'

const Students = () => {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [students, setStudents] = useState([])
  const [classrooms, setClassrooms] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterClassroom, setFilterClassroom] = useState('')
  const [filterSexe, setFilterSexe] = useState('')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editStudent, setEditStudent] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [toast, setToast] = useState(null)
  const [form, setForm] = useState({
    nom: '', prenom: '', sexe: 'M',
    date_naissance: '', adresse: '',
    contact_parent: '', classroom_id: ''
  })
  const [error, setError] = useState('')

  const showToast = (message, type = 'success') => setToast({ message, type })

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    try {
      const res = await studentService.getAll({
        search, page, per_page: 10,
        classroom_id: filterClassroom,
        sexe: filterSexe,
      })
      setStudents(res.data.students)
      setPagination(res.data.pagination)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [search, page, filterClassroom, filterSexe])

  useEffect(() => {
    const timer = setTimeout(fetchStudents, 300)
    return () => clearTimeout(timer)
  }, [fetchStudents])

  useEffect(() => {
    classroomService.getAll().then(res => setClassrooms(res.data.classrooms))
  }, [])

  const handleExportPDF = async () => {
    try {
      const res = await studentService.getAll({ per_page: 1000 })
      exportService.exportStudentsPDF(res.data.students, user?.school?.nom || 'EduPrim')
      showToast(t('students.exportSuccess'))
    } catch (err) {
      showToast(t('common.exportError'), 'error')
    }
  }

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
        showToast(t('students.updated'))
      } else {
        await studentService.create(form)
        showToast(t('students.created'))
      }
      setShowModal(false)
      fetchStudents()
    } catch (err) {
      setError(err.response?.data?.message || t('common.error'))
    }
  }

  const handleDelete = async () => {
    try {
      await studentService.delete(deleteId)
      showToast(t('students.deleted'))
      setDeleteId(null)
      setSelectedStudent(null)
      fetchStudents()
    } catch (err) {
      showToast(t('common.deleteError'), 'error')
    }
  }

  const genderLabel = (sexe, short = false) =>
    sexe === 'M' ? t(short ? 'common.maleShort' : 'common.male') : t(short ? 'common.femaleShort' : 'common.female')

  const tableHeaders = [t('students.student'), t('common.gender'), t('common.birthShort'), t('common.class'), t('common.contact'), t('common.actions')]

  return (
    <div className="flex gap-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {deleteId && (
        <ConfirmModal
          message={t('students.confirmDelete')}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">{t('students.title')}</h1>
            <p className="text-sm text-gray-400 mt-1">{t('students.count', { count: pagination?.total || 0 })}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium cursor-pointer flex items-center gap-2"
            >
              📄 {t('common.exportPdf')}
            </button>
            <button
              onClick={openCreate}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium cursor-pointer"
            >
              {t('students.add')}
            </button>
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <span className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder={t('students.search')}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="w-full ps-9 pe-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
            />
          </div>
          <select
            value={filterClassroom}
            onChange={(e) => { setFilterClassroom(e.target.value); setPage(1) }}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 bg-white"
          >
            <option value="">{t('common.allClasses')}</option>
            {classrooms.map(c => (
              <option key={c.id} value={c.id}>{c.nom}</option>
            ))}
          </select>
          <select
            value={filterSexe}
            onChange={(e) => { setFilterSexe(e.target.value); setPage(1) }}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 bg-white"
          >
            <option value="">{t('common.all')}</option>
            <option value="M">{t('common.male')}</option>
            <option value="F">{t('common.female')}</option>
          </select>
        </div>

        {loading ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <div className="text-2xl mb-2">⏳</div>
            <p className="text-gray-400 text-sm">{t('common.loading')}</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {tableHeaders.map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center">
                      <div className="text-3xl mb-2">👨‍🎓</div>
                      <p className="text-gray-400 text-sm">{t('students.noStudents')}</p>
                    </td>
                  </tr>
                ) : students.map(student => (
                  <tr
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className={`border-b border-gray-100 cursor-pointer transition-colors ${
                      selectedStudent?.id === student.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center text-xs font-semibold">
                          {student.nom[0]}{student.prenom[0]}
                        </div>
                        <span className="font-medium text-gray-800">{student.nom} {student.prenom}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {genderLabel(student.sexe, true)}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{student.date_naissance}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {student.classroom?.nom || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{student.contact_parent}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); openEdit(student) }}
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium hover:bg-blue-100 cursor-pointer">
                          {t('common.edit')}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setDeleteId(student.id) }}
                          className="px-3 py-1 bg-red-50 text-red-600 rounded-md text-xs font-medium hover:bg-red-100 cursor-pointer">
                          {t('common.delete')}
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
      </div>

      {selectedStudent && (
        <div className="w-72 flex-shrink-0 bg-white border border-gray-200 rounded-xl overflow-hidden self-start sticky top-0">
          <div className="p-5 text-center border-b border-gray-100 bg-gradient-to-br from-blue-50 to-white relative">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-3 end-3 text-gray-400 hover:text-gray-600 cursor-pointer text-xs"
            >✕</button>
            <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-semibold mx-auto mb-3">
              {selectedStudent.nom[0]}{selectedStudent.prenom[0]}
            </div>
            <p className="font-semibold text-gray-800">{selectedStudent.nom} {selectedStudent.prenom}</p>
            <span className="mt-1 inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">
              {selectedStudent.classroom?.nom || '—'}
            </span>
          </div>
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-3">{t('common.information')}</p>
            {[
              { label: t('common.gender'), value: genderLabel(selectedStudent.sexe) },
              { label: t('common.birth'), value: selectedStudent.date_naissance },
              { label: t('common.address'), value: selectedStudent.adresse || '—' },
            ].map(item => (
              <div key={item.label} className="flex gap-2 mb-2 text-xs">
                <span className="text-gray-400 w-20 flex-shrink-0">{item.label}</span>
                <span className="text-gray-700">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">{t('common.parentContact')}</p>
            <p className="text-sm text-blue-600 font-medium">{selectedStudent.contact_parent}</p>
          </div>
          <div className="p-3 flex gap-2">
            <button onClick={() => openEdit(selectedStudent)}
              className="flex-1 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 cursor-pointer">
              {t('common.edit')}
            </button>
            <button onClick={() => setDeleteId(selectedStudent.id)}
              className="flex-1 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 cursor-pointer">
              {t('common.delete')}
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[500px] shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-semibold text-gray-800 mb-5">
              {editStudent ? t('students.editTitle') : t('students.addTitle')}
            </h2>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg mb-4">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">{t('common.name')}</label>
                  <input type="text" value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">{t('common.firstName')}</label>
                  <input type="text" value={form.prenom}
                    onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">{t('common.gender')}</label>
                  <select value={form.sexe}
                    onChange={(e) => setForm({ ...form, sexe: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400">
                    <option value="M">{t('common.male')}</option>
                    <option value="F">{t('common.female')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">{t('common.birthDate')}</label>
                  <input type="date" value={form.date_naissance}
                    onChange={(e) => setForm({ ...form, date_naissance: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">{t('common.address')}</label>
                <input type="text" value={form.adresse}
                  onChange={(e) => setForm({ ...form, adresse: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">{t('common.parentContact')}</label>
                <input type="text" value={form.contact_parent}
                  onChange={(e) => setForm({ ...form, contact_parent: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">{t('common.class')}</label>
                <select value={form.classroom_id}
                  onChange={(e) => setForm({ ...form, classroom_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400" required>
                  <option value="">{t('common.selectClass')}</option>
                  {classrooms.map(c => (
                    <option key={c.id} value={c.id}>{c.nom} — {c.niveau}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm cursor-pointer hover:bg-gray-50">
                  {t('common.cancel')}
                </button>
                <button type="submit"
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 cursor-pointer">
                  {editStudent ? t('common.edit') : t('common.add')}
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
