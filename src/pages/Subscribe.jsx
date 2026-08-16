import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { store, usingLocalStore } from '../lib/store'

export default function Subscribe() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    setLoading(true)
    if (usingLocalStore) {
      // Local demo: skip real Stripe, just flip the flag.
      store.setSubscription({ status: 'active', plan: 'monthly' })
      navigate('/dashboard')
      return
    }
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      })
      const { url } = await res.json()
      window.location.href = url
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-[var(--color-warn)] uppercase mb-3">
          7-day free trial
        </p>
        <h1 className="font-display text-2xl font-semibold mb-2">Keep your gauge running</h1>
        <p className="text-sm text-[var(--color-text-dim)] mb-8">
          $4/month. Cancel anytime from your account. No hidden tiers.
        </p>

        <div className="rounded-2xl bg-[var(--color-panel)] border border-[var(--color-line)] px-6 py-6 mb-6 text-left">
          <ul className="space-y-2 text-sm text-[var(--color-text-dim)]">
            <li>· Unlimited budgets and expense logging</li>
            <li>· Daily allowance that adjusts automatically</li>
            <li>· Full history across every period</li>
          </ul>
        </div>

        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-[var(--color-brand)] text-[var(--color-ink)] font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-60"
        >
          {loading ? 'Redirecting…' : 'Start free trial'}
        </button>
      </div>
    </div>
  )
}
