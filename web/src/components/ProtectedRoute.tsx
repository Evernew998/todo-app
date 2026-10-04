import { Navigate } from 'react-router'
import { getToken } from '../auth/token'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!getToken()) return <Navigate to={'/login'} replace />

  return <>{children}</>
}
