import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Crown,
  ChevronRight,
  Layers,
  Calendar,
  Wallet,
  TrendingDown,
  TrendingUp,
  Receipt,
  Calculator,
  Shield,
  Zap,
} from 'lucide-react'
import { PRICING_PLANS, FREE_FEATURES, PREMIUM_FEATURES } from '../components/PremiumModal'
import { useAuth } from '../context/AuthContext'
import { store } from '../lib/store'
import { redirectToPolarCheckout } from '../lib/polar'

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
    <div className="min-h-screen flex flex-col bg-[#f3f0ff] selection:bg-[#ede9fe] selection:text-[#6c5ce7]">
      {/* MINIMAL PASTEL NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#e8e4f5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6c5ce7] to-[#a29bfe] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#6c5ce7]/20">
              ✦
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-base sm:text-lg tracking-tight text-[#1f2430]">
                BudgetDaily
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#ede9fe] text-[#6c5ce7] font-bold font-mono uppercase">
                Pro
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-3 py-1.5 text-xs font-bold text-[#64748b] hover:text-[#1f2430] transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-2xl bg-[#6c5ce7] hover:bg-[#5849cf] text-white text-xs font-bold active:scale-95 transition-all shadow-md shadow-[#6c5ce7]/20 cursor-pointer"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-8 pt-12 sm:pt-16 pb-20 text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ede9fe] text-[#6c5ce7] text-xs font-bold uppercase tracking-wider mb-6 font-mono shadow-xs">
          <Sparkles size={14} />
          <span>One Honest Number Every Morning</span>
        </div>

        {/* Big Bold Headline with High Contrast */}
        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1f2430] max-w-3xl mx-auto leading-[1.15]">
          Spend what's actually safe today. <br />
          <span className="bg-gradient-to-r from-[#6c5ce7] via-[#8b5cf6] to-[#ec4899] bg-clip-text text-transparent">
            No spreadsheets. Just peace of mind.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-sm sm:text-base text-[#64748b] max-w-xl mx-auto leading-relaxed">
          Set your total budget and date range. BudgetDaily calculates your exact safe daily allowance, and overspending today quietly adjusts future days automatically.
        </p>

        {/* Call to Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#6c5ce7] hover:bg-[#5849cf] text-white font-bold text-sm active:scale-95 transition-all shadow-xl shadow-[#6c5ce7]/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Start Free Now</span>
            <ArrowRight size={16} />
          </button>
          <a
            href="#pricing"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-[#f8f6ff] border border-[#e8e4f5] text-[#1f2430] font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Crown size={16} className="text-[#6c5ce7]" />
            <span>Pro starting at $1.99/mo</span>
          </a>
        </div>

        <p className="mt-3 text-xs text-[#94a3b8]">
          Free 4-feature starter plan · Pro starting at $1.99/month · Cancel anytime
        </p>

        {/* LIVE APP UI PREVIEW (MATCHING FIGMA SCREENS) */}
        <div className="mt-12 max-w-4xl mx-auto p-4 sm:p-6 rounded-3xl bg-white/60 border border-[#e8e4f5] shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start text-left">
            {/* LEFT: HERO BALANCE & LEFT TO SPEND */}
            <div className="md:col-span-5 space-y-4">
              {/* Hero Balance Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#6c5ce7] via-[#5849cf] to-[#4338ca] text-white shadow-lg shadow-[#6c5ce7]/20">
                <div className="flex items-center justify-between text-xs text-white/80 mb-2">
                  <span>👛 Default Wallet</span>
                  <span>August 2024</span>
                </div>
                <div className="text-3xl font-extrabold font-mono tracking-tight text-white my-1">
                  $2,323.56
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-white/15 text-xs">
                  <div>
                    <span className="text-[10px] text-white/70 block">Expense</span>
                    <span className="font-bold font-mono text-[#ffa8a8]">$2,176.44</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/70 block">Income</span>
                    <span className="font-bold font-mono text-[#86efac]">$4,500.00</span>
                  </div>
                </div>
              </div>

              {/* Mint Green Left to Spend */}
              <div className="p-4 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-[#1f2430]">Left to Spend</span>
                  <span className="font-mono text-[#16a34a] font-bold">$2,323.56 / $4,500</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#dcfce7] overflow-hidden">
                  <div className="h-full rounded-full bg-[#22c55e]" style={{ width: '51%' }} />
                </div>
              </div>
            </div>

            {/* RIGHT: INTERACTIVE CALENDAR PREVIEW */}
            <div className="md:col-span-7 p-5 rounded-3xl bg-white border border-[#e8e4f5] shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#f1edf9]">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-[#6c5ce7]" />
                  <span className="text-xs font-bold text-[#1f2430]">August 2024 Calendar Spend</span>
                </div>
                <span className="text-[10px] font-bold text-[#6c5ce7] bg-[#ede9fe] px-2 py-0.5 rounded-full">
                  Live Matrix
                </span>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono py-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <span key={i} className="font-bold text-[#94a3b8]">{d}</span>
                ))}
                {[...Array(31)].map((_, i) => (
                  <div
                    key={i}
                    className={`p-1 rounded-lg ${
                      i + 1 === 10
                        ? 'border-2 border-[#6c5ce7] bg-[#ede9fe] font-bold text-[#6c5ce7]'
                        : 'text-[#64748b] bg-[#f8f6ff]'
                    }`}
                  >
                    <span>{i + 1}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#6c5ce7] text-white text-xs">
                <span>Selected: Sat 10 Aug</span>
                <span className="font-mono font-bold">Expense: $73.38</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 FEATURE PILLARS */}
        <section className="mt-20 text-left">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1f2430]">
              Built for Humans, Not Accountants
            </h2>
            <p className="text-xs sm:text-sm text-[#64748b] mt-1.5">
              Everything you need to master your money in 30 seconds a day.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="figma-card p-5 space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#ede9fe] text-[#6c5ce7] flex items-center justify-center text-lg">
                ⚡
              </div>
              <h3 className="text-sm font-bold text-[#1f2430]">Daily Allowance</h3>
              <p className="text-xs text-[#64748b] leading-relaxed">
                One number every morning telling you exactly how much you can safely spend today.
              </p>
            </div>

            <div className="figma-card p-5 space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#ede9fe] text-[#6c5ce7] flex items-center justify-center text-lg">
                🔢
              </div>
              <h3 className="text-sm font-bold text-[#1f2430]">In-App Calculator</h3>
              <p className="text-xs text-[#64748b] leading-relaxed">
                Calculate split bills, tax, and tips on the fly directly inside the expense logger.
              </p>
            </div>

            <div className="figma-card p-5 space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#ede9fe] text-[#6c5ce7] flex items-center justify-center text-lg">
                📅
              </div>
              <h3 className="text-sm font-bold text-[#1f2430]">Calendar Matrix</h3>
              <p className="text-xs text-[#64748b] leading-relaxed">
                Track past transactions and upcoming bills day-by-day in an interactive monthly grid.
              </p>
            </div>

            <div className="figma-card p-5 space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#ede9fe] text-[#6c5ce7] flex items-center justify-center text-lg">
                👛
              </div>
              <h3 className="text-sm font-bold text-[#1f2430]">Multi-Wallets</h3>
              <p className="text-xs text-[#64748b] leading-relaxed">
                Seamlessly toggle between Cash, Chase Checking, High-Yield Savings, and Custom Icons.
              </p>
            </div>
          </div>
        </section>

        {/* PRICING PLANS SECTION */}
        <section id="pricing" className="mt-24 pt-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ede9fe] text-[#6c5ce7] text-xs font-bold uppercase tracking-wider mb-2 font-mono">
              <Crown size={14} />
              <span>Official Polar.sh Checkout</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#1f2430]">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xs sm:text-sm text-[#64748b] mt-1">
              Start free forever, or upgrade to Pro for advanced superpowers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className="p-6 rounded-3xl bg-white border border-[#e8e4f5] shadow-lg flex flex-col justify-between hover:border-[#6c5ce7] transition-all"
              >
                <div>
                  {plan.badge && (
                    <span className="text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#ede9fe] text-[#6c5ce7] inline-block mb-3">
                      {plan.badge}
                    </span>
                  )}
                  <h3 className="text-base font-bold text-[#1f2430]">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 my-2">
                    <span className="text-3xl font-extrabold font-mono text-[#6c5ce7]">
                      {plan.price}
                    </span>
                    <span className="text-xs text-[#64748b]">{plan.period}</span>
                  </div>
                  <p className="text-xs text-[#64748b] leading-relaxed">{plan.billing}</p>
                </div>

                <div className="pt-6 mt-4 border-t border-[#f1edf9]">
                  <button
                    onClick={() => redirectToPolarCheckout({ planId: plan.id })}
                    className="w-full py-3 rounded-2xl bg-[#6c5ce7] hover:bg-[#5849cf] text-white text-xs font-bold shadow-md shadow-[#6c5ce7]/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Zap size={14} fill="currentColor" />
                    <span>Get {plan.name}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-8 bg-white border-t border-[#e8e4f5] text-center text-xs text-[#94a3b8]">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1f2430]">BudgetDaily</span>
            <span>·</span>
            <span>Real Financial Clarity</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Powered by Polar.sh</span>
            <span>•</span>
            <span>Supabase 256-bit Encrypted</span>
            <span>•</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
