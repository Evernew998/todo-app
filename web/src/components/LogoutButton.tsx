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
    <button
      onClick={handleLogout}
      disabled={loading}
      className='w-fit shrink-0 rounded-lg bg-slate-100 px-4 py-2 font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-50 cursor-pointer'
    >
      {loading ? 'Logging out...' : 'Log out'}
    </button>
  )
}
