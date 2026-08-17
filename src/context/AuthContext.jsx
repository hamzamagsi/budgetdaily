import { createContext, useContext, useEffect, useState } from 'react'
import { store, usingLocalStore } from '../lib/store'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const AuthContext = createContext(null)

// Maps a real Supabase auth user into the shape the rest of the app expects
// (the same shape Login.jsx's manual signIn() calls already use).
function mapSupabaseUser(sbUser) {
  if (!sbUser) return null
  return {
    id: sbUser.id,
    email: sbUser.email,
    name:
      sbUser.user_metadata?.full_name ||
      sbUser.user_metadata?.name ||
      sbUser.email?.split('@')[0] ||
      'User',
    avatar: sbUser.user_metadata?.avatar_url || sbUser.user_metadata?.picture || null,
    verified: true,
    method: sbUser.app_metadata?.provider || 'supabase',
  }
}

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

    // THE FIX: this used to only live inside Login.jsx, so it only ran if the
    // OAuth redirect happened to land back on /login. Google's redirectTo
    // points at /dashboard (or wherever Supabase's redirect allow-list falls
    // back to), so that page never mounted and the session was never adopted
    // into the app's own user state. Checking here, at the top level, means
    // it fires no matter which page the browser lands on after OAuth.
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data }) => {
        const sbUser = data?.session?.user
        if (sbUser) {
          const mapped = mapSupabaseUser(sbUser)
          store.signIn(mapped)
          setUser(mapped)
        }
      })

      const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const mapped = mapSupabaseUser(session.user)
          store.signIn(mapped)
          setUser(mapped)
        }
        if (event === 'SIGNED_OUT') {
          store.signOut()
          setUser(null)
        }
      })

      return () => listener?.subscription?.unsubscribe()
    }
  }, [])

  const signIn = (userData) => {
    const u = store.signIn(userData)
    setUser(u)
    refreshAuth()
    return u
  }

  const signOut = async () => {
    // THE OTHER FIX: this used to only clear the app's own local session key,
    // never the real Supabase session — so Supabase still considered you
    // logged in, and the next session check (e.g. on /login) silently logged
    // you right back in, making "sign out" look broken.
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut()
    }
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
