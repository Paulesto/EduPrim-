import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import subjectService from '../../services/subjectService'

const Subjects = () => {
  const { t } = useTranslation()
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editSubject, setEditSubject] = useState(null)
  const [form, setForm] = useState({ nom: '', description: '' })
  const [error, setError] = useState('')

  const fetchSubjects = async () => {
    try {
      const res = await subjectService.getAll()
      setSubjects(res.data.subjects)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSubjects() }, [])

  const openCreate = () => {
    setEditSubject(null)
    setForm({ nom: '', description: '' })
    setError('')
    setShowModal(true)
  }

  const openEdit = (subject) => {
    setEditSubject(subject)
    setForm({ nom: subject.nom, description: subject.description || '' })
    setError('')
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editSubject) {
        await subjectService.update(editSubject.id, form)
      } else {
        await subjectService.create(form)
      }
      setShowModal(false)
      fetchSubjects()
    } catch (err) {
      setError(err.response?.data?.message || t('common.error'))
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm(t('subjects.confirmDelete'))) return
    try {
      await subjectService.delete(id)
      fetchSubjects()
    } catch (err) {
      console.error(err)
    }
  }

  const colors = [
    'bg-blue-50 border-blue-100 text-blue-700',
    'bg-green-50 border-green-100 text-green-700',
    'bg-amber-50 border-amber-100 text-amber-700',
    'bg-purple-50 border-purple-100 text-purple-700',
    'bg-pink-50 border-pink-100 text-pink-700',
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">{t('subjects.title')}</h1>
          <p className="text-sm text-gray-400 mt-1">{t('subjects.count', { count: subjects.length })}</p>
        </div>
        <button onClick={openCreate}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium cursor-pointer">
          {t('subjects.add')}
        </button>
      </div>

      {loading ? <p className="text-gray-400">{t('common.loading')}</p> : (
        <div className="grid grid-cols-3 gap-4">
          {subjects.length === 0 ? (
            <p className="text-gray-400 col-span-3 text-center py-10">{t('subjects.noSubjects')}</p>
          ) : subjects.map((subject, i) => (
            <div key={subject.id} className={`bg-white border rounded-xl p-5 ${colors[i % colors.length].split(' ')[1]}`}>
              <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mb-3 ${colors[i % colors.length]}`}>
                📘 {subject.nom}
              </div>
              <p className="text-sm text-gray-500 mb-4 min-h-[40px]">{subject.description || '—'}</p>
              <div className="flex gap-2">
                <button onClick={() => openEdit(subject)}
                  className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium hover:bg-blue-100 cursor-pointer">
                  {t('common.edit')}
                </button>
                <button onClick={() => handleDelete(subject.id)}
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
              {editSubject ? t('subjects.editTitle') : t('subjects.addTitle')}
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
                <label className="block text-xs font-medium text-gray-700 mb-1.5">{t('common.description')}</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 min-h-[80px]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm cursor-pointer hover:bg-gray-50">
                  {t('common.cancel')}
                </button>
                <button type="submit"
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 cursor-pointer">
                  {editSubject ? t('common.edit') : t('common.add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Subjects
