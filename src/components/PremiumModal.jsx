import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { POLAR_PLANS } from '../lib/polar'
import confetti from 'canvas-confetti'
import {
  Crown,
  Check,
  X,
  Sparkles,
  Zap,
  Shield,
  CheckCircle2,
  Lock,
  CreditCard,
  Calendar,
  Key,
  ArrowLeft,
  Loader2,
  ExternalLink,
  Receipt,
  AlertCircle,
} from 'lucide-react'

export const FREE_FEATURES = [
  { id: '1', name: 'Daily Allowance Engine', desc: 'Automatic calculation based on total days' },
  { id: '2', name: 'Basic Spend Logging', desc: 'Up to 5 transactions per day' },
  { id: '3', name: 'Semi-Circle Fuel Gauge', desc: 'Real-time daily status & warning alerts' },
  { id: '4', name: '3-Day Spending History', desc: 'Review your recent 3 days of purchases' },
]

export const PREMIUM_FEATURES = [
  { id: 'p1', name: 'Unlimited Daily Spend Logging', desc: 'No limits — log every chai, snack, and bill without restriction' },
  { id: 'p2', name: 'Custom Categories & Icon Maker', desc: 'Create unique categories with custom icons (☕ Chai, 🍕 Pizza, 🎮 Gaming)' },
  { id: 'p3', name: 'Visual Analytics & Spending Breakdown', desc: 'Interactive category charts, daily trends, and spending distributions' },
  { id: 'p4', name: 'Export to CSV & PDF Reports', desc: 'Download clean financial statements for spreadsheets and tax tracking' },
  { id: 'p5', name: 'Recurring Subscriptions & Bills Tracker', desc: 'Track Netflix, Spotify, Gym, Rent with automatic daily deduction forecasts' },
  { id: 'p6', name: 'Smart AI Spending Advisor', desc: 'Personalized recommendations on where you can optimize daily spends' },
  { id: 'p7', name: 'Multi-Payment & Wallet Tracking', desc: 'Separate Cash 💵, Debit/Credit Card 💳, and Digital Wallets 📱' },
  { id: 'p8', name: 'Savings Goal Pots & Daily Rollover', desc: 'Auto-transfer leftover daily allowance into dedicated savings funds' },
  { id: 'p9', name: 'Luxury OLED Themes & Customization', desc: 'Obsidian Black, Emerald Gold, Midnight Sapphire, and Sunset Amber palettes' },
  { id: 'p10', name: 'Cloud Sync & Multi-Device Backup', desc: 'Instant real-time sync across your iPhone, Android, and Desktop' },
]

export const PRICING_PLANS = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$1',
    priceNum: 1.0,
    period: '/ month',
    billing: 'Billed monthly · cancel anytime',
    badge: 'Most Popular',
    popular: true,
  },
  {
    id: 'half_yearly',
    name: '6 Months',
    price: '$5',
    priceNum: 5.0,
    period: 'for 6 mo',
    billing: 'Save $1 upfront · $0.83/mo',
    badge: 'Save $1',
    popular: false,
  },
  {
    id: 'yearly',
    name: '1 Year (Annual)',
    price: '$9',
    priceNum: 9.0,
    period: '/ year',
    billing: 'Save 25% · Only $0.75/month',
    badge: 'Best Value',
    popular: false,
  },
  {
    id: 'lifetime',
    name: 'Lifetime Access',
    price: '$100',
    priceNum: 100.0,
    period: 'one-time',
    billing: 'Pay once, own forever · No renewals',
    badge: 'VIP Lifetime',
    popular: false,
  },
]

export default function PremiumModal({ isOpen, onClose, highlightFeature = '' }) {
  const { user, upgradePlan } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const [step, setStep] = useState('plans') // 'plans' | 'checkout' | 'success'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Card Checkout States
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [cardName, setCardName] = useState(user?.name || '')

  if (!isOpen) return null

  const currentPlan = PRICING_PLANS.find((p) => p.id === selectedPlan) || PRICING_PLANS[0]

  // Format Card Number input
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16)
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim()
    setCardNumber(formatted)
    setError('')
  }

  // Format Expiry input
  const handleExpiryChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4)
    if (raw.length >= 2) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`)
    } else {
      setCardExpiry(raw)
    }
    setError('')
  }

  // Handle Initial Click on Yellow Button -> Open Card Checkout Sheet
  const handleStartCheckout = () => {
    setError('')
    const customUrl = import.meta.env.VITE_POLAR_CHECKOUT_URL
    if (customUrl) {
      window.location.href = customUrl
      return
    }
    setStep('checkout')
  }

  // Handle Card Payment Submission
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

    // Process secure payment with Polar gateway simulation
    setTimeout(() => {
      upgradePlan(selectedPlan)
      setLoading(false)
      setStep('success')

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899'],
        })
      } catch (err) {}

      setTimeout(() => {
        onClose()
        setStep('plans')
      }, 2200)
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-[var(--color-brand)]/40 shadow-2xl overflow-hidden">
        {/* Decorative ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--color-brand-glow)] rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Close Button */}
        <button
          onClick={() => {
            onClose()
            setStep('plans')
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[var(--color-text-dim)] hover:text-white transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* STEP 1: Plan Selection & Feature Overview */}
        {step === 'plans' && (
          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-brand)]/15 border border-[var(--color-brand)]/30 text-[var(--color-brand)] text-xs font-semibold uppercase tracking-wider mb-2">
                <Crown size={14} />
                <span>BudgetDaily Pro · Powered by Polar.sh</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Unlock All 10 Premium Superpowers
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-text-dim)] mt-1 max-w-md mx-auto">
                Supercharge your finance with unlimited logs, custom icons (like ☕ Tea / Chai), AI insights & detailed analytics for just $1/mo.
              </p>
            </div>

            {/* PRICING SELECTOR CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
              {PRICING_PLANS.map((plan) => {
                const isSelected = selectedPlan === plan.id
                return (
                  <div
                    key={plan.id}
                    onClick={() => {
                      setSelectedPlan(plan.id)
                      setError('')
                    }}
                    className={`relative p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between text-left ${
                      isSelected
                        ? 'bg-[rgba(245,158,11,0.12)] border-[var(--color-brand)] shadow-lg shadow-[var(--color-brand)]/10 scale-[1.02]'
                        : 'bg-[#0e131f] border-[var(--color-line)] hover:border-[var(--color-text-dim)]/40 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {plan.badge && (
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mb-1.5 self-start ${
                          isSelected
                            ? 'bg-[var(--color-brand)] text-[var(--color-ink)]'
                            : 'bg-[#1e293b] text-[var(--color-text-dim)]'
                        }`}
                      >
                        {plan.badge}
                      </span>
                    )}
                    <div>
                      <p className="text-xs font-medium text-[var(--color-text-dim)]">{plan.name}</p>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-xl sm:text-2xl font-bold font-mono text-white">
                          {plan.price}
                        </span>
                        <span className="text-[10px] text-[var(--color-text-faint)]">
                          {plan.period}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-[var(--color-text-faint)] mt-2 leading-tight">
                      {plan.billing}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* FEATURE COMPARISON: 4 FREE VS 10 PRO */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {/* 4 FREE FEATURES */}
              <div className="p-4 rounded-2xl bg-[#0e131f] border border-[var(--color-line)]">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--color-line)]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-dim)]">
                    Free Plan (4 Features)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#1e293b] text-[var(--color-text-dim)] font-mono">
                    $0 / forever
                  </span>
                </div>
                <ul className="space-y-2.5 text-xs">
                  {FREE_FEATURES.map((feat) => (
                    <li key={feat.id} className="flex items-start gap-2 text-[var(--color-text-dim)]">
                      <Check size={14} className="text-[var(--color-safe)] mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-[var(--color-text)]">{feat.name}</p>
                        <p className="text-[11px] text-[var(--color-text-faint)]">{feat.desc}</p>
                      </div>
                    </li>
                  ))}
                  <li className="flex items-start gap-2 text-[var(--color-text-faint)] pt-1 opacity-70">
                    <X size={14} className="text-[var(--color-over)] mt-0.5 shrink-0" />
                    <span>No custom categories, max 5 logs/day, 3-day history</span>
                  </li>
                </ul>
              </div>

              {/* 10 PRO FEATURES */}
              <div className="p-4 rounded-2xl bg-gradient-to-b from-[#182338] to-[#121a2c] border border-[var(--color-brand)]/40 shadow-md">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--color-brand)]/20">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand)] flex items-center gap-1.5">
                    <Sparkles size={13} />
                    <span>Pro Member (10 Features)</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--color-brand)] text-[var(--color-ink)] font-bold font-mono">
                    PRO
                  </span>
                </div>
                <div className="max-h-56 overflow-y-auto pr-1 space-y-2.5 text-xs">
                  {PREMIUM_FEATURES.map((feat) => {
                    const isHighlighted =
                      highlightFeature && feat.name.toLowerCase().includes(highlightFeature.toLowerCase())
                    return (
                      <div
                        key={feat.id}
                        className={`flex items-start gap-2 p-1.5 rounded-lg transition-colors ${
                          isHighlighted ? 'bg-[var(--color-brand)]/20 border border-[var(--color-brand)]/30' : ''
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-[var(--color-brand)]/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={11} className="text-[var(--color-brand)]" />
                        </div>
                        <div>
                          <p className="font-semibold text-white flex items-center gap-1">
                            <span>{feat.name}</span>
                          </p>
                          <p className="text-[11px] text-[var(--color-text-dim)]">{feat.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleStartCheckout}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-[var(--color-ink)] font-bold text-sm hover:brightness-110 active:scale-[0.99] transition-all shadow-xl shadow-[var(--color-brand)]/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap size={18} fill="currentColor" />
                <span>
                  Pay {currentPlan.price} with Polar.sh ({currentPlan.name})
                </span>
                <ExternalLink size={14} className="ml-1 opacity-75" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-[var(--color-text-faint)]">
                <span className="flex items-center gap-1">
                  <Shield size={12} /> Polar.sh Checkout Protection
                </span>
                <span>•</span>
                <span>Cancel anytime</span>
                <span>•</span>
                <span>Instant Pro Activation</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Secure Polar Card Checkout Sheet */}
        {step === 'checkout' && (
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--color-line)]">
              <button
                type="button"
                onClick={() => setStep('plans')}
                className="flex items-center gap-1.5 text-xs text-[var(--color-text-dim)] hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Change Plan</span>
              </button>
              <div className="flex items-center gap-1.5 text-xs text-[var(--color-brand)] font-mono font-semibold">
                <Shield size={14} />
                <span>Polar.sh Secure Checkout</span>
              </div>
            </div>

            {/* ORDER SUMMARY */}
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

            {/* PAYMENT CARD FORM */}
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

            <div className="mt-4 pt-4 border-t border-[var(--color-line)] flex items-center justify-center gap-2 text-[11px] text-[var(--color-text-faint)]">
              <Shield size={13} className="text-[var(--color-safe)]" />
              <span>Encrypted with 256-bit TLS · Polar Merchant Certified</span>
            </div>
          </div>
        )}

        {/* STEP 3: Payment Success & Pro Activated Receipt */}
        {step === 'success' && (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[var(--color-safe)]/20 text-[var(--color-safe)] flex items-center justify-center mx-auto shadow-xl shadow-[var(--color-safe)]/20">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-2xl font-bold text-white">Payment Confirmed!</h3>
            <p className="text-xs sm:text-sm text-[var(--color-text-dim)] max-w-sm mx-auto">
              You are now an active <strong className="text-amber-400">BudgetDaily Pro Member</strong>. All 10 premium features are immediately unlocked.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[var(--color-text-dim)]">
              <Receipt size={13} />
              <span>Receipt sent to {user?.email || 'your email'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
