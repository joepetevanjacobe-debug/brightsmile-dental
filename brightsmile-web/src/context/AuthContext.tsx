import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/axios'

interface AuthUser {
  userId: number
  name: string
  email: string
  role: 'ADMIN' | 'RECEPTIONIST' | 'DOCTOR' | 'PATIENT'
  accessToken: string
}

interface AuthContextType {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('auth_user')
    if (stored) {
      const parsed: AuthUser = JSON.parse(stored)
      setUser(parsed)
      api.defaults.headers.common['Authorization'] = `Bearer ${parsed.accessToken}`
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const { data } = await api.post<AuthUser>('/api/auth/login', { email, password })
    localStorage.setItem('auth_user', JSON.stringify(data))
    api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`
    setUser(data)
  }

  const logout = () => {
    localStorage.removeItem('auth_user')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    api.post('/api/auth/logout').catch(() => {})
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
