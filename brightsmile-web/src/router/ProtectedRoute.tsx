import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Props {
  allowedRoles?: string[]
  redirectTo?: string
}

export function ProtectedRoute({ allowedRoles, redirectTo = '/login' }: Props) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to={redirectTo} replace />

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export function AdminRoute() {
  return (
    <ProtectedRoute
      allowedRoles={['ADMIN', 'RECEPTIONIST', 'DOCTOR']}
      redirectTo="/admin/login"
    />
  )
}
