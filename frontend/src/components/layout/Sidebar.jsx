import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Sidebar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const isSuperAdmin = user?.role === 'super_admin'

  const superAdminLinks = [
    { to: '/super-admin/dashboard', label: 'Tableau de bord', icon: '📊' },
    { to: '/super-admin/schools', label: 'Écoles', icon: '🏫' },
    { to: '/super-admin/admins', label: 'Administrateurs', icon: '👤' },
  ]

  const schoolAdminLinks = [
    { to: '/school/dashboard', label: 'Tableau de bord', icon: '📊' },
    { to: '/school/teachers', label: 'Enseignants', icon: '👨‍🏫' },
    { to: '/school/subjects', label: 'Matières', icon: '📘' },
    { to: '/school/classrooms', label: 'Classes', icon: '🚪' },
    { to: '/school/students', label: 'Élèves', icon: '👨‍🎓' },
    { to: '/school/calendar', label: 'Calendrier', icon: '📅' },
    { to: '/school/profile', label: 'Mon profil', icon: '⚙️' },
  ]

  const links = isSuperAdmin ? superAdminLinks : schoolAdminLinks
  const activeClass = isSuperAdmin
    ? 'bg-green-50 text-green-700 font-medium'
    : 'bg-blue-50 text-blue-700 font-medium'
  const iconBg = isSuperAdmin ? 'bg-green-700' : 'bg-blue-700'

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="w-56 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-200">
        <div className={`w-7 h-7 ${iconBg} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
          E
        </div>
        <span className="font-semibold text-gray-800">EduPrim</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 overflow-y-auto">
        <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Navigation
        </p>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 mx-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive ? activeClass : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`
            }
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200">
        <div className="px-2 py-1.5 mb-2">
          <p className="text-sm font-medium text-gray-800">{user?.name}</p>
          <p className="text-xs text-gray-400">
            {user?.role === 'super_admin' ? 'Super Admin' : "Admin École"}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full py-1.5 px-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors cursor-pointer"
        >
          🚪 Déconnexion
        </button>
      </div>
    </div>
  )
}

export default Sidebar