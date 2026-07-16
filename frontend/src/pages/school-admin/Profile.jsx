import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import Toast from '../../components/ui/Toast'

const Profile = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm_password: '' })
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)

  const showToast = (message, type = 'success') => setToast({ message, type })

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (form.new_password !== form.confirm_password) {
      showToast('Les mots de passe ne correspondent pas.', 'error')
      return
    }
    if (form.new_password.length < 6) {
      showToast('Le mot de passe doit contenir au moins 6 caractères.', 'warning')
      return
    }
    setLoading(true)
    try {
      await api.put('/auth/password', {
        current_password: form.current_password,
        new_password: form.new_password,
      })
      showToast('Mot de passe modifié avec succès !')
      setForm({ current_password: '', new_password: '', confirm_password: '' })
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur lors du changement.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <h1 className="text-xl font-semibold text-gray-800 mb-5">Mon profil</h1>

      {/* Info Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-2xl font-bold flex-shrink-0">
          {user?.name?.[0]}
        </div>
        <div>
          <p className="font-semibold text-gray-800 text-base">{user?.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
          <span className="mt-1 inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
            {user?.role === 'super_admin' ? '👑 Super Administrateur' : '🏫 Administrateur d\'école'}
          </span>
        </div>
      </div>

      {/* Password Card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <span>🔒</span>
          <h2 className="font-medium text-sm text-gray-700">Changer le mot de passe</h2>
        </div>
        <div className="p-5">
          <form onSubmit={handleChangePassword} className="space-y-4">
            {[
              { label: 'Mot de passe actuel', key: 'current_password' },
              { label: 'Nouveau mot de passe', key: 'new_password' },
              { label: 'Confirmer le nouveau mot de passe', key: 'confirm_password' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">{field.label}</label>
                <input
                  type="password"
                  value={form[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 disabled:bg-blue-400 cursor-pointer transition-colors"
            >
              {loading ? 'Modification...' : 'Changer le mot de passe'}
            </button>
          </form>
        </div>
      </div>

      {/* Logout Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between">
        <div>
          <p className="font-medium text-sm text-gray-800">Se déconnecter</p>
          <p className="text-xs text-gray-400 mt-0.5">Mettre fin à votre session actuelle.</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium hover:bg-red-100 cursor-pointer"
        >
          🚪 Déconnexion
        </button>
      </div>
    </div>
  )
}

export default Profile