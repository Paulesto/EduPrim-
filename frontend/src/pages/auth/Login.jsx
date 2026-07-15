import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSuccess, setForgotSuccess] = useState(false)
  const [forgotLoading, setForgotLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const user = await login(form)
      if (user.role === 'super_admin') {
        navigate('/super-admin/dashboard')
      } else {
        navigate('/school/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgot = async (e) => {
    e.preventDefault()
    setForgotLoading(true)
    setTimeout(() => {
      setForgotSuccess(true)
      setForgotLoading(false)
    }, 1500)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #14263d 0%, #181f2c 50%, #172942 100%)' }}
    >
      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Top Banner */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-8 py-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-700 font-bold text-lg shadow">
              E
            </div>
            <span className="text-white text-xl font-bold">EduPrim</span>
          </div>
          <p className="text-blue-200 text-xs mt-1">
            Plateforme de gestion des écoles primaires
          </p>
        </div>

        {/* Form Area */}
        <div className="px-8 py-8">

          {!showForgot ? (
            <>
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Connexion</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Accédez à votre espace administrateur
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Adresse email
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📧</span>
                    <input
                      type="email"
                      placeholder="nom@ecole.ma"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔒</span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full pl-9 pr-10 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    Se souvenir de moi
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer shadow-md mt-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      Connexion en cours...
                    </span>
                  ) : 'Se connecter →'}
                </button>
              </form>

              <p className="text-xs text-center text-gray-400 mt-6">
                🔐 Accès réservé aux administrateurs autorisés
              </p>
            </>
          ) : (
            <>
              <button
                onClick={() => { setShowForgot(false); setForgotSuccess(false); setForgotEmail('') }}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 cursor-pointer"
              >
                ← Retour
              </button>

              <div className="text-center mb-6">
                <div className="text-4xl mb-3">🔑</div>
                <h2 className="text-xl font-bold text-gray-800">Mot de passe oublié</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Entrez votre email pour recevoir un lien de réinitialisation.
                </p>
              </div>

              {!forgotSuccess ? (
                <form onSubmit={handleForgot} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Adresse email
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📧</span>
                      <input
                        type="email"
                        placeholder="nom@ecole.ma"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full py-3 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                  >
                    {forgotLoading ? 'Envoi en cours...' : 'Envoyer le lien →'}
                  </button>
                </form>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                  <div className="text-3xl mb-3">✅</div>
                  <h3 className="font-semibold text-green-800 mb-1">Email envoyé !</h3>
                  <p className="text-green-600 text-sm">
                    Un lien a été envoyé à <strong>{forgotEmail}</strong>.
                  </p>
                  <button
                    onClick={() => { setShowForgot(false); setForgotSuccess(false); setForgotEmail('') }}
                    className="mt-4 text-sm text-blue-600 hover:underline cursor-pointer"
                  >
                    Retour à la connexion
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            © 2026 EduPrim — Tous droits réservés
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login