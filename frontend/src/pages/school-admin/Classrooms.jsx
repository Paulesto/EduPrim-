import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import classroomService from '../../services/classroomService'
import teacherService from '../../services/teacherService'

const Classrooms = () => {
  const { t } = useTranslation()
  const [classrooms, setClassrooms] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editClassroom, setEditClassroom] = useState(null)
  const [form, setForm] = useState({ nom: '', niveau: '', teacher_id: '' })
  const [error, setError] = useState('')

  const fetchClassrooms = async () => {
    try {
      const res = await classroomService.getAll()
      setClassrooms(res.data.classrooms)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchTeachers = async () => {
    try {
      const res = await teacherService.getAll()
      setTeachers(res.data.teachers)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchClassrooms()
    fetchTeachers()
  }, [])

  const openCreate = () => {
    setEditClassroom(null)
    setForm({ nom: '', niveau: '', teacher_id: '' })
    setError('')
    setShowModal(true)
  }

  const openEdit = (classroom) => {
    setEditClassroom(classroom)
    setForm({ nom: classroom.nom, niveau: classroom.niveau, teacher_id: classroom.teacher_id || '' })
    setError('')
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editClassroom) {
        await classroomService.update(editClassroom.id, form)
      } else {
        await classroomService.create(form)
      }
      setShowModal(false)
      fetchClassrooms()
    } catch (err) {
      setError(err.response?.data?.message || t('common.error'))
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm(t('classrooms.confirmDelete'))) return
    try {
      await classroomService.delete(id)
      fetchClassrooms()
    } catch (err) {
      console.error(err)
    }
  }

  const niveaux = ['CP', 'CE1', 'CE2', 'CM1', 'CM2']

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">{t('classrooms.title')}</h1>
          <p className="text-sm text-gray-400 mt-1">{t('classrooms.count', { count: classrooms.length })}</p>
        </div>
        <button onClick={openCreate}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium cursor-pointer">
          {t('classrooms.add')}
        </button>
      </div>

      {loading ? <p className="text-gray-400">{t('common.loading')}</p> : (
        <div className="grid grid-cols-3 gap-4">
          {classrooms.length === 0 ? (
            <p className="text-gray-400 col-span-3 text-center py-10">{t('classrooms.noClassrooms')}</p>
          ) : classrooms.map(classroom => (
            <div key={classroom.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 text-base">{classroom.nom}</h3>
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                  {classroom.niveau}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                👨‍🏫 {classroom.teacher
                  ? `${classroom.teacher.nom} ${classroom.teacher.prenom}`
                  : t('common.noTeacher')}
              </p>
              <div className="flex gap-2">
                <button onClick={() => openEdit(classroom)}
                  className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium hover:bg-blue-100 cursor-pointer">
                  {t('common.edit')}
                </button>
                <button onClick={() => handleDelete(classroom.id)}
                  className="px-3 py-1 bg-red-50 text-red-600 rounded-md text-xs font-medium hover:bg-red-100 cursor-pointer">
                  {t('common.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[460px] shadow-2xl">
            <h2 className="text-base font-semibold text-gray-800 mb-5">
              {editClassroom ? t('classrooms.editTitle') : t('classrooms.addTitle')}
            </h2>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg mb-4">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">{t('common.name')}</label>
                <input
                  type="text"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">{t('common.level')}</label>
                <select
                  value={form.niveau}
                  onChange={(e) => setForm({ ...form, niveau: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                  required
                >
                  <option value="">{t('common.selectLevel')}</option>
                  {niveaux.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">{t('teachers.responsibleTeacher')}</label>
                <select
                  value={form.teacher_id}
                  onChange={(e) => setForm({ ...form, teacher_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                >
                  <option value="">{t('common.none')}</option>
                  {teachers.map(teach => (
                    <option key={teach.id} value={teach.id}>{teach.nom} {teach.prenom}</option>
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
                  {editClassroom ? t('common.edit') : t('common.add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Classrooms
