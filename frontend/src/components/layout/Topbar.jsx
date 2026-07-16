import { useAuth } from '../../context/AuthContext'
import LanguageSwitcher from '../ui/LanguageSwitcher'

const Topbar = () => {
  const { user } = useAuth()

  return (
    <div className="h-13 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <span className="text-sm font-medium text-gray-700">EduPrim</span>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <span className="text-xs text-gray-400">{user?.email}</span>
      </div>
    </div>
  )
}

export default Topbar
