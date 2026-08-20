import { useAuth } from '@/data/auth'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

export function RequireAuth() {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
