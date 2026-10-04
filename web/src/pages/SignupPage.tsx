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
    <div className='flex items-center justify-center p-4 min-h-screen bg-slate-50'>
      <div className='p-8 w-full max-w-md rounded-2xl bg-white shadow-lg'>
        <h1 className='text-2xl font-bold text-slate-900'>Sign Up</h1>

        <form onSubmit={handleSubmit} className='mt-6 space-y-4'>
          <div>
            <label htmlFor='email' className='block text-sm font-medium text-slate-700'>
              Email
            </label>
            <input
              id='email'
              type='email'
              autoComplete='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20'
            />
          </div>

          <div>
            <label htmlFor='password' className='block text-sm font-medium text-slate-700'>
              Password
            </label>
            <input
              id='password'
              type='password'
              autoComplete='new-password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer'
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        {error && (
          <p className='mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600'>{error.message}</p>
        )}

        <p className='mt-6 text-center text-sm text-slate-500'>
          Already have an account?{' '}
          <Link to='/login' className='font-medium text-blue-600 hover:underline'>
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
