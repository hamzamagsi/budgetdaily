import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { store } from '../lib/store'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import AddTransactionModal from '../components/AddTransactionModal'
import CustomCategoryModal from '../components/CustomCategoryModal'
import PremiumModal from '../components/PremiumModal'
import FeedbackModal from '../components/FeedbackModal'
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
  Plus,
  ExternalLink,
  MessageSquare,
  FileText,
} from 'lucide-react'

export default function Settings() {
  const { user, isPro, signOut } = useAuth()
  const navigate = useNavigate()

  const [accounts, setAccounts] = useState(store.getAccounts())
  const [activeAccount, setActiveAccount] = useState(store.getActiveAccount())
  const [categories, setCategories] = useState(store.getCategories())
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isCustomCatOpen, setIsCustomCatOpen] = useState(false)
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

  const refreshData = () => {
    setAccounts(store.getAccounts())
    setActiveAccount(store.getActiveAccount())
    setCategories(store.getCategories())
  }

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

      {/* FULL-WIDTH RESPONSIVE CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center justify-between pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#e8e4f5] flex items-center justify-center text-[#6c5ce7] shadow-xs">
              <Layers size={18} />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-[#1f2430]">
                Settings & Wallets
              </h1>
              <p className="text-xs text-[#64748b] font-medium">Manage multi-accounts, categories & subscription</p>
            </div>
          </div>
        </div>

        {/* 2-COLUMN GRID ON DESKTOP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* LEFT COLUMN: PROFILE & SUBSCRIPTION */}
          <div className="space-y-5">
            {/* USER PROFILE CARD */}
            <div className="figma-card p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#ede9fe] text-[#6c5ce7] font-bold text-xl flex items-center justify-center shadow-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User size={24} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#1f2430]">{user?.name || 'Hamza Magsi'}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#16a34a] font-bold font-mono">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-[#64748b]">{user?.email || 'user@budgetdaily.app'}</p>
                </div>
              </div>
            </div>

            {/* POLAR PRO SUBSCRIPTION CARD */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#6c5ce7] to-[#5849cf] text-white shadow-xl shadow-[#6c5ce7]/25 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown size={22} className="text-amber-300" />
                  <span className="text-base font-bold">
                    {isPro ? 'BudgetDaily Pro Active' : 'BudgetDaily Free Plan'}
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/20 text-white font-mono">
                  {isPro ? 'Pro Member' : '4 Free Features'}
                </span>
              </div>

              <p className="text-xs text-white/80 leading-relaxed">
                {isPro
                  ? 'All 10 premium superpowers unlocked including unlimited logs, custom icons, and AI analytics.'
                  : 'Upgrade to Pro starting at $1.99/mo via Polar.sh to unlock unlimited daily transactions, custom icons, and CSV exports.'}
              </p>

              {!isPro ? (
                <button
                  type="button"
                  onClick={() => setIsPremiumModalOpen(true)}
                  className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles size={16} />
                  <span>Get Pro (Starting at $1.99)</span>
                </button>
              ) : (
                <div className="space-y-2 pt-2 border-t border-white/20">
                  <div className="flex items-center gap-2 text-xs text-emerald-200">
                    <CheckCircle2 size={16} />
                    <span>Polar.sh subscription active & verified</span>
                  </div>
                  <a
                    href="https://polar.sh/purchases"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-white/90 underline hover:text-white font-medium"
                  >
                    <span>Manage / Cancel Subscription on Polar</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>

            {/* EXPORT DATA & REPORTS */}
            <div className="figma-card p-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">Data & Reports</h4>

              <button
                type="button"
                onClick={handleExportCSV}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#f8f6ff] hover:bg-[#ede9fe] border border-[#e8e4f5] text-xs font-semibold text-[#1f2430] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Download size={16} className="text-[#6c5ce7]" />
                  <span>Export Financial Statement (CSV)</span>
                </div>
                {!isPro && (
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold font-mono">
                    PRO
                  </span>
                )}
              </button>
            </div>

            {/* HELP, FEEDBACK & LEGAL */}
            <div className="figma-card p-6 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">Support & Legal</h4>

              <button
                type="button"
                onClick={() => setIsFeedbackOpen(true)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#f8f6ff] hover:bg-[#ede9fe] text-xs font-medium text-[#1f2430] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-[#6c5ce7]" />
                  <span>Contact Support & Report Bug</span>
                </div>
                <ChevronRight size={14} className="text-[#94a3b8]" />
              </button>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#f1edf9]">
                <Link
                  to="/privacy"
                  className="flex items-center gap-1.5 p-2 rounded-xl text-xs text-[#64748b] hover:text-[#1f2430] hover:bg-[#f8f6ff]"
                >
                  <Shield size={14} className="text-[#6c5ce7]" />
                  <span>Privacy Policy</span>
                </Link>
                <Link
                  to="/terms"
                  className="flex items-center gap-1.5 p-2 rounded-xl text-xs text-[#64748b] hover:text-[#1f2430] hover:bg-[#f8f6ff]"
                >
                  <FileText size={14} className="text-[#6c5ce7]" />
                  <span>Terms of Service</span>
                </Link>
              </div>
            </div>

            {/* SIGN OUT BUTTON */}
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full py-3.5 rounded-2xl bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <LogOut size={16} />
              <span>Sign Out of BudgetDaily</span>
            </button>
          </div>

          {/* RIGHT COLUMN: WALLETS & CUSTOM CATEGORY MAKER */}
          <div className="space-y-5">
            {/* WALLETS & ACCOUNTS LIST */}
            <div className="figma-card p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#f1edf9]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
                  Connected Wallets & Accounts
                </h4>
                <span className="text-xs text-[#6c5ce7] font-semibold">{accounts.length} Active</span>
              </div>

              <div className="space-y-2.5">
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
                      className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-[#ede9fe] border-[#ddd6fe] shadow-xs'
                          : 'bg-[#f8f6ff] border-[#e8e4f5] hover:bg-[#f1edf9]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{acc.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-[#1f2430]">{acc.name}</p>
                          <p className="text-[10px] text-[#64748b]">
                            {isCurrent ? 'Active wallet' : 'Tap to select'}
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

            {/* CUSTOM CATEGORIES LIST (FIGMA SCREEN 3) */}
            <div className="figma-card p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#f1edf9]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
                  Categories & Custom Icons
                </h4>
                <button
                  type="button"
                  onClick={() => setIsCustomCatOpen(true)}
                  className="flex items-center gap-1 text-xs font-bold text-[#6c5ce7] hover:underline cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Create Category</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {categories.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-2 p-2 rounded-xl bg-[#f8f6ff] text-xs font-medium text-[#1f2430]"
                  >
                    <span>{c.icon}</span>
                    <span className="truncate">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav onOpenAddTransaction={() => setIsAddModalOpen(true)} />

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <CustomCategoryModal
        isOpen={isCustomCatOpen}
        onClose={() => setIsCustomCatOpen(false)}
        onCreated={refreshData}
      />

      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </div>
  )
}
