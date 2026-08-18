import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PRICING_PLANS, FREE_FEATURES, PREMIUM_FEATURES } from '../components/PremiumModal'
import { redirectToPolarCheckout } from '../lib/polar'
import {
  Crown,
  Check,
  Zap,
  Shield,
  ArrowLeft,
  Sparkles,
  Loader2,
  ExternalLink,
} from 'lucide-react'

export default function Subscribe() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const [loading, setLoading] = useState(false)

  const currentPlan = PRICING_PLANS.find((p) => p.id === selectedPlan) || PRICING_PLANS[0]

  const handleSubscribe = async () => {
    setLoading(true)
    await redirectToPolarCheckout({
      planId: selectedPlan,
      email: user?.email,
      userId: user?.id,
    })
  }

  return (
    <div className="min-h-screen px-4 py-10 max-w-5xl mx-auto flex flex-col justify-center bg-[#f3f0ff]">
      {/* Top Back Nav */}
      <div className="flex items-center justify-between mb-8">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-xs font-bold text-[#6c5ce7] hover:opacity-80 transition-opacity cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#6c5ce7]">
          <Crown size={14} />
          <span>BudgetDaily Pro · Polar.sh</span>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ede9fe] text-[#6c5ce7] text-xs font-bold uppercase tracking-wider mb-3 font-mono">
          <Sparkles size={14} />
          <span>Polar.sh Gateway Integration</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1f2430]">
          Invest in Your Financial Peace of Mind
        </h1>
        <p className="text-sm text-[#64748b] mt-2 max-w-md mx-auto">
          Start for just $1/month via Polar.sh. Never worry about overspending your budget again.
        </p>
      </div>

      <div className="space-y-8">
        {/* PRICING PLANS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRICING_PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative p-5 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#ede9fe] border-2 border-[#6c5ce7] shadow-xl shadow-[#6c5ce7]/15 scale-[1.03]'
                    : 'bg-white border-[#e8e4f5] hover:border-slate-300'
                }`}
              >
                {plan.badge && (
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mb-3 self-start ${
                      isSelected
                        ? 'bg-[#6c5ce7] text-white'
                        : 'bg-[#e2e8f0] text-[#64748b]'
                    }`}
                  >
                    {plan.badge}
                  </span>
                )}
                <div>
                  <h3 className="text-sm font-bold text-[#1f2430]">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 my-2">
                    <span className={`text-3xl font-extrabold font-mono ${isSelected ? 'text-[#6c5ce7]' : 'text-[#1f2430]'}`}>
                      {plan.price}
                    </span>
                    <span className="text-xs text-[#64748b]">{plan.period}</span>
                  </div>
                  <p className="text-xs text-[#64748b] leading-relaxed">
                    {plan.billing}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-[#f1edf9]">
                  <button
                    type="button"
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#6c5ce7] text-white'
                        : 'bg-[#f8f6ff] text-[#64748b] hover:text-[#1f2430]'
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
        <div className="figma-card p-6 sm:p-8">
          <h3 className="font-display text-lg font-bold text-[#1f2430] mb-4 text-center sm:text-left">
            4 Free Features vs 10 Pro Superpowers
          </h3>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Free features */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#e8e4f5]">
                <span className="text-xs font-bold uppercase text-[#64748b]">
                  Free Starter Plan ($0)
                </span>
              </div>
              {FREE_FEATURES.map((feat) => (
                <div key={feat.id} className="flex items-start gap-2.5 text-xs text-[#334155]">
                  <Check size={15} className="text-[#10b981] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-[#1f2430]">{feat.name}</p>
                    <p className="text-[11px] text-[#64748b]">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 10 Pro Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#bbf7d0]">
                <Crown size={14} className="text-[#16a34a]" />
                <span className="text-xs font-bold uppercase text-[#16a34a]">
                  Pro Member (All 10 Superpowers)
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {PREMIUM_FEATURES.map((feat) => (
                  <div key={feat.id} className="flex items-start gap-2.5 text-xs">
                    <div className="w-4 h-4 rounded-full bg-[#dcfce7] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={11} className="text-[#16a34a]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#1f2430]">{feat.name}</p>
                      <p className="text-[11px] text-[#64748b]">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* REAL POLAR CHECKOUT BUTTON */}
          <div className="mt-8 pt-6 border-t border-[#e8e4f5] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-[#64748b]">
              <Shield size={16} className="text-[#10b981] shrink-0" />
              <span>Powered by Polar.sh. Official PCI-compliant checkout.</span>
            </div>

            <button
              type="button"
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-900 font-bold text-sm hover:brightness-105 active:scale-95 shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span>Connecting to Polar.sh…</span>
                </span>
              ) : (
                <>
                  <Zap size={16} fill="currentColor" />
                  <span>
                    Pay {currentPlan.price} with Polar.sh
                  </span>
                  <ExternalLink size={14} className="ml-1 opacity-80" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
