import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Compass,
  Zap,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Crown,
  ChevronRight,
  Layers,
} from 'lucide-react'
import { FREE_FEATURES, PREMIUM_FEATURES, PRICING_PLANS } from '../components/PremiumModal'
import { useAuth } from '../context/AuthContext'
import { store } from '../lib/store'

export default function Landing() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  // THE FIX: if a session already exists (e.g. we just landed here straight
  // off a Google OAuth redirect), skip the marketing page and continue
  // straight into the app instead of showing a logged-out header.
  useEffect(() => {
    if (!loading && user) {
      const hasBudget = store.getActiveBudget()
      navigate(hasBudget ? '/dashboard' : '/onboarding', { replace: true })
    }
  }, [user, loading])

  return (
    <div className="min-h-screen flex flex-col selection:bg-amber-400 selection:text-black">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#07090e]/80 backdrop-blur-xl border-b border-[var(--color-line-subtle)]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-[var(--color-ink)] font-bold text-sm shadow-md shadow-amber-500/20">
              ⚡
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-white">
              BudgetDaily
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-xs font-semibold text-[var(--color-text-dim)] hover:text-white transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-full bg-[var(--color-brand)] text-[var(--color-ink)] text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 max-w-4xl mx-auto px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/30 text-[var(--color-brand)] text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles size={14} />
          <span>One Honest Number Every Morning</span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-3xl mx-auto leading-[1.12]">
          Spend what's actually safe today. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-400 bg-clip-text text-transparent">
            No spreadsheets. Just peace of mind.
          </span>
        </h1>

        <p className="mt-6 text-sm sm:text-base text-[var(--color-text-dim)] max-w-xl mx-auto leading-relaxed">
          Set your total budget and date range. BudgetDaily calculates your exact safe daily allowance, and overspending today quietly adjusts future days automatically.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-[var(--color-ink)] font-bold text-sm hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Start Free Now</span>
            <ArrowRight size={16} />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#121927] hover:bg-[#182338] border border-[var(--color-line)] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Crown size={16} className="text-amber-400" />
            <span>Pro Tier at only $1/mo</span>
          </button>
        </div>

        <p className="mt-3 text-xs text-[var(--color-text-faint)]">
          Free 4-feature starter plan · Pro starting at $1/month · Cancel anytime
        </p>

        {/* HERO INTERACTIVE GAUGE PREVIEW CARD */}
        <div className="mt-14 glass-panel-elevated rounded-3xl p-8 border border-[var(--color-line)] max-w-lg mx-auto shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-dim)] mb-4 pb-3 border-b border-[var(--color-line-subtle)]">
            <span className="font-mono uppercase tracking-wider">Live Daily Dial Preview</span>
            <span className="text-[var(--color-safe)] font-semibold flex items-center gap-1">
              <CheckCircle2 size={13} /> 100% On Track
            </span>
          </div>

          <div className="py-4 flex flex-col items-center">
            {/* SVG Mini Preview */}
            <svg width="220" height="120" viewBox="0 0 220 120">
              <path
                d="M 25 110 A 85 85 0 0 1 195 110"
                fill="none"
                stroke="var(--color-line-subtle)"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <path
                d="M 25 110 A 85 85 0 0 1 195 110"
                fill="none"
                stroke="#10b981"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray="267"
                strokeDashoffset="60"
              />
            </svg>
            <div className="-mt-8 text-center">
              <span className="text-3xl font-bold font-mono text-white">$45.00</span>
              <p className="text-xs text-[var(--color-text-dim)] mt-0.5">safe to spend today</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[var(--color-line-subtle)] flex justify-around text-xs text-[var(--color-text-faint)] font-mono">
            <span>$15.00 spent</span>
            <span>·</span>
            <span>$60.00 allowance</span>
            <span>·</span>
            <span>22 days left</span>
          </div>
        </div>

        {/* 4 FREE VS 10 PRO FEATURES SHOWCASE */}
        <div className="mt-24 text-left max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Transparent, Honest Features
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-text-dim)] mt-1">
              Use 4 powerful free features forever, or upgrade to all 10 Pro superpowers for only $1/mo.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* 4 Free */}
            <div className="p-6 rounded-3xl bg-[#0e131f] border border-[var(--color-line)]">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-dim)] block mb-4">
                4 Free Forever Features
              </span>
              <ul className="space-y-3">
                {FREE_FEATURES.map((f) => (
                  <li key={f.id} className="flex items-start gap-2.5 text-xs text-[var(--color-text-dim)]">
                    <CheckCircle2 size={15} className="text-[var(--color-safe)] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-white">{f.name}</p>
                      <p className="text-[11px] text-[var(--color-text-faint)]">{f.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* 10 Pro */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#182338] to-[#0e131f] border border-[var(--color-brand)]/40 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand)] flex items-center gap-1.5">
                  <Crown size={14} /> 10 Pro Features
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--color-brand)] text-[var(--color-ink)]">
                  $1 / MO
                </span>
              </div>
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {PREMIUM_FEATURES.map((f) => (
                  <div key={f.id} className="flex items-start gap-2 text-xs">
                    <Sparkles size={13} className="text-[var(--color-brand)] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-white">{f.name}</p>
                      <p className="text-[11px] text-[var(--color-text-dim)]">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PRICING GRID */}
        <div className="mt-20">
          <h2 className="font-display text-2xl font-bold text-white mb-2">
            The World's Most Accessible Finance Tool
          </h2>
          <p className="text-xs text-[var(--color-text-dim)] mb-8">
            Starting at only $1/mo — less than a single cup of tea.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {PRICING_PLANS.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate('/login')}
                className="p-4 rounded-2xl bg-[#0e131f] border border-[var(--color-line)] hover:border-[var(--color-brand)] transition-all cursor-pointer text-left flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    {p.name}
                  </span>
                  <div className="flex items-baseline gap-1 my-1">
                    <span className="text-2xl font-bold font-mono text-white">{p.price}</span>
                    <span className="text-[10px] text-[var(--color-text-dim)]">{p.period}</span>
                  </div>
                </div>
                <p className="text-[10px] text-[var(--color-text-faint)]">{p.billing}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[var(--color-line-subtle)] py-8 px-6 text-center text-xs text-[var(--color-text-faint)]">
        <p>BudgetDaily — spend what's actually yours today.</p>
      </footer>
    </div>
  )
}
