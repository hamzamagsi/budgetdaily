import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
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
  { id: '3', name: 'Calendar Date Matrix', desc: 'Review day-by-day past transactions' },
  { id: '4', name: '3-Day Spending History', desc: 'Basic recent purchase history' },
]

export const PREMIUM_FEATURES = [
  { id: 'p1', name: 'Unlimited Daily Spend Logging', desc: 'No limits — log every chai, snack, and bill without restriction' },
  { id: 'p2', name: 'Custom Categories & Icon Maker', desc: 'Create unique categories with 30+ custom icons (☕ Chai, 🍕 Pizza, 🎮 Gaming)' },
  { id: 'p3', name: 'Visual Analytics & Spending Breakdown', desc: 'Interactive category charts, daily trends, and spending distributions' },
  { id: 'p4', name: 'Export to CSV & PDF Reports', desc: 'Download clean financial statements for spreadsheets and tax tracking' },
  { id: 'p5', name: 'Recurring Subscriptions & Bills Tracker', desc: 'Track Netflix, Spotify, Gym, Rent with automatic daily deduction forecasts' },
  { id: 'p6', name: 'Smart AI Spending Advisor', desc: 'Personalized recommendations on where you can optimize daily spends' },
  { id: 'p7', name: 'Multi-Payment & Wallet Tracking', desc: 'Separate Cash 💵, Debit/Credit Card 💳, and Digital Wallets 📱' },
  { id: 'p8', name: 'Savings Goal Pots & Daily Rollover', desc: 'Auto-transfer leftover daily allowance into dedicated savings funds' },
  { id: 'p9', name: 'Category Budget Allocations', desc: 'Set custom monthly limit targets per category' },
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

  const handleStartCheckout = () => {
    setError('')
    const customUrl = import.meta.env.VITE_POLAR_CHECKOUT_URL
    if (customUrl) {
      window.location.href = customUrl
      return
    }
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
          colors: ['#6c5ce7', '#10b981', '#f59e0b'],
        })
      } catch (err) {}

      setTimeout(() => {
        onClose()
        setStep('plans')
        window.dispatchEvent(new Event('storage_change'))
      }, 2000)
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#e8e4f5] my-auto animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            onClose()
            setStep('plans')
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#f8f6ff] hover:bg-[#ede9fe] text-[#64748b] hover:text-[#1f2430] transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* STEP 1: PLANS & COMPARISON */}
        {step === 'plans' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ede9fe] text-[#6c5ce7] text-xs font-bold uppercase tracking-wider mb-2 font-mono">
                <Crown size={14} />
                <span>BudgetDaily Pro · Powered by Polar.sh</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1f2430]">
                Unlock All 10 Premium Superpowers
              </h2>
              <p className="text-xs sm:text-sm text-[#64748b] mt-1.5 max-w-md mx-auto">
                Supercharge your finance with unlimited logs, custom icons (like ☕ Tea / Chai), AI insights & detailed analytics for just $1/mo.
              </p>
            </div>

            {/* PRICING SELECTOR CARDS (LIGHT PASTEL STYLE) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRICING_PLANS.map((plan) => {
                const isSelected = selectedPlan === plan.id
                return (
                  <div
                    key={plan.id}
                    onClick={() => {
                      setSelectedPlan(plan.id)
                      setError('')
                    }}
                    className={`relative p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between text-left ${
                      isSelected
                        ? 'bg-[#ede9fe] border-2 border-[#6c5ce7] shadow-lg shadow-[#6c5ce7]/15 scale-[1.02]'
                        : 'bg-[#f8f6ff] border-[#e8e4f5] hover:border-[#cbd5e1] hover:bg-white'
                    }`}
                  >
                    {plan.badge && (
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mb-2 self-start ${
                          isSelected
                            ? 'bg-[#6c5ce7] text-white'
                            : 'bg-[#e2e8f0] text-[#64748b]'
                        }`}
                      >
                        {plan.badge}
                      </span>
                    )}
                    <div>
                      <p className="text-xs font-bold text-[#1f2430]">{plan.name}</p>
                      <div className="flex items-baseline gap-1 my-1">
                        <span className={`text-2xl font-extrabold font-mono ${isSelected ? 'text-[#6c5ce7]' : 'text-[#1f2430]'}`}>
                          {plan.price}
                        </span>
                        <span className="text-[10px] text-[#64748b] font-medium">
                          {plan.period}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-[#64748b] mt-1 leading-tight">
                      {plan.billing}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* FEATURE COMPARISON: 4 FREE VS 10 PRO */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* 4 FREE FEATURES */}
              <div className="p-4 rounded-2xl bg-[#f8f6ff] border border-[#e8e4f5]">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#e8e4f5]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
                    Free Plan (4 Features)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-[#e8e4f5] text-[#64748b] font-mono font-bold">
                    $0 / forever
                  </span>
                </div>
                <ul className="space-y-2.5 text-xs">
                  {FREE_FEATURES.map((feat) => (
                    <li key={feat.id} className="flex items-start gap-2 text-[#334155]">
                      <Check size={14} className="text-[#10b981] mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-[#1f2430]">{feat.name}</p>
                        <p className="text-[11px] text-[#64748b]">{feat.desc}</p>
                      </div>
                    </li>
                  ))}
                  <li className="flex items-start gap-2 text-[#94a3b8] pt-1">
                    <X size={14} className="text-[#ef4444] mt-0.5 shrink-0" />
                    <span>No custom categories, max 5 logs/day, 3-day history</span>
                  </li>
                </ul>
              </div>

              {/* 10 PRO FEATURES */}
              <div className="p-4 rounded-2xl bg-[#f0fdf4] border-2 border-[#bbf7d0] shadow-xs">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#bbf7d0]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#16a34a] flex items-center gap-1.5">
                    <Sparkles size={14} />
                    <span>Pro Member (10 Superpowers)</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#16a34a] text-white font-bold font-mono">
                    PRO
                  </span>
                </div>
                <div className="max-h-56 overflow-y-auto pr-1 space-y-2 text-xs">
                  {PREMIUM_FEATURES.map((feat) => (
                    <div key={feat.id} className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#dcfce7] flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={11} className="text-[#16a34a]" />
                      </div>
                      <div>
                        <p className="font-bold text-[#1f2430]">{feat.name}</p>
                        <p className="text-[11px] text-[#64748b] leading-tight">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleStartCheckout}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-900 font-bold text-sm hover:brightness-105 active:scale-[0.99] transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap size={18} fill="currentColor" />
                <span>
                  Pay {currentPlan.price} with Polar.sh ({currentPlan.name})
                </span>
                <ExternalLink size={14} className="ml-1 opacity-80" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-[#94a3b8]">
                <span className="flex items-center gap-1">
                  <Shield size={12} className="text-[#10b981]" /> Polar.sh Checkout Protection
                </span>
                <span>•</span>
                <span>Cancel anytime</span>
                <span>•</span>
                <span>Instant Pro Activation</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: IN-APP POLAR CARD CHECKOUT */}
        {step === 'checkout' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#f1edf9]">
              <button
                type="button"
                onClick={() => setStep('plans')}
                className="flex items-center gap-1.5 text-xs font-bold text-[#6c5ce7] hover:opacity-80 cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Change Plan</span>
              </button>
              <div className="flex items-center gap-1.5 text-xs text-[#6c5ce7] font-mono font-bold">
                <Shield size={14} />
                <span>Polar.sh Secure Checkout</span>
              </div>
            </div>

            {/* ORDER SUMMARY */}
            <div className="p-4 rounded-2xl bg-[#ede9fe] border border-[#ddd6fe] flex items-center justify-between">
              <div>
                <p className="text-[10px] text-[#6c5ce7] uppercase font-bold tracking-wider font-mono">
                  Plan Selected
                </p>
                <h4 className="text-sm font-bold text-[#1f2430] mt-0.5">
                  BudgetDaily Pro ({currentPlan.name})
                </h4>
                <p className="text-[11px] text-[#64748b]">{currentPlan.billing}</p>
              </div>
              <div className="text-right font-mono">
                <span className="text-2xl font-bold text-[#6c5ce7]">{currentPlan.price}</span>
                <span className="text-xs text-[#64748b] block">{currentPlan.period}</span>
              </div>
            </div>

            {/* CARD FORM */}
            <form onSubmit={handleProcessPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#64748b] mb-1.5">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hamza Magsi"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8f6ff] border border-[#e8e4f5] text-xs text-[#1f2430] outline-none focus:border-[#6c5ce7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#64748b] mb-1.5">
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f8f6ff] border border-[#e8e4f5] text-xs text-[#1f2430] outline-none focus:border-[#6c5ce7] font-mono tracking-wider"
                  />
                  <CreditCard size={16} className="absolute left-3.5 top-3 text-[#94a3b8]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#64748b] mb-1.5">
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
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#f8f6ff] border border-[#e8e4f5] text-xs text-[#1f2430] outline-none focus:border-[#6c5ce7] font-mono"
                    />
                    <Calendar size={14} className="absolute left-3 top-3 text-[#94a3b8]" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#64748b] mb-1.5">
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
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#f8f6ff] border border-[#e8e4f5] text-xs text-[#1f2430] outline-none focus:border-[#6c5ce7] font-mono"
                    />
                    <Key size={14} className="absolute left-3 top-3 text-[#94a3b8]" />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-900 font-bold text-sm hover:brightness-105 active:scale-[0.99] transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
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

            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-[#94a3b8]">
              <Shield size={13} className="text-[#10b981]" />
              <span>Encrypted with 256-bit TLS · Polar.sh Merchant Certified</span>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS CONFIRMATION */}
        {step === 'success' && (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center mx-auto shadow-xl shadow-[#16a34a]/20">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-2xl font-extrabold text-[#1f2430]">Payment Confirmed!</h3>
            <p className="text-xs sm:text-sm text-[#64748b] max-w-sm mx-auto">
              You are now an active <strong className="text-[#6c5ce7]">BudgetDaily Pro Member</strong>. All 10 premium features are immediately unlocked.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f8f6ff] border border-[#e8e4f5] text-xs font-mono text-[#64748b]">
              <Receipt size={13} />
              <span>Receipt sent to {user?.email || 'your email'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
