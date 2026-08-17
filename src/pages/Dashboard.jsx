import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { store } from '../lib/store'
import { getCategoryById } from '../lib/categories'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import AddTransactionModal from '../components/AddTransactionModal'
import PremiumModal from '../components/PremiumModal'
import {
  Calendar,
  Wallet,
  TrendingDown,
  TrendingUp,
  Receipt,
  ChevronRight,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Layers,
  Sparkles,
  Tag,
  CreditCard,
} from 'lucide-react'

export default function Dashboard() {
  const { user, isPro } = useAuth()
  const navigate = useNavigate()

  const [summary, setSummary] = useState({
    income: 4500,
    expense: 2176.44,
    balance: 2323.56,
    leftToSpend: 2323.56,
    budgetTotal: 4500,
  })
  const [transactions, setTransactions] = useState([])
  const [categoryBudgets, setCategoryBudgets] = useState({})
  const [activeAccount, setActiveAccount] = useState(store.getActiveAccount())
  const [accounts, setAccounts] = useState(store.getAccounts())

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false)
  const [highlightFeature, setHighlightFeature] = useState('')
  const [showUpcoming, setShowUpcoming] = useState(true)

  const refreshData = () => {
    setSummary(store.getFinancialSummary())
    setTransactions(store.getTransactions())
    setCategoryBudgets(store.getCategoryBudgets())
    setActiveAccount(store.getActiveAccount())
    setAccounts(store.getAccounts())
  }

  useEffect(() => {
    refreshData()
    const handleStorageChange = () => refreshData()
    window.addEventListener('storage_change', handleStorageChange)
    return () => window.removeEventListener('storage_change', handleStorageChange)
  }, [])

  const categories = store.getCategories()
  const recurringBills = store.getRecurringBills()

  // Calculate spending per category
  const categorySpending = {}
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categorySpending[t.categoryId] = (categorySpending[t.categoryId] || 0) + Number(t.amount || 0)
    })

  const spendRatio = Math.min(100, Math.max(0, (summary.leftToSpend / (summary.budgetTotal || 1)) * 100))

  return (
    <div className="min-h-screen pb-28 lg:pb-12 bg-[#f3f0ff]">
      {/* TOP NAVBAR */}
      <Navbar
        onOpenAddTransaction={() => setIsAddModalOpen(true)}
        onUpgradeClick={(feat) => {
          setHighlightFeature(feat || '')
          setIsPremiumModalOpen(true)
        }}
      />

      {/* FULL-WIDTH DESKTOP CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* MAIN COLUMN (LEFT 8 COLS ON DESKTOP) */}
          <div className="lg:col-span-8 space-y-5">
            {/* TOP DATE & WALLET BAR */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white border border-[#e8e4f5] flex items-center justify-center text-[#6c5ce7] shadow-xs">
                  <Calendar size={18} />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-[#1f2430]">August 2024</h2>
                  <p className="text-xs text-[#64748b] font-medium">01 Aug 24 - 31 Aug 24</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/calendar"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white hover:bg-[#ede9fe] border border-[#e8e4f5] text-xs font-bold text-[#6c5ce7] shadow-xs transition-colors"
                >
                  <Calendar size={14} />
                  <span>Calendar View</span>
                </Link>

                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-[#e8e4f5] shadow-xs">
                  <div className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-[#6c5ce7]">
                    <span>{activeAccount.icon}</span>
                    <span className="hidden sm:inline">{activeAccount.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/settings')}
                    className="p-1 text-[#94a3b8] hover:text-[#1f2430] cursor-pointer"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* HERO BALANCE CARD (PURPLE GRADIENT CARD - FULL WIDTH) */}
            <div className="figma-hero-card p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1 text-xs font-semibold text-white/80">
                  <span>{activeAccount.name} Wallet</span>
                  <ChevronRight size={15} />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-white">
                  Live Balance
                </span>
              </div>

              <div className="my-3">
                <span className="text-3xl sm:text-5xl font-extrabold font-mono tracking-tight text-white">
                  ${summary.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Expense & Income Badges */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-white/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#ff6b6b]/25 flex items-center justify-center text-[#ffa8a8]">
                    <TrendingDown size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-white/70 font-medium">Expense</p>
                    <p className="text-sm sm:text-base font-bold font-mono text-white">
                      ${summary.expense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#22c55e]/25 flex items-center justify-center text-[#86efac]">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-white/70 font-medium">Income</p>
                    <p className="text-sm sm:text-base font-bold font-mono text-white">
                      ${summary.income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* "LEFT TO SPEND" PROGRESS CARD */}
            <div className="figma-mint-card p-6">
              <div className="flex items-baseline justify-between mb-2">
                <div>
                  <h3 className="text-sm font-bold text-[#1f2430]">Left to Spend</h3>
                  <p className="text-xs text-[#64748b]">Monthly allowance tracker</p>
                </div>
                <span className="text-xs sm:text-sm font-medium text-[#64748b]">
                  <strong className="text-[#1f2430] font-mono text-sm sm:text-base">
                    ${summary.leftToSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </strong>{' '}
                  out of ${summary.budgetTotal.toLocaleString('en-US')}
                </span>
              </div>

              <div className="w-full h-4 rounded-full bg-[#dcfce7] p-0.5 mt-3 overflow-hidden relative flex items-center">
                <div
                  className="h-full rounded-full bg-[#4ade80] transition-all duration-500 relative"
                  style={{ width: `${spendRatio}%` }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-[#16a34a] rounded-full" />
                </div>
              </div>
            </div>

            {/* EXPENSES CATEGORY BREAKDOWN */}
            <div className="figma-card p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#f1edf9]">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#1f2430]">Expenses by Category</h3>
                  <p className="text-xs text-[#64748b]">Current spend vs planned limits</p>
                </div>
                <Link
                  to="/categories"
                  className="text-xs font-bold text-[#6c5ce7] hover:underline flex items-center gap-1"
                >
                  <span>Manage Categories</span>
                  <ChevronRight size={14} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories
                  .filter((cat) => categoryBudgets[cat.id] || categorySpending[cat.id])
                  .map((cat) => {
                    const spent = categorySpending[cat.id] || 0
                    const budgetLimit = categoryBudgets[cat.id] || cat.budget || 200
                    const left = Math.max(0, budgetLimit - spent)
                    const percent = Math.min(100, Math.round((spent / budgetLimit) * 100))

                    return (
                      <div
                        key={cat.id}
                        className="p-3.5 rounded-2xl bg-[#f8f6ff] border border-[#e8e4f5] space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg">{cat.icon}</span>
                            <span className="font-bold text-[#1f2430]">{cat.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold font-mono text-[#1f2430]">
                              ${spent.toFixed(2)}
                            </span>
                            <span className="text-[10px] text-[#94a3b8] font-mono block">
                              ${left.toFixed(2)} left
                            </span>
                          </div>
                        </div>

                        <div className="w-full h-2 rounded-full bg-[#e8e4f5] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percent}%`,
                              backgroundColor:
                                percent > 90 ? '#ef4444' : percent > 70 ? '#f59e0b' : '#10b981',
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>

          {/* SIDEBAR COLUMN (RIGHT 4 COLS ON DESKTOP) */}
          <div className="lg:col-span-4 space-y-5">
            {/* UPCOMING RECURRING TRANSACTIONS WIDGET */}
            <div className="figma-card p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#f1edf9]">
                <div className="flex items-center gap-2">
                  <Receipt size={16} className="text-[#0d9488]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1f2430]">
                    Upcoming Bills
                  </h4>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#e6f4f1] text-[#0f766e] font-mono">
                  {recurringBills.length} Scheduled
                </span>
              </div>

              <div className="space-y-2.5">
                {recurringBills.map((bill) => (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8f6ff] border border-[#e8e4f5]"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{bill.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-[#1f2430]">{bill.name}</p>
                        <p className="text-[10px] text-[#94a3b8]">{bill.nextDate}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold font-mono text-[#1f2430]">${bill.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CONNECTED WALLETS WIDGET */}
            <div className="figma-card p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#f1edf9]">
                <div className="flex items-center gap-2">
                  <Wallet size={16} className="text-[#6c5ce7]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1f2430]">
                    Wallets & Accounts
                  </h4>
                </div>
                <Link to="/settings" className="text-[11px] font-semibold text-[#6c5ce7] hover:underline">
                  Manage
                </Link>
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
                        <span className="text-base">{acc.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-[#1f2430]">{acc.name}</p>
                          <p className="text-[10px] text-[#64748b]">
                            {isCurrent ? 'Active account' : 'Switch'}
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

            {/* QUICK ACTIONS CARD */}
            <div className="figma-card p-5 space-y-3 text-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">Quick Actions</h4>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="w-full py-3.5 rounded-2xl bg-[#6c5ce7] hover:bg-[#5849cf] text-white text-xs font-bold shadow-md shadow-[#6c5ce7]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                <span>Log New Transaction</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* BOTTOM NAV BAR & FLOATING ACTION BUTTON */}
      <BottomNav onOpenAddTransaction={() => setIsAddModalOpen(true)} />

      {/* IN-APP CALCULATOR ADD TRANSACTION MODAL */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdded={refreshData}
        onUpgradeClick={(feat) => {
          setHighlightFeature(feat || '')
          setIsPremiumModalOpen(true)
        }}
      />

      {/* PREMIUM UPGRADE MODAL */}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        highlightFeature={highlightFeature}
      />
    </div>
  )
}
