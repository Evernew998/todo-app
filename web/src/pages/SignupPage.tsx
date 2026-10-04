import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useMutation } from '@apollo/client/react'
import { SIGNUP } from '../graphql/auth'
import { setToken } from '../auth/token'

export default function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [signup, { loading, error }] = useMutation(SIGNUP, {
    onCompleted: ({ signup }) => {
      setToken(signup.token)
      navigate('/')
    },
    onError: (error) => console.error('Sign up failed:', error.message),
  })

  function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault()
    signup({ variables: { email, password } })
  }

  return (
    <main>
      <div>
        <h1>Sign Up</h1>

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
              autoComplete='new-password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type='submit' disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        {error && <p>{error.message}</p>}

        <p>
          Already have an account? <Link to='/login'>Login</Link>
        </p>
      </div>
    </main>
  )
}
