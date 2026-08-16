import { createContext, useContext, useEffect, useState } from 'react'
import { store, usingLocalStore } from '../lib/store'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(store.getUser())
    setLoading(false)
  }, [])

  const signIn = (email) => {
    const u = store.signIn(email)
    setUser(u)
    return u
  }

  const signOut = () => {
    store.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, usingLocalStore }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
