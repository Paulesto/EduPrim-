import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

const SchoolDashboard = () => {
  const { t } = useTranslation()
  const [stats, setStats] = useState({
    teachers: 0,
    students: 0,
    classrooms: 0,
    subjects: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [teachers, students, classrooms, subjects] = await Promise.all([
          api.get('/school/teachers'),
          api.get('/school/students'),
          api.get('/school/classrooms'),
          api.get('/school/subjects'),
        ])
        setStats({
          teachers: teachers.data.teachers.length,
          students: students.data.students.length,
          classrooms: classrooms.data.classrooms.length,
          subjects: subjects.data.subjects.length,
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const cards = [
    { label: t('dashboard.enrolledStudents'), value: stats.students, icon: '👨‍🎓', color: '#185FA5', bg: '#E6F1FB' },
    { label: t('dashboard.teachers'), value: stats.teachers, icon: '👨‍🏫', color: '#3B6D11', bg: '#EAF3DE' },
    { label: t('dashboard.classrooms'), value: stats.classrooms, icon: '🚪', color: '#854F0B', bg: '#FAEEDA' },
    { label: t('dashboard.subjects'), value: stats.subjects, icon: '📘', color: '#534AB7', bg: '#EEEDFE' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#222' }}>
          {t('dashboard.schoolTitle')}
        </h1>
      </div>

      {loading ? (
        <div style={{ color: '#999' }}>{t('common.loading')}</div>
      ) : (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {cards.map((card, i) => (
            <div key={i} style={{
              background: '#fff',
              border: '1px solid #E5E3DC',
              borderRadius: '10px',
              padding: '20px',
              minWidth: '160px',
              flex: 1,
            }}>
              <div style={{
                width: '40px', height: '40px',
                background: card.bg, borderRadius: '8px',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '20px',
                marginBottom: '12px',
              }}>{card.icon}</div>
              <div style={{ fontSize: '26px', fontWeight: '600', color: card.color }}>
                {card.value}
              </div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                {card.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SchoolDashboard
