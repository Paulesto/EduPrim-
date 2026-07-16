import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import schoolService from '../../services/schoolService'

const Schools = () => {
  const { t } = useTranslation()
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editSchool, setEditSchool] = useState(null)
  const [form, setForm] = useState({ nom: '', adresse: '', telephone: '', email: '' })
  const [error, setError] = useState('')

  const fetchSchools = async () => {
    try {
      const res = await schoolService.getAll()
      setSchools(res.data.schools)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSchools() }, [])

  const openCreate = () => {
    setEditSchool(null)
    setForm({ nom: '', adresse: '', telephone: '', email: '' })
    setError('')
    setShowModal(true)
  }

  const openEdit = (school) => {
    setEditSchool(school)
    setForm({ nom: school.nom, adresse: school.adresse, telephone: school.telephone, email: school.email })
    setError('')
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editSchool) {
        await schoolService.update(editSchool.id, form)
      } else {
        await schoolService.create(form)
      }
      setShowModal(false)
      fetchSchools()
    } catch (err) {
      setError(err.response?.data?.message || t('common.error'))
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm(t('schools.confirmDelete'))) return
    try {
      await schoolService.delete(id)
      fetchSchools()
    } catch (err) {
      console.error(err)
    }
  }

  const tableHeaders = [t('common.name'), t('common.address'), t('common.phone'), t('common.email'), t('common.actions')]
  const formFields = [
    { label: t('common.name'), key: 'nom', type: 'text' },
    { label: t('common.address'), key: 'adresse', type: 'text' },
    { label: t('common.phone'), key: 'telephone', type: 'text' },
    { label: t('common.email'), key: 'email', type: 'email' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">{t('schools.title')}</h1>
          <p className="text-sm text-gray-400 mt-1">{t('schools.count', { count: schools.length })}</p>
        </div>
        <button onClick={openCreate}
          className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer">
          {t('schools.add')}
        </button>
      </div>

      {loading ? <p className="text-gray-400">{t('common.loading')}</p> : (
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
              {schools.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">{t('schools.noSchools')}</td>
                </tr>
              ) : schools.map(school => (
                <tr key={school.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{school.nom}</td>
                  <td className="px-4 py-3 text-gray-500">{school.adresse}</td>
                  <td className="px-4 py-3 text-gray-500">{school.telephone}</td>
                  <td className="px-4 py-3 text-gray-500">{school.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(school)}
                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium hover:bg-blue-100 cursor-pointer">
                        {t('common.edit')}
                      </button>
                      <button onClick={() => handleDelete(school.id)}
                        className="px-3 py-1 bg-red-50 text-red-600 rounded-md text-xs font-medium hover:bg-red-100 cursor-pointer">
                        {t('common.delete')}
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
              {editSchool ? t('schools.editTitle') : t('schools.addTitle')}
            </h2>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg mb-4">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {formFields.map(field => (
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
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm cursor-pointer hover:bg-gray-50">
                  {t('common.cancel')}
                </button>
                <button type="submit"
                  className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 cursor-pointer">
                  {editSchool ? t('common.edit') : t('common.create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Schools
