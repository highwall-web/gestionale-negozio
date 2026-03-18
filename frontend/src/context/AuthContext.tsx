import { createContext, useContext, useEffect, useState } from 'react'
import { refresh } from '../api/endpoints/auth-controller/auth-controller'
import { tokenStore } from '../api/tokenStore'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    refresh()
      .then((res) => {
        tokenStore.set(res.accessToken)
        setIsAuthenticated(true)
      })
      .catch(() => {
        setIsAuthenticated(false)
      })
      .finally(() => setIsLoading(false))
  }, [])

  function login(token: string) {
    tokenStore.set(token)
    setIsAuthenticated(true)
  }

  function logout() {
    tokenStore.set(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
