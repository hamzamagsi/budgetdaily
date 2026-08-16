import { createContext, useContext, useEffect, useState } from 'react'
import { store, usingLocalStore } from '../lib/store'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [subscription, setSubscriptionState] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshAuth = () => {
    setUser(store.getUser())
    setSubscriptionState(store.getSubscription())
  }

  useEffect(() => {
    refreshAuth()
    setLoading(false)
  }, [])

  const signIn = (userData) => {
    const u = store.signIn(userData)
    setUser(u)
    refreshAuth()
    return u
  }

  const signOut = () => {
    store.signOut()
    setUser(null)
    refreshAuth()
  }

  const upgradePlan = (planId) => {
    const sub = store.setSubscription({ plan: planId })
    setSubscriptionState(sub)
    return sub
  }

  const isPro = !!(subscription && subscription.isPro)

  return (
    <AuthContext.Provider
      value={{
        user,
        subscription,
        isPro,
        loading,
        signIn,
        signOut,
        upgradePlan,
        refreshAuth,
        usingLocalStore,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
