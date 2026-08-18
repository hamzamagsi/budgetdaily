import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Crown,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Calendar,
  Wallet,
  Check,
  Zap,
} from 'lucide-react'
import { FREE_FEATURES, PREMIUM_FEATURES, PRICING_PLANS } from '../components/PremiumModal'
import { useAuth } from '../context/AuthContext'
import { store } from '../lib/store'

export default function Landing() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      const hasBudget = store.getActiveBudget()
      navigate(hasBudget ? '/dashboard' : '/onboarding', { replace: true })
    }
  }, [user, loading])

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f0ff] selection:bg-[#6c5ce7] selection:text-white">
      {/* CLEAN MINIMAL PASTEL NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#e8e4f5]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#6c5ce7] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-[#6c5ce7]/20">
              ⚡
            </div>
            <span className="font-display font-extrabold text-lg tracking-tight text-[#1f2430]">
              BudgetDaily
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-xs font-bold text-[#64748b] hover:text-[#1f2430] px-3 py-2 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="px-5 py-2.5 rounded-2xl bg-[#6c5ce7] hover:bg-[#5849cf] text-white text-xs font-bold active:scale-95 transition-all shadow-md shadow-[#6c5ce7]/25 cursor-pointer flex items-center gap-1.5"
            >
              <span>Get Started Free</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 max-w-5xl mx-auto px-6 pt-12 sm:pt-16 pb-20 text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ede9fe] text-[#6c5ce7] text-xs font-bold uppercase tracking-wider mb-6 font-mono shadow-xs">
          <Sparkles size={14} />
          <span>One Honest Number Every Morning</span>
        </div>

        {/* Hero Headline */}
        <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-[#1f2430] max-w-3xl mx-auto leading-[1.12]">
          Spend what's actually safe today. <br className="hidden sm:inline" />
          <span className="text-[#6c5ce7]">
            No spreadsheets. Just peace of mind.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-sm sm:text-base text-[#64748b] max-w-xl mx-auto leading-relaxed">
          Set your total budget and date range. BudgetDaily calculates your exact safe daily allowance, and overspending today quietly adjusts future days automatically.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#6c5ce7] hover:bg-[#5849cf] text-white font-bold text-sm hover:shadow-xl shadow-lg shadow-[#6c5ce7]/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Start Free Now</span>
            <ArrowRight size={16} />
          </button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-[#f8f6ff] border border-[#e8e4f5] text-[#1f2430] font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Crown size={16} className="text-[#6c5ce7]" />
            <span>Pro Tier at $1.99/mo</span>
          </button>
        </div>

        <p className="mt-3 text-xs text-[#94a3b8]">
          Free 4-feature starter plan · Pro starting at $1.99/month · Cancel anytime
        </p>

        {/* HERO LIVE DASHBOARD PREVIEW CARD (FIGMA SCREEN 1) */}
        <div className="mt-14 max-w-2xl mx-auto space-y-4 text-left">
          {/* PURPLE HERO BALANCE CARD */}
          <div className="figma-hero-card p-6 sm:p-7 rounded-3xl relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-white/80">Default Account</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-mono font-bold">
                Live Preview
              </span>
            </div>

            <div className="my-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white">
                $2,323.56
              </span>
            </div>

            {/* Expense & Income Side-by-Side */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/15">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#ff6b6b]/25 flex items-center justify-center text-[#ffa8a8]">
                  <TrendingDown size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-white/70 font-medium">Expense</p>
                  <p className="text-sm font-bold font-mono text-white">$2,176.44</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#22c55e]/25 flex items-center justify-center text-[#86efac]">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-white/70 font-medium">Income</p>
                  <p className="text-sm font-bold font-mono text-white">$4,500.00</p>
                </div>
              </div>
            </div>
          </div>

          {/* MINT GREEN "LEFT TO SPEND" CARD */}
          <div className="figma-mint-card p-5 sm:p-6 shadow-sm">
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="text-xs sm:text-sm font-bold text-[#1f2430]">Left to Spend</h3>
              <span className="text-xs font-medium text-[#64748b]">
                <strong className="text-[#1f2430] font-mono">$2,323.56</strong> out of $4,500.00
              </span>
            </div>

            <div className="w-full h-3.5 rounded-full bg-[#dcfce7] p-0.5 mt-2 overflow-hidden relative flex items-center">
              <div
                className="h-full rounded-full bg-[#4ade80] transition-all duration-500 relative"
                style={{ width: '51%' }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#16a34a] rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* 3 CORE VALUE PROPS */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
          <div className="figma-card p-6 space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#ede9fe] text-[#6c5ce7] flex items-center justify-center text-lg shadow-xs">
              📅
            </div>
            <h3 className="text-sm font-bold text-[#1f2430]">Daily Allowance</h3>
            <p className="text-xs text-[#64748b] leading-relaxed">
              Never do mental math again. Know exactly what you can spend each morning.
            </p>
          </div>

          <div className="figma-card p-6 space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#ede9fe] text-[#6c5ce7] flex items-center justify-center text-lg shadow-xs">
              🧮
            </div>
            <h3 className="text-sm font-bold text-[#1f2430]">In-App Calculator</h3>
            <p className="text-xs text-[#64748b] leading-relaxed">
              Log expenses and incomes in 3 seconds flat with the built-in keypad.
            </p>
          </div>

          <div className="figma-card p-6 space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#ede9fe] text-[#6c5ce7] flex items-center justify-center text-lg shadow-xs">
              👛
            </div>
            <h3 className="text-sm font-bold text-[#1f2430]">Multi-Wallet Sync</h3>
            <p className="text-xs text-[#64748b] leading-relaxed">
              Track Cash, Checking Accounts, and Savings in one unified dashboard.
            </p>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-[#e8e4f5] py-8 text-center text-xs text-[#94a3b8]">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1f2430]">BudgetDaily</span>
            <span>· All rights reserved</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>256-bit Supabase & OAuth 2.0</span>
            <span>•</span>
            <span>Polar.sh Merchant Protected</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
