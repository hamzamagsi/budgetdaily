import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { store } from '../lib/store'
import confetti from 'canvas-confetti'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import CalendarView from '../components/CalendarView'
import AddTransactionModal from '../components/AddTransactionModal'
import CustomCategoryModal from '../components/CustomCategoryModal'
import PremiumModal from '../components/PremiumModal'
import {
  Calendar,
  Wallet,
  TrendingDown,
  TrendingUp,
  Receipt,
  ChevronRight,
  Plus,
  MoreVertical,
  Sparkles,
  Layers,
} from 'lucide-react'

export default function Dashboard() {
  const { user, isPro, upgradePlan } = useAuth()
  const navigate = useNavigate()

  const [summary, setSummary] = useState(store.getFinancialSummary())
  const [transactions, setTransactions] = useState(store.getTransactions())
  const [categoryBudgets, setCategoryBudgets] = useState(store.getCategoryBudgets())
  const [categories, setCategories] = useState(store.getCategories())
  const [activeAccount, setActiveAccount] = useState(store.getActiveAccount())

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isCustomCatOpen, setIsCustomCatOpen] = useState(false)
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false)
  const [highlightFeature, setHighlightFeature] = useState('')
  const [showUpcoming, setShowUpcoming] = useState(false)

  const refreshData = () => {
    setSummary(store.getFinancialSummary())
    setTransactions(store.getTransactions())
    setCategoryBudgets(store.getCategoryBudgets())
    setCategories(store.getCategories())
    setActiveAccount(store.getActiveAccount())
  }

  // Listen for real Polar checkout success redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('checkout') === 'success') {
      const plan = params.get('plan') || 'monthly'
      upgradePlan(plan)
      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#6c5ce7', '#10b981', '#f59e0b'],
        })
      } catch (err) {}
      window.history.replaceState({}, document.title, window.location.pathname)
      refreshData()
    }
  }, [])

  useEffect(() => {
    refreshData()
    const handleStorageChange = () => refreshData()
    window.addEventListener('storage_change', handleStorageChange)
    return () => window.removeEventListener('storage_change', handleStorageChange)
  }, [])

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
    <div className="min-h-screen pb-24 sm:pb-12 bg-[#f3f0ff]">
      <Navbar
        onOpenAddTransaction={() => setIsAddModalOpen(true)}
        onUpgradeClick={(feat) => {
          setHighlightFeature(feat || '')
          setIsPremiumModalOpen(true)
        }}
      />

      {/* FULL-WIDTH RESPONSIVE DESKTOP CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* TOP BAR: DATE & PERIOD HEADER */}
        <div className="flex items-center justify-between pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#e8e4f5] flex items-center justify-center text-[#6c5ce7] shadow-xs">
              <Calendar size={18} />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-[#1f2430]">
                August 2024
              </h1>
              <p className="text-xs text-[#64748b] font-medium">01 Aug 24 - 31 Aug 24</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#6c5ce7] hover:bg-[#5849cf] text-white text-xs font-bold shadow-md shadow-[#6c5ce7]/20 transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Transaction</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-[#e8e4f5] text-xs font-bold text-[#1f2430] shadow-xs hover:bg-[#f8f6ff] transition-colors cursor-pointer"
            >
              <span>{activeAccount.icon}</span>
              <span className="hidden md:inline">{activeAccount.name}</span>
            </button>
          </div>
        </div>

        {/* 2-COLUMN BALANCED DESKTOP GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: HERO BALANCE, LEFT TO SPEND, RECURRING & QUICK WALLETS */}
          <div className="lg:col-span-5 space-y-5">
            {/* HERO PURPLE BALANCE CARD (FIGMA SCREEN 1) */}
            <div className="figma-hero-card p-6 sm:p-7 relative overflow-hidden shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <button
                  type="button"
                  onClick={() => navigate('/settings')}
                  className="flex items-center gap-1 text-xs font-medium text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <span>{activeAccount.name}</span>
                  <ChevronRight size={15} />
                </button>
              </div>

              <div className="my-2">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white">
                  ${summary.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                    <p className="text-sm font-bold font-mono text-white">
                      ${summary.expense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-[#22c55e]/25 flex items-center justify-center text-[#86efac]">
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/70 font-medium">Income</p>
                    <p className="text-sm font-bold font-mono text-white">
                      ${summary.income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* "LEFT TO SPEND" PROGRESS CARD (FIGMA MINT CARD) */}
            <div className="figma-mint-card p-5 sm:p-6 shadow-xs">
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="text-xs sm:text-sm font-bold text-[#1f2430]">Left to Spend</h3>
                <span className="text-xs font-medium text-[#64748b]">
                  <strong className="text-[#1f2430] font-mono">
                    ${summary.leftToSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </strong>{' '}
                  out of ${summary.budgetTotal.toLocaleString('en-US')}
                </span>
              </div>

              <div className="w-full h-3.5 rounded-full bg-[#dcfce7] p-0.5 mt-2 overflow-hidden relative flex items-center">
                <div
                  className="h-full rounded-full bg-[#4ade80] transition-all duration-500 relative"
                  style={{ width: `${spendRatio}%` }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#16a34a] rounded-full" />
                </div>
              </div>
            </div>

            {/* UPCOMING TRANSACTIONS PILL BANNER */}
            <div className="figma-card p-5 space-y-3">
              <div
                onClick={() => setShowUpcoming(!showUpcoming)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#e6f4f1] border border-[#c7ede4] text-[#0f766e] cursor-pointer hover:bg-[#dcf0ec] transition-all shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#ccede6] flex items-center justify-center text-[#0d9488]">
                    <Receipt size={16} />
                  </div>
                  <span className="text-xs font-bold">Upcoming Recurring Bills</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#0d9488]">
                  <span>{recurringBills.length} scheduled</span>
                  <ChevronRight size={15} />
                </div>
              </div>

              {showUpcoming && (
                <div className="space-y-2 pt-1 animate-in fade-in zoom-in-95">
                  {recurringBills.map((bill) => (
                    <div key={bill.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#f8f6ff]">
                      <div className="flex items-center gap-2">
                        <span>{bill.icon}</span>
                        <span className="font-semibold text-[#1f2430]">{bill.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold font-mono text-[#1f2430]">${bill.amount}</span>
                        <span className="text-[10px] text-[#94a3b8] block">{bill.nextDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* EXPENSES CATEGORY BREAKDOWN LIST (FIGMA SCREEN 1) */}
            <div className="figma-card p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#f1edf9]">
                <h3 className="text-sm font-bold text-[#1f2430]">Expenses by Category</h3>
                <button
                  type="button"
                  onClick={() => setIsCustomCatOpen(true)}
                  className="flex items-center gap-1 text-xs font-semibold text-[#6c5ce7] hover:underline cursor-pointer"
                >
                  <Plus size={13} />
                  <span>New Category</span>
                </button>
              </div>

              <div className="space-y-4">
                {categories.slice(0, 5).map((cat) => {
                  const spent = categorySpending[cat.id] || 0
                  const budgetLimit = categoryBudgets[cat.id] || cat.budget || 200
                  const left = Math.max(0, budgetLimit - spent)
                  const percent = Math.min(100, Math.round((spent / budgetLimit) * 100))

                  return (
                    <div key={cat.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{cat.icon}</span>
                          <span className="font-semibold text-[#1f2430]">{cat.name}</span>
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

                      <div className="w-full h-2 rounded-full bg-[#f1edf9] overflow-hidden">
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

          {/* RIGHT COLUMN: CALENDAR DATE MATRIX & TIMELINE (FIGMA SCREEN 4) */}
          <div className="lg:col-span-7">
            <CalendarView onOpenAddTransaction={() => setIsAddModalOpen(true)} />
          </div>
        </div>
      </main>

      <BottomNav onOpenAddTransaction={() => setIsAddModalOpen(true)} />

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdded={refreshData}
        onUpgradeClick={(feat) => {
          setHighlightFeature(feat || '')
          setIsPremiumModalOpen(true)
        }}
      />

      <CustomCategoryModal
        isOpen={isCustomCatOpen}
        onClose={() => setIsCustomCatOpen(false)}
        onCreated={refreshData}
      />

      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        highlightFeature={highlightFeature}
      />
    </div>
  )
}
