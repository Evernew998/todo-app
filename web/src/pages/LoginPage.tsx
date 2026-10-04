import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useMutation } from '@apollo/client/react'
import { LOGIN } from '../graphql/auth'
import { setToken } from '../auth/token'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [login, { loading, error }] = useMutation(LOGIN, {
    onCompleted: ({ login }) => {
      setToken(login.token)
      navigate('/')
    },
    onError: (error) => console.error('Login failed:', error.message),
  })

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    login({ variables: { email, password } })
  }

  return (
    <main>
      <div>
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='email'>Email</label>
            <input
              id='email'
              type='email'
              autoComplete='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor='password'>Password</label>
            <input
              id='password'
              type='password'
              autoComplete='current-password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type='submit' disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        {error && (
          <p className='mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600'>{error.message}</p>
        )}

        <p>
          Need an account? <Link to='/signup'>Sign up</Link>
        </p>
      </div>
    </main>
  )
}
