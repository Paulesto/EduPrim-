import { createBrowserRouter, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import Login from '../pages/auth/Login'
import MainLayout from '../components/layout/MainLayout'

// Super Admin Pages
import SuperDashboard from '../pages/super-admin/Dashboard'
import Schools from '../pages/super-admin/Schools'
import Admins from '../pages/super-admin/Admins'

// School Admin Pages
import SchoolDashboard from '../pages/school-admin/Dashboard'
import Teachers from '../pages/school-admin/Teachers'
import Subjects from '../pages/school-admin/Subjects'
import Classrooms from '../pages/school-admin/Classrooms'
import Students from '../pages/school-admin/Students'
import Calendar from '../pages/school-admin/Calendar'
import Profile from '../pages/school-admin/Profile'

const router = createBrowserRouter([
  // Redirection par défaut
  { path: '/', element: <Navigate to="/login" replace /> },

  { path: '/login', element: <Login /> },

  // Super Admin Routes
  {
    path: '/super-admin',
    element: (
      <ProtectedRoute role="super_admin">
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <SuperDashboard /> },
      { path: 'schools', element: <Schools /> },
      { path: 'admins', element: <Admins /> },
    ]
  },

  // School Admin Routes
  {
    path: '/school',
    element: (
      <ProtectedRoute role="school_admin">
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <SchoolDashboard /> },
      { path: 'teachers', element: <Teachers /> },
      { path: 'subjects', element: <Subjects /> },
      { path: 'classrooms', element: <Classrooms /> },
      { path: 'students', element: <Students /> },
      { path: 'calendar', element: <Calendar /> },
      { path: 'profile', element: <Profile /> },
    ]
  },

  { path: '*', element: <Navigate to="/login" replace /> },
])

export default router