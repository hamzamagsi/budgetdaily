import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { store } from '../lib/store'

export default function Login() {
  const [email, setEmail] = useState('')
  const { signIn, usingLocalStore } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    signIn(email)
    const hasBudget = store.getActiveBudget()
    navigate(hasBudget ? '/dashboard' : '/onboarding')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl font-semibold text-center mb-2">Welcome</h1>
        <p className="text-sm text-[var(--color-text-dim)] text-center mb-8">
          {usingLocalStore
            ? "Demo mode — any email creates a local session on this device."
            : "We'll email you a magic link, no password needed."}
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[var(--color-panel)] border border-[var(--color-line)] text-sm outline-none focus:border-[var(--color-brand)] transition-colors"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[var(--color-brand)] text-[var(--color-ink)] font-semibold text-sm hover:brightness-110 transition-all"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}
