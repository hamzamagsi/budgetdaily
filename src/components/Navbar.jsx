import { useAuth } from '../context/AuthContext'
import { format } from 'date-fns'
import { Crown, Sparkles, LogOut, ShieldCheck, Flame, User } from 'lucide-react'

export default function Navbar({ onOpenPremium, onSignOut }) {
  const { user, isPro, subscription } = useAuth()

  return (
    <header className="sticky top-0 z-40 bg-[#07090e]/80 backdrop-blur-xl border-b border-[var(--color-line-subtle)] px-4 sm:px-6 py-3.5 max-w-4xl mx-auto w-full transition-all">
      <div className="flex items-center justify-between">
        {/* Brand Logo & Date */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-[var(--color-ink)] font-bold text-sm shadow-md shadow-amber-500/20">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-base tracking-tight text-white">
                BudgetDaily
              </span>
              {isPro ? (
                <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-[var(--color-ink)] font-bold flex items-center gap-1 shadow-sm">
                  <Crown size={10} /> PRO
                </span>
              ) : (
                <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1e293b] text-[var(--color-text-dim)] border border-[var(--color-line)] font-medium">
                  FREE
                </span>
              )}
            </div>
            <p className="text-[11px] text-[var(--color-text-faint)] font-mono">
              {format(new Date(), 'EEEE, MMM d')}
            </p>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {!isPro ? (
            <button
              type="button"
              onClick={() => onOpenPremium('Pro Upgrade')}
              className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-[var(--color-ink)] font-bold text-xs hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Sparkles size={13} />
              <span>Upgrade ($1)</span>
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1 text-xs text-[var(--color-brand)] font-medium px-2.5 py-1 rounded-full bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/20">
              <Crown size={12} />
              <span className="capitalize">{subscription?.plan || 'Pro'} Active</span>
            </div>
          )}

          {/* User Avatar / Profile info */}
          <div className="flex items-center gap-2 pl-2 border-l border-[var(--color-line)]">
            <div className="w-8 h-8 rounded-full bg-[#182338] border border-[var(--color-line)] flex items-center justify-center text-xs text-[var(--color-text-dim)]" title={user?.email || user?.phone}>
              {user?.name ? user.name.slice(0, 1).toUpperCase() : <User size={14} />}
            </div>
            <button
              type="button"
              onClick={onSignOut}
              className="p-1.5 rounded-lg text-[var(--color-text-faint)] hover:text-[var(--color-over)] hover:bg-[var(--color-over)]/10 transition-colors cursor-pointer"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
