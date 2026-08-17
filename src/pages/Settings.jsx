import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
} from 'lucide-react'

export default function Settings() {
  const { user, isPro, signOut } = useAuth()
  const navigate = useNavigate()

  const [accounts, setAccounts] = useState(store.getAccounts())
  const [activeAccount, setActiveAccount] = useState(store.getActiveAccount())
  const [recurringBills, setRecurringBills] = useState(store.getRecurringBills())
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
    <div className="min-h-screen pb-28 sm:pb-12 bg-[#f3f0ff]">
      <Navbar
        onOpenAddTransaction={() => setIsAddModalOpen(true)}
        onUpgradeClick={() => setIsPremiumModalOpen(true)}
      />

      <main className="max-w-xl mx-auto px-4 pt-4 sm:pt-6 space-y-4">
        {/* USER PROFILE CARD */}
        <div className="figma-card p-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#ede9fe] text-[#6c5ce7] font-bold text-lg flex items-center justify-center shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User size={20} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#1f2430]">{user?.name || 'Hamza Magsi'}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#16a34a] font-bold font-mono">
                  Verified
                </span>
              </div>
              <p className="text-xs text-[#64748b]">{user?.email || 'user@budgetdaily.app'}</p>
            </div>
          </div>
        </div>

        {/* POLAR PRO SUBSCRIPTION CARD */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#6c5ce7] to-[#5849cf] text-white shadow-lg shadow-[#6c5ce7]/25 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown size={20} className="text-amber-300" />
              <span className="text-sm font-bold">
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

        {/* WALLETS & ACCOUNTS LIST */}
        <div className="figma-card p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#f1edf9]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
              Connected Wallets & Accounts
            </h4>
            <span className="text-xs text-[#6c5ce7] font-semibold">4 Active</span>
          </div>

          <div className="space-y-2">
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
                  className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-[#ede9fe] border-[#ddd6fe]'
                      : 'bg-[#f8f6ff] border-[#e8e4f5] hover:bg-[#f1edf9]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{acc.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-[#1f2430]">{acc.name}</p>
                      <p className="text-[10px] text-[#64748b]">
                        {isCurrent ? 'Active account' : 'Tap to switch'}
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

        {/* EXPORT DATA & PREFERENCES */}
        <div className="figma-card p-5 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">Data & Reports</h4>

          <button
            type="button"
            onClick={handleExportCSV}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#f8f6ff] hover:bg-[#ede9fe] border border-[#e8e4f5] text-xs font-semibold text-[#1f2430] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Download size={16} className="text-[#6c5ce7]" />
              <span>Export Financial Statement (CSV)</span>
            </div>
            {!isPro && (
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                PRO
              </span>
            )}
          </button>
        </div>

        {/* SIGN OUT */}
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full py-3.5 rounded-2xl bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
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
