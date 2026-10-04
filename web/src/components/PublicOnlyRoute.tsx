import { Navigate } from 'react-router'
import { getToken } from '../auth/token'

export default function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  if (getToken()) {
    return <Navigate to='/' replace />
  }

  return <>{children}</>
}
