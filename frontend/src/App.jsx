import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

// Auth
import Login from './pages/auth/Login'

// Layout & Protection
import ProtectedRoute from './router/ProtectedRoute'
import MainLayout from './components/layout/MainLayout'

// Super Admin Pages
import SuperDashboard from './pages/super-admin/Dashboard'
import Schools from './pages/super-admin/Schools'
import Admins from './pages/super-admin/Admins'

// School Admin Pages
import SchoolDashboard from './pages/school-admin/Dashboard'
import Teachers from './pages/school-admin/Teachers'
import Subjects from './pages/school-admin/Subjects'
import Classrooms from './pages/school-admin/Classrooms'
import Students from './pages/school-admin/Students'
import Calendar from './pages/school-admin/Calendar'
import Profile from './pages/school-admin/Profile'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Super Admin */}
          <Route path="/super-admin" element={
            <ProtectedRoute role="super_admin">
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<SuperDashboard />} />
            <Route path="schools" element={<Schools />} />
            <Route path="admins" element={<Admins />} />
          </Route>

          {/* School Admin */}
          <Route path="/school" element={
            <ProtectedRoute role="school_admin">
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<SchoolDashboard />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="classrooms" element={<Classrooms />} />
            <Route path="students" element={<Students />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
