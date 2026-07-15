import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

const Profile = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm_password: '' })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (form.new_password !== form.confirm_password) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    try {
      await api.put('/auth/password', {
        current_password: form.current_password,
        new_password: form.new_password,
      })
      setSuccess('Mot de passe modifié avec succès.')
      setForm({ current_password: '', new_password: '', confirm_password: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du changement.')
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold text-gray-800 mb-5">Mon profil</h1>

      {/* Info */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 mb-4">
        <div className="w-13 h-13 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-lg font-semibold flex-shrink-0 w-12 h-12">
          {user?.name?.[0]}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{user?.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
          <p className="text-xs text-blue-600 mt-0.5">
            {user?.role === 'super_admin' ? 'Super Administrateur' : "Administrateur d'école"}
          </p>
        </div>
      </div>

      {/* Password */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
        <div className="px-5 py-3.5 border-b border-gray-100 font-medium text-sm text-gray-700">
          Changer le mot de passe
        </div>
        <div className="p-5">
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg mb-4">{error}</div>}
          {success && <div className="bg-green-50 text-green-700 text-sm px-4 py-2.5 rounded-lg mb-4">{success}</div>}
          <form onSubmit={handleChangePassword} className="space-y-4">
            {[
              { label: 'Mot de passe actuel', key: 'current_password' },
              { label: 'Nouveau mot de passe', key: 'new_password' },
              { label: 'Confirmer le mot de passe', key: 'confirm_password' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">{field.label}</label>
                <input
                  type="password"
                  value={form[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                  required
                />
              </div>
            ))}
            <button type="submit"
              className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 cursor-pointer">
              Changer le mot de passe
            </button>
          </form>
        </div>
      </div>

      {/* Logout */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between">
        <div>
          <p className="font-medium text-sm text-gray-800">Se déconnecter</p>
          <p className="text-xs text-gray-400 mt-0.5">Mettre fin à votre session.</p>
        </div>
        <button onClick={handleLogout}
          className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 cursor-pointer">
          Déconnexion
        </button>
      </div>
    </div>
  )
}

export default Profile