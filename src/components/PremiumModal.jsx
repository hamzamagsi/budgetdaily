import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { redirectToPolarCheckout, POLAR_PLANS } from '../lib/polar'
import {
  Crown,
  Check,
  X,
  Sparkles,
  Zap,
  Shield,
  Loader2,
  ExternalLink,
} from 'lucide-react'

export const FREE_FEATURES = [
  { id: '1', name: 'Daily Allowance Engine', desc: 'Automatic calculation based on total days' },
  { id: '2', name: 'Basic Spend Logging', desc: 'Up to 5 transactions per day' },
  { id: '3', name: 'Calendar Date Matrix', desc: 'Review day-by-day past transactions' },
  { id: '4', name: '3-Day Spending History', desc: 'Basic recent purchase history' },
]

export const PREMIUM_FEATURES = [
  { id: 'p1', name: 'Unlimited Daily Spend Logging', desc: 'No limits — log every expense and bill without restriction' },
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
    price: '$1.99',
    priceNum: 1.99,
    period: '/ month',
    billing: 'Billed monthly · cancel anytime',
    badge: 'Most Popular',
    popular: true,
  },
  {
    id: 'half_yearly',
    name: '6 Months',
    price: '$9.99',
    priceNum: 9.99,
    period: 'for 6 mo',
    billing: 'Save upfront · $1.66/mo',
    badge: 'Save 15%',
    popular: false,
  },
  {
    id: 'yearly',
    name: '1 Year (Annual)',
    price: '$19.99',
    priceNum: 19.99,
    period: '/ year',
    billing: 'Save 25% · Only $1.66/month',
    badge: 'Best Value',
    popular: false,
  },
]

export default function PremiumModal({
  isOpen,
  onClose,
  highlightFeature,
}) {
  const { user, isPro } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handlePolarCheckout = () => {
    setLoading(true)
    redirectToPolarCheckout({ planId: selectedPlan, email: user?.email })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#e8e4f5] my-8 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#f8f6ff] hover:bg-[#ede9fe] text-[#64748b] hover:text-[#1f2430] transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#ede9fe] text-[#6c5ce7] mb-1 shadow-md shadow-[#6c5ce7]/15">
            <Crown size={24} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1f2430]">
            Unlock BudgetDaily Pro
          </h2>
          <p className="text-xs sm:text-sm text-[#64748b] max-w-md mx-auto">
            Supercharge your daily financial discipline with unlimited logging, custom icons, and AI analytics.
          </p>
        </div>

        {/* 3 PRICING TIERS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {PRICING_PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#6c5ce7] bg-[#ede9fe]/30 shadow-md shadow-[#6c5ce7]/10'
                    : 'border-[#e8e4f5] bg-white hover:border-[#ddd6fe]'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-2.5 right-3 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#6c5ce7] text-white font-mono">
                    {plan.badge}
                  </span>
                )}

                <div>
                  <h4 className="text-xs font-bold text-[#1f2430]">{plan.name}</h4>
                  <div className="flex items-baseline gap-1 my-1.5">
                    <span className="text-2xl font-extrabold font-mono text-[#6c5ce7]">
                      {plan.price}
                    </span>
                    <span className="text-[10px] text-[#64748b]">{plan.period}</span>
                  </div>
                  <p className="text-[10px] text-[#64748b] leading-tight">{plan.billing}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#f1edf9] flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-[#6c5ce7]">
                    {isSelected ? 'Selected' : 'Tap to select'}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-[#6c5ce7] text-white' : 'border border-[#cbd5e1]'
                    }`}
                  >
                    {isSelected && <Check size={10} />}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 10 SUPERPOWERS LIST */}
        <div className="rounded-2xl bg-[#f8f6ff] border border-[#e8e4f5] p-4 mb-6">
          <h4 className="text-xs font-bold text-[#1f2430] mb-3 flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#6c5ce7]" />
            <span>10 Premium Superpowers Included:</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {PREMIUM_FEATURES.map((feat) => (
              <div key={feat.id} className="flex items-start gap-2">
                <Check size={14} className="text-[#10b981] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1f2430] leading-tight">{feat.name}</p>
                  <p className="text-[10px] text-[#64748b]">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HOSTED CHECKOUT BUTTON */}
        <div className="space-y-3 text-center">
          <button
            type="button"
            onClick={handlePolarCheckout}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-[#6c5ce7] hover:bg-[#5849cf] text-white font-bold text-sm shadow-xl shadow-[#6c5ce7]/25 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <Zap size={18} fill="currentColor" />
                <span>Pay with Polar.sh Hosted Checkout</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-[#94a3b8] flex items-center justify-center gap-1">
            <Shield size={12} />
            <span>PCI-DSS Compliant 256-bit Encrypted Checkout via Polar.sh</span>
          </p>
        </div>
      </div>
    </div>
  )
}
