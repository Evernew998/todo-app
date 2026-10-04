import { createContext, useContext, useEffect, useState } from 'react'
import { getToken, setToken, clearToken } from './token'

type AuthContextType = {
  token: string | null
  isLoading: boolean
  signIn: (token: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getToken().then((saved) => {
      setTokenState(saved)
      setIsLoading(false)
    })
  }, [])

  async function signIn(newToken: string) {
    await setToken(newToken)
    setTokenState(newToken)
  }

  async function signOut() {
    await clearToken()
    setTokenState(null)
  }

  return (
    <AuthContext.Provider value={{ token, isLoading, signIn, signOut }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
