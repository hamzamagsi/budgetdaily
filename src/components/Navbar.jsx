import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { store } from '../lib/store'
import {
  Wallet,
  Calendar,
  Sparkles,
  LogOut,
  ChevronDown,
  User,
  Plus,
  Shield,
  Layers,
} from 'lucide-react'

export default function Navbar({ onOpenAddTransaction, onUpgradeClick }) {
  const { user, isPro, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  const accounts = store.getAccounts()
  const activeAccount = store.getActiveAccount()
  const budget = store.getActiveBudget()

  const handleSelectAccount = (accId) => {
    store.setActiveAccountId(accId)
    setShowAccountDropdown(false)
    window.dispatchEvent(new Event('storage_change'))
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#ede9fe] px-4 sm:px-8 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* LOGO & BRAND */}
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-[#6c5ce7] text-white flex items-center justify-center shadow-md shadow-[#6c5ce7]/25 group-hover:scale-105 transition-transform">
              <span className="font-bold text-base">⚡</span>
            </div>
            <div>
              <span className="font-display font-extrabold text-base tracking-tight text-[#1f2430]">
                BudgetDaily
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ede9fe] text-[#6c5ce7] uppercase font-mono">
                {isPro ? 'PRO' : 'FREE'}
              </span>
            </div>
          </Link>
        </div>

        {/* CENTER: PERIOD BADGE */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#f8f6ff] border border-[#e8e4f5] text-xs font-medium text-[#64748b]">
          <Calendar size={14} className="text-[#6c5ce7]" />
          <span>{budget?.periodLabel || 'August · 01 Aug - 31 Aug'}</span>
        </div>

        {/* RIGHT: ACCOUNT SWITCHER, UPGRADE & PROFILE */}
        <div className="flex items-center gap-2.5">
          {/* Account Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#f8f6ff] hover:bg-[#ede9fe] border border-[#e8e4f5] text-xs font-bold text-[#1f2430] transition-colors cursor-pointer"
            >
              <span className="text-sm">{activeAccount.icon}</span>
              <span className="hidden sm:inline">{activeAccount.name}</span>
              <ChevronDown size={14} className="text-[#94a3b8]" />
            </button>

            {showAccountDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#e8e4f5] p-2 z-50 animate-in fade-in zoom-in-95">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] px-2 py-1">
                  Select Wallet / Account
                </p>
                {accounts.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleSelectAccount(acc.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                      acc.id === activeAccount.id
                        ? 'bg-[#ede9fe] text-[#6c5ce7] font-bold'
                        : 'text-[#334155] hover:bg-[#f8f6ff]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{acc.icon}</span>
                      <span>{acc.name}</span>
                    </span>
                    <span className="text-[11px] font-mono text-[#64748b]">${acc.balance.toFixed(0)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Upgrade Button */}
          {!isPro ? (
            <button
              type="button"
              onClick={() => onUpgradeClick?.()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-900 text-xs font-bold shadow-md shadow-amber-500/20 hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles size={13} />
              <span>Upgrade ($1)</span>
            </button>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#ede9fe] text-[#6c5ce7] text-[11px] font-bold font-mono">
              👑 Pro Member
            </span>
          )}

          {/* User Profile / Logout */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="w-9 h-9 rounded-2xl bg-[#ede9fe] text-[#6c5ce7] font-bold flex items-center justify-center text-xs hover:ring-2 hover:ring-[#6c5ce7]/30 transition-all cursor-pointer"
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#e8e4f5] p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="p-2 border-b border-[#f1edf9] mb-1">
                  <p className="text-xs font-bold text-[#1f2430] truncate">{user?.name || 'User'}</p>
                  <p className="text-[11px] text-[#64748b] truncate">{user?.email || 'user@budgetdaily.app'}</p>
                </div>

                <Link
                  to="/settings"
                  onClick={() => setShowUserDropdown(false)}
                  className="flex items-center gap-2 p-2 rounded-xl text-xs font-medium text-[#334155] hover:bg-[#f8f6ff] transition-colors"
                >
                  <Layers size={14} />
                  <span>Settings & Preferences</span>
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer mt-1"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
