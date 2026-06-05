import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute, AdminRoute } from './router/ProtectedRoute'

// Public pages
const Home          = lazy(() => import('./pages/public/Home'))
const Services      = lazy(() => import('./pages/public/Services'))
const ServiceDetail = lazy(() => import('./pages/public/ServiceDetail'))
const About         = lazy(() => import('./pages/public/About'))
const Contact       = lazy(() => import('./pages/public/Contact'))
const Book          = lazy(() => import('./pages/public/Book'))

// Auth / portal
const Login         = lazy(() => import('./pages/portal/Login'))
const Register      = lazy(() => import('./pages/portal/Register'))
const Portal        = lazy(() => import('./pages/portal/Portal'))

// Admin
const AdminLogin    = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDash     = lazy(() => import('./pages/admin/Dashboard'))
const AdminAppts    = lazy(() => import('./pages/admin/Appointments'))
const AdminPatients = lazy(() => import('./pages/admin/Patients'))
const AdminServices = lazy(() => import('./pages/admin/Services'))
const AdminTeam     = lazy(() => import('./pages/admin/Team'))
const AdminSchedule = lazy(() => import('./pages/admin/Schedule'))
const AdminSettings = lazy(() => import('./pages/admin/Settings'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Loading…</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/"               element={<Home />} />
        <Route path="/services"       element={<Services />} />
        <Route path="/services/:id"   element={<ServiceDetail />} />
        <Route path="/about"          element={<About />} />
        <Route path="/contact"        element={<Contact />} />
        <Route path="/book"           element={<Book />} />

        {/* Auth */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Patient portal */}
        <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
          <Route path="/portal" element={<Portal />} />
        </Route>

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard"   element={<AdminDash />} />
          <Route path="/admin/appointments" element={<AdminAppts />} />
          <Route path="/admin/patients"    element={<AdminPatients />} />
          <Route path="/admin/services"    element={<AdminServices />} />
          <Route path="/admin/team"        element={<AdminTeam />} />
          <Route path="/admin/schedule"    element={<AdminSchedule />} />
          <Route path="/admin/settings"    element={<AdminSettings />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
