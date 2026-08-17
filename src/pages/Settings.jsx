import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { store } from '../lib/store'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import AddTransactionModal from '../components/AddTransactionModal'
import PremiumModal from '../components/PremiumModal'
import {
  User,
  Wallet,
  Crown,
  Shield,
  Download,
  LogOut,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Receipt,
  Layers,
  Tag,
  CreditCard,
} from 'lucide-react'

export default function Settings() {
  const { user, isPro, signOut } = useAuth()
  const navigate = useNavigate()

  const [accounts, setAccounts] = useState(store.getAccounts())
  const [activeAccount, setActiveAccount] = useState(store.getActiveAccount())
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const handleExportCSV = () => {
    if (!isPro) {
      setIsPremiumModalOpen(true)
      return
    }
    const txs = store.getTransactions()
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Account', 'Note']
    const rows = txs.map((t) => [
      new Date(t.date).toLocaleString(),
      t.type,
      t.categoryId,
      t.amount,
      t.accountId || 'default',
      `"${t.note || ''}"`,
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `budgetdaily_export_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen pb-28 lg:pb-12 bg-[#f3f0ff]">
      <Navbar
        onOpenAddTransaction={() => setIsAddModalOpen(true)}
        onUpgradeClick={() => setIsPremiumModalOpen(true)}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1f2430]">Account & Settings</h1>
            <p className="text-xs text-[#64748b]">Manage your profile, wallets, subscriptions, and export data</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* USER PROFILE CARD */}
          <div className="figma-card p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#ede9fe] text-[#6c5ce7] font-bold text-xl flex items-center justify-center shadow-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : <User size={24} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#1f2430]">{user?.name || 'User'}</h3>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#dcfce7] text-[#16a34a] font-bold font-mono">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-[#64748b] mt-0.5">{user?.email || 'user@budgetdaily.app'}</p>
              </div>
            </div>
          </div>

          {/* POLAR PRO SUBSCRIPTION CARD */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#6c5ce7] to-[#5849cf] text-white shadow-lg shadow-[#6c5ce7]/25 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Crown size={22} className="text-amber-300" />
                  <span className="text-base font-bold">
                    {isPro ? 'BudgetDaily Pro Active' : 'BudgetDaily Free Plan'}
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/20 text-white">
                  {isPro ? 'Pro Member' : '4 Free Features'}
                </span>
              </div>

              <p className="text-xs text-white/80">
                {isPro
                  ? 'All 10 premium superpowers unlocked including unlimited logs, custom icons, and AI analytics.'
                  : 'Upgrade to Pro for $1/mo via Polar.sh to unlock unlimited daily transactions, custom icons, and PDF exports.'}
              </p>
            </div>

            {!isPro ? (
              <button
                type="button"
                onClick={() => setIsPremiumModalOpen(true)}
                className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles size={14} />
                <span>Get Pro ($1 / month)</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-emerald-200">
                <CheckCircle2 size={15} />
                <span>Polar.sh subscription active & verified</span>
              </div>
            )}
          </div>
        </div>

        {/* WALLETS & ACCOUNTS LIST */}
        <div className="figma-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f1edf9]">
            <div>
              <h4 className="text-sm font-bold text-[#1f2430]">Connected Wallets & Accounts</h4>
              <p className="text-xs text-[#64748b]">Select your active spending wallet</p>
            </div>
            <span className="text-xs text-[#6c5ce7] font-semibold">{accounts.length} Active</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {accounts.map((acc) => {
              const isCurrent = acc.id === activeAccount.id
              return (
                <div
                  key={acc.id}
                  onClick={() => {
                    store.setActiveAccountId(acc.id)
                    setActiveAccount(acc)
                    window.dispatchEvent(new Event('storage_change'))
                  }}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-[#ede9fe] border-[#ddd6fe]'
                      : 'bg-[#f8f6ff] border-[#e8e4f5] hover:bg-[#f1edf9]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{acc.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-[#1f2430]">{acc.name}</p>
                      <p className="text-[10px] text-[#64748b]">
                        {isCurrent ? 'Active wallet' : 'Click to switch'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold font-mono text-[#1f2430]">
                    ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* DATA EXPORT & ACTIONS */}
        <div className="figma-card p-6 space-y-4">
          <h4 className="text-sm font-bold text-[#1f2430]">Data & Reports</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center justify-between p-4 rounded-2xl bg-[#f8f6ff] hover:bg-[#ede9fe] border border-[#e8e4f5] text-xs font-bold text-[#1f2430] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Download size={18} className="text-[#6c5ce7]" />
                <span>Export Financial Statement (CSV)</span>
              </div>
              {!isPro && (
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                  PRO
                </span>
              )}
            </button>

            <Link
              to="/categories"
              className="flex items-center justify-between p-4 rounded-2xl bg-[#f8f6ff] hover:bg-[#ede9fe] border border-[#e8e4f5] text-xs font-bold text-[#1f2430] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Tag size={18} className="text-[#6c5ce7]" />
                <span>Manage Categories & Icons</span>
              </div>
              <ChevronRight size={16} className="text-[#94a3b8]" />
            </Link>
          </div>
        </div>

        {/* SIGN OUT */}
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full py-4 rounded-2xl bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
        >
          <LogOut size={16} />
          <span>Sign Out of BudgetDaily</span>
        </button>
      </main>

      <BottomNav onOpenAddTransaction={() => setIsAddModalOpen(true)} />

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />
    </div>
  )
}
