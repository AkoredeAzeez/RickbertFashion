import { createContext, useContext, useEffect, useState } from 'react'
import { Auth, getAuth } from '../actions/auth.action'

interface AuthContextType {
  auth: Auth | null
  login: (auth: Auth) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  auth: null,
  login: () => {},
  logout: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<Auth | null>(null)

  useEffect(() => {
    const auth = getAuth()
    if (auth) {
      setAuth(auth)
    }
  }, [])

  const login = (auth: Auth) => {
    setAuth(auth)
  }

  const logout = () => {
    setAuth(null)
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
