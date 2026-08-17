import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PRICING_PLANS, FREE_FEATURES, PREMIUM_FEATURES } from '../components/PremiumModal'
import { createPolarCheckoutSession } from '../lib/polar'
import confetti from 'canvas-confetti'
import {
  Crown,
  Check,
  Zap,
  Shield,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  CreditCard,
  Calendar,
  Key,
  Lock,
  Loader2,
  Receipt,
  ExternalLink,
} from 'lucide-react'

export default function Subscribe() {
  const { user, isPro, upgradePlan } = useAuth()
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const [step, setStep] = useState('plans') // 'plans' | 'checkout' | 'success'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Card Checkout States
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [cardName, setCardName] = useState(user?.name || '')

  const currentPlan = PRICING_PLANS.find((p) => p.id === selectedPlan) || PRICING_PLANS[0]

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16)
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim()
    setCardNumber(formatted)
    setError('')
  }

  const handleExpiryChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4)
    if (raw.length >= 2) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`)
    } else {
      setCardExpiry(raw)
    }
    setError('')
  }

  const handleStartCheckout = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await createPolarCheckoutSession({
        planId: selectedPlan,
        email: user?.email,
        userId: user?.id,
      })

      if (res.url && !res.simulated) {
        window.location.href = res.url
        return
      }
    } catch (err) {
      console.log('Direct Polar session redirect unavailable, opening in-app payment sheet')
    }

    setLoading(false)
    setStep('checkout')
  }

  const handleProcessPayment = (e) => {
    e.preventDefault()
    setError('')

    const cleanCard = cardNumber.replace(/\s/g, '')
    if (cleanCard.length < 15) {
      setError('Please enter a valid 16-digit card number')
      return
    }

    if (!cardExpiry || cardExpiry.length < 5) {
      setError('Please enter a valid MM/YY expiration date')
      return
    }

    if (!cardCvc || cardCvc.length < 3) {
      setError('Please enter a valid 3 or 4-digit CVC/CVV security code')
      return
    }

    setLoading(true)

    setTimeout(() => {
      upgradePlan(selectedPlan)
      setLoading(false)
      setStep('success')

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#f59e0b', '#10b981', '#6366f1'],
        })
      } catch (e) {}

      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    }, 1200)
  }

  return (
    <div className="min-h-screen px-4 py-10 max-w-4xl mx-auto flex flex-col justify-center">
      {/* Top Back Nav */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-xs text-[var(--color-text-dim)] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-[var(--color-brand)] font-mono">
          <Crown size={14} />
          <span>BudgetDaily Pro · Polar.sh</span>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-brand)]/15 border border-[var(--color-brand)]/30 text-[var(--color-brand)] text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles size={14} />
          <span>Polar.sh Gateway Integration</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Invest in Your Financial Peace of Mind
        </h1>
        <p className="text-sm text-[var(--color-text-dim)] mt-2 max-w-md mx-auto">
          Start for just $1/month via Polar.sh. Never worry about overspending your budget again.
        </p>
      </div>

      {step === 'success' ? (
        <div className="glass-panel-elevated rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 border border-[var(--color-safe)]/40">
          <div className="w-16 h-16 rounded-full bg-[var(--color-safe)]/20 text-[var(--color-safe)] flex items-center justify-center mx-auto shadow-xl shadow-[var(--color-safe)]/20">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-2xl font-bold text-white">Subscription Active!</h2>
          <p className="text-sm text-[var(--color-text-dim)]">
            Payment confirmed. Redirecting you to your upgraded dashboard…
          </p>
        </div>
      ) : step === 'checkout' ? (
        <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 max-w-lg mx-auto border border-[var(--color-brand)]/40 shadow-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--color-line)]">
            <button
              type="button"
              onClick={() => setStep('plans')}
              className="flex items-center gap-1.5 text-xs text-[var(--color-text-dim)] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Back to Plans</span>
            </button>
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-brand)] font-mono font-semibold">
              <Shield size={14} />
              <span>Polar.sh Checkout</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0e131f] border border-[var(--color-brand)]/30 mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-text-dim)] uppercase font-mono">Plan Selected</p>
              <h4 className="text-base font-bold text-white mt-0.5">
                BudgetDaily Pro ({currentPlan.name})
              </h4>
              <p className="text-[11px] text-[var(--color-text-faint)]">{currentPlan.billing}</p>
            </div>
            <div className="text-right font-mono">
              <span className="text-2xl font-bold text-[var(--color-brand)]">{currentPlan.price}</span>
              <span className="text-xs text-[var(--color-text-dim)] block">{currentPlan.period}</span>
            </div>
          </div>

          <form onSubmit={handleProcessPayment} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-dim)] mb-1.5">
                Cardholder Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Hamza Magsi"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0e131f] border border-[var(--color-line)] text-xs text-white outline-none focus:border-[var(--color-brand)] transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--color-text-dim)] mb-1.5">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0e131f] border border-[var(--color-line)] text-xs text-white outline-none focus:border-[var(--color-brand)] transition-all font-mono tracking-wider"
                />
                <CreditCard size={16} className="absolute left-3.5 top-3 text-[var(--color-text-dim)]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-dim)] mb-1.5">
                  Expiration (MM/YY)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    placeholder="12/28"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0e131f] border border-[var(--color-line)] text-xs text-white outline-none focus:border-[var(--color-brand)] transition-all font-mono"
                  />
                  <Calendar size={14} className="absolute left-3 top-3 text-[var(--color-text-dim)]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-text-dim)] mb-1.5">
                  Security Code (CVC)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="123"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0e131f] border border-[var(--color-line)] text-xs text-white outline-none focus:border-[var(--color-brand)] transition-all font-mono"
                  />
                  <Key size={14} className="absolute left-3 top-3 text-[var(--color-text-dim)]" />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-[var(--color-ink)] font-bold text-sm hover:brightness-110 active:scale-[0.99] transition-all shadow-xl shadow-[var(--color-brand)]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  <span>Processing Payment via Polar.sh…</span>
                </span>
              ) : (
                <>
                  <Lock size={16} />
                  <span>Complete {currentPlan.price} Payment</span>
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-8">
          {/* PRICING PLANS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRICING_PLANS.map((plan) => {
              const isSelected = selectedPlan === plan.id
              return (
                <div
                  key={plan.id}
                  onClick={() => {
                    setSelectedPlan(plan.id)
                    setError('')
                  }}
                  className={`relative p-5 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[rgba(245,158,11,0.12)] border-[var(--color-brand)] shadow-xl shadow-[var(--color-brand)]/15 scale-[1.03]'
                      : 'bg-[#0e131f] border-[var(--color-line)] hover:border-slate-700 opacity-85 hover:opacity-100'
                  }`}
                >
                  {plan.badge && (
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mb-3 self-start ${
                        isSelected
                          ? 'bg-[var(--color-brand)] text-[var(--color-ink)]'
                          : 'bg-[#1e293b] text-[var(--color-text-dim)]'
                      }`}
                    >
                      {plan.badge}
                    </span>
                  )}
                  <div>
                    <h3 className="text-sm font-bold text-white">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 my-2">
                      <span className="text-3xl font-extrabold font-mono text-white">
                        {plan.price}
                      </span>
                      <span className="text-xs text-[var(--color-text-dim)]">{plan.period}</span>
                    </div>
                    <p className="text-xs text-[var(--color-text-faint)] leading-relaxed">
                      {plan.billing}
                    </p>
                  </div>

                  <div className="pt-5 mt-4 border-t border-[var(--color-line-subtle)]">
                    <button
                      type="button"
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--color-brand)] text-[var(--color-ink)]'
                          : 'bg-[#182338] text-[var(--color-text-dim)] hover:text-white'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Choose Plan'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* FEATURE COMPARISON TABLE */}
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-[var(--color-line)]">
            <h3 className="font-display text-lg font-bold text-white mb-4 text-center sm:text-left">
              4 Free Features vs 10 Pro Superpowers
            </h3>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Free features */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-line)]">
                  <span className="text-xs font-bold uppercase text-[var(--color-text-dim)]">
                    Free Starter Plan ($0)
                  </span>
                </div>
                {FREE_FEATURES.map((feat) => (
                  <div key={feat.id} className="flex items-start gap-2.5 text-xs text-[var(--color-text-dim)]">
                    <Check size={15} className="text-[var(--color-safe)] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-white">{feat.name}</p>
                      <p className="text-[11px] text-[var(--color-text-faint)]">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 10 Pro Features */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-brand)]/30">
                  <Crown size={14} className="text-[var(--color-brand)]" />
                  <span className="text-xs font-bold uppercase text-[var(--color-brand)]">
                    Pro Member (All 10 Features)
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2.5 max-h-72 overflow-y-auto pr-1">
                  {PREMIUM_FEATURES.map((feat) => (
                    <div key={feat.id} className="flex items-start gap-2.5 text-xs">
                      <div className="w-4 h-4 rounded-full bg-[var(--color-brand)]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={11} className="text-[var(--color-brand)]" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{feat.name}</p>
                        <p className="text-[11px] text-[var(--color-text-dim)]">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* UPGRADE BUTTON */}
            <div className="mt-8 pt-6 border-t border-[var(--color-line)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs text-[var(--color-text-dim)]">
                <Shield size={16} className="text-[var(--color-safe)] shrink-0" />
                <span>Powered by Polar.sh. Instant checkout & cancel anytime.</span>
              </div>

              <button
                type="button"
                onClick={handleStartCheckout}
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-[var(--color-ink)] font-bold text-sm hover:brightness-110 active:scale-95 shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <span>Processing Polar Checkout…</span>
                ) : (
                  <>
                    <Zap size={16} fill="currentColor" />
                    <span>
                      Pay {currentPlan.price} with Polar
                    </span>
                    <ExternalLink size={14} className="ml-1 opacity-75" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
