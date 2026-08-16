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
  CreditCard,
  CheckCircle2,
  Lock,
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
    period: '/ month',
    billing: 'Billed monthly · cancel anytime',
    badge: 'Most Popular',
    popular: true,
  },
  {
    id: 'half_yearly',
    name: '6 Months',
    price: '$5',
    period: 'for 6 mo',
    billing: 'Save $1 upfront · $0.83/mo',
    badge: 'Save $1',
    popular: false,
  },
  {
    id: 'yearly',
    name: '1 Year (Annual)',
    price: '$9',
    period: '/ year',
    billing: 'Save 25% · Only $0.75/month',
    badge: 'Best Value',
    popular: false,
  },
  {
    id: 'lifetime',
    name: 'Lifetime Access',
    price: '$100',
    period: 'one-time',
    billing: 'Pay once, own forever · No renewals',
    badge: 'VIP Lifetime',
    popular: false,
  },
]

export default function PremiumModal({ isOpen, onClose, highlightFeature = '' }) {
  const { isPro, subscription, upgradePlan } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState(false)

  if (!isOpen) return null

  const handleCheckout = () => {
    setLoading(true)
    setTimeout(() => {
      upgradePlan(selectedPlan)
      setLoading(false)
      setSuccessMessage(true)

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899'],
        })
      } catch (err) {
        // ignore if canvas not supported
      }

      setTimeout(() => {
        setSuccessMessage(false)
        onClose()
      }, 1600)
    }, 700)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-[var(--color-brand)]/40 shadow-2xl overflow-hidden">
        {/* Decorative ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--color-brand-glow)] rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[var(--color-text-dim)] hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-brand)]/15 border border-[var(--color-brand)]/30 text-[var(--color-brand)] text-xs font-semibold uppercase tracking-wider mb-2">
            <Crown size={14} />
            <span>BudgetDaily Pro</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Unlock All 10 Premium Superpowers
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-dim)] mt-1 max-w-md mx-auto">
            Supercharge your personal finance with unlimited logs, custom icons (like ☕ Tea / Chai), AI insights & detailed analytics for just $1/mo.
          </p>
        </div>

        {/* Success Alert */}
        {successMessage ? (
          <div className="py-12 text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-safe)]/20 text-[var(--color-safe)]">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-xl font-bold text-white">Welcome to BudgetDaily Pro!</h3>
            <p className="text-sm text-[var(--color-text-dim)]">All 10 premium features are now unlocked.</p>
          </div>
        ) : (
          <>
            {/* PRICING SELECTOR CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
              {PRICING_PLANS.map((plan) => {
                const isSelected = selectedPlan === plan.id
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
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
                    <span>No custom categories, limited to 5 logs/day, 3-day history only</span>
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
                  {PREMIUM_FEATURES.map((feat, idx) => {
                    const isHighlighted = highlightFeature && feat.name.toLowerCase().includes(highlightFeature.toLowerCase())
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
                onClick={handleCheckout}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-[var(--color-ink)] font-bold text-sm hover:brightness-110 active:scale-[0.99] transition-all shadow-xl shadow-[var(--color-brand)]/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Activating Pro Access…</span>
                ) : (
                  <>
                    <Zap size={18} fill="currentColor" />
                    <span>
                      Get Pro for{' '}
                      {PRICING_PLANS.find((p) => p.id === selectedPlan)?.price} (
                      {PRICING_PLANS.find((p) => p.id === selectedPlan)?.name})
                    </span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-[var(--color-text-faint)]">
                <span className="flex items-center gap-1">
                  <Shield size={12} /> Instant unlock
                </span>
                <span>•</span>
                <span>Cancel anytime</span>
                <span>•</span>
                <span>100% money-back guarantee</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
