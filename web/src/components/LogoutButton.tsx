import { useNavigate } from 'react-router'
import { useApolloClient, useMutation } from '@apollo/client/react'
import { LOGOUT } from '../graphql/auth'
import { clearToken } from '../auth/token'

export default function LogoutButton() {
  const navigate = useNavigate()
  const client = useApolloClient()
  const [logout, { loading }] = useMutation(LOGOUT)

  async function handleLogout() {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      clearToken()
      await client.clearStore()
      navigate('/login')
    }
  }

  return (
    <button onClick={handleLogout} disabled={loading}>
      {loading ? 'Logging out...' : 'Log out'}
    </button>
  )
}
