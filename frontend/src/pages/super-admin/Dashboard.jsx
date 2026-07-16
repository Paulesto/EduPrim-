import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getDateLocale } from '../../i18n'
import api from '../../services/api'

const SuperDashboard = () => {
  const { user } = useAuth()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ schools: 0, admins: 0, students: 0, teachers: 0 })
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schoolsRes, adminsRes] = await Promise.all([
          api.get('/super-admin/schools'),
          api.get('/super-admin/admins'),
        ])
        const schoolsList = schoolsRes.data.schools
        setSchools(schoolsList.slice(0, 5))
        setStats({
          schools: schoolsList.length,
          admins: adminsRes.data.admins.length,
          active: adminsRes.data.admins.filter(a => a.is_active).length,
          inactive: adminsRes.data.admins.filter(a => !a.is_active).length,
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const cards = [
    {
      label: t('dashboard.activeSchools'),
      value: stats.schools,
      icon: '🏫',
      color: 'text-green-700',
      bg: 'bg-green-50',
      border: 'border-green-200',
      trend: t('dashboard.trendThisMonth'),
      trendColor: 'text-green-600',
    },
    {
      label: t('dashboard.administrators'),
      value: stats.admins,
      icon: '👤',
      color: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      trend: t('dashboard.trendAllSchools'),
      trendColor: 'text-blue-600',
    },
    {
      label: t('dashboard.activeAccounts'),
      value: stats.active,
      icon: '✅',
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      trend: t('dashboard.trendActiveAdmins'),
      trendColor: 'text-emerald-600',
    },
    {
      label: t('dashboard.inactiveAccounts'),
      value: stats.inactive,
      icon: '⛔',
      color: 'text-red-700',
      bg: 'bg-red-50',
      border: 'border-red-200',
      trend: t('dashboard.trendInactiveAdmins'),
      trendColor: 'text-red-500',
    },
  ]

  const today = new Date().toLocaleDateString(getDateLocale(), {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  const tableHeaders = [t('common.school'), t('common.address'), t('common.phone'), t('common.email')]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
           {user?.name}
          </h1>
          <p className="text-sm text-gray-400 mt-1 capitalize">{today}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/super-admin/schools')}
            className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            {t('dashboard.newSchool')}
          </button>
          <button
            onClick={() => navigate('/super-admin/admins')}
            className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            {t('dashboard.newAdmin')}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
              <div className="w-10 h-10 bg-gray-100 rounded-lg mb-3"></div>
              <div className="h-8 bg-gray-100 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-24"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <div key={i} className={`bg-white border ${card.border} rounded-xl p-5 hover:shadow-md transition-shadow`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center text-xl`}>
                  {card.icon}
                </div>
              </div>
              <div className={`text-3xl font-bold ${card.color} mb-1`}>{card.value}</div>
              <div className="text-sm font-medium text-gray-600">{card.label}</div>
              <div className={`text-xs ${card.trendColor} mt-1`}>{card.trend}</div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-semibold text-gray-800">{t('dashboard.recentSchools')}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{t('dashboard.schoolsTotal', { count: stats.schools })}</p>
            </div>
            <button
              onClick={() => navigate('/super-admin/schools')}
              className="text-xs text-green-700 font-medium hover:underline cursor-pointer"
            >
              {t('common.seeAll')}
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {tableHeaders.map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {schools.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-gray-400 text-sm">
                    {t('dashboard.noSchools')}
                  </td>
                </tr>
              ) : schools.map(school => (
                <tr key={school.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center text-sm">
                        🏫
                      </div>
                      <span className="font-medium text-gray-800">{school.nom}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{school.adresse}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{school.telephone}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{school.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-800">{t('dashboard.quickActions')}</h2>
            </div>
            <div className="p-4 space-y-2">
              <button
                onClick={() => navigate('/super-admin/schools')}
                className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left"
              >
                <span className="text-lg">🏫</span>
                <div>
                  <div className="font-medium">{t('dashboard.manageSchools')}</div>
                  <div className="text-xs text-green-600">{t('dashboard.schoolsCount', { count: stats.schools })}</div>
                </div>
              </button>
              <button
                onClick={() => navigate('/super-admin/admins')}
                className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left"
              >
                <span className="text-lg">👤</span>
                <div>
                  <div className="font-medium">{t('dashboard.manageAdmins')}</div>
                  <div className="text-xs text-blue-600">{t('dashboard.adminsCount', { count: stats.admins })}</div>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-xl p-5 text-white">
            <div className="text-2xl mb-3">🎓</div>
            <h3 className="font-semibold text-sm mb-1">{t('common.appName')}</h3>
            <p className="text-xs text-green-200 leading-relaxed">
              {t('dashboard.platformDescription')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperDashboard
