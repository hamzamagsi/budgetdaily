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

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false)
  const [highlightFeature, setHighlightFeature] = useState('')
  const [showUpcoming, setShowUpcoming] = useState(false)

  // Load Financial Data
  const refreshData = () => {
    setSummary(store.getFinancialSummary())
    setTransactions(store.getTransactions())
    setCategoryBudgets(store.getCategoryBudgets())
    setActiveAccount(store.getActiveAccount())
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

  // Left to spend progress percentage
  const spendRatio = Math.min(100, Math.max(0, (summary.leftToSpend / (summary.budgetTotal || 1)) * 100))

  return (
    <div className="min-h-screen pb-24 sm:pb-12 bg-[#f3f0ff]">
      {/* Top Navbar */}
      <Navbar
        onOpenAddTransaction={() => setIsAddModalOpen(true)}
        onUpgradeClick={(feat) => {
          setHighlightFeature(feat || '')
          setIsPremiumModalOpen(true)
        }}
      />

      <main className="max-w-xl mx-auto px-4 pt-4 sm:pt-6 space-y-4">
        {/* FIGMA TOP DATE & WALLET BAR */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white border border-[#e8e4f5] flex items-center justify-center text-[#6c5ce7] shadow-xs">
              <Calendar size={16} />
            </div>
            <div>
              <h2 className="text-xs font-bold text-[#1f2430]">August</h2>
              <p className="text-[10px] text-[#64748b] font-medium">01 Aug 24 - 31 Aug 24</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-[#e8e4f5] shadow-xs">
            <div className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-[#6c5ce7]">
              <span>{activeAccount.icon}</span>
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

        {/* UPCOMING TRANSACTIONS PILL BANNER (FIGMA SCREEN 1) */}
        <div
          onClick={() => setShowUpcoming(!showUpcoming)}
          className="flex items-center justify-between p-3.5 rounded-2xl bg-[#e6f4f1] border border-[#c7ede4] text-[#0f766e] cursor-pointer hover:bg-[#dcf0ec] transition-all shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#ccede6] flex items-center justify-center text-[#0d9488]">
              <Receipt size={16} />
            </div>
            <span className="text-xs font-bold">Upcoming transactions</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#0d9488]">
            <span>{recurringBills.length} scheduled</span>
            <ChevronRight size={15} />
          </div>
        </div>

        {/* UPCOMING BILLS ACCORDION */}
        {showUpcoming && (
          <div className="p-4 rounded-2xl bg-white border border-[#e8e4f5] space-y-2.5 animate-in fade-in zoom-in-95">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
              Next Recurring Deductions
            </p>
            {recurringBills.map((bill) => (
              <div key={bill.id} className="flex items-center justify-between text-xs py-1">
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

        {/* HERO BALANCE CARD (FIGMA PURPLE GRADIENT CARD) */}
        <div className="figma-hero-card p-6 relative overflow-hidden">
          {/* Subtle circle glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          {/* Account Title */}
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

          {/* Big Hero Balance */}
          <div className="my-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white">
              ${summary.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Expense & Income Side-by-Side Pills */}
          <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-white/15">
            {/* Expense */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#ff6b6b]/25 flex items-center justify-center text-[#ffa8a8]">
                <TrendingDown size={18} />
              </div>
              <div>
                <p className="text-[10px] text-white/70 font-medium">Expense</p>
                <p className="text-xs sm:text-sm font-bold font-mono text-white">
                  ${summary.expense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Income */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#22c55e]/25 flex items-center justify-center text-[#86efac]">
                <TrendingUp size={18} />
              </div>
              <div>
                <p className="text-[10px] text-white/70 font-medium">Income</p>
                <p className="text-xs sm:text-sm font-bold font-mono text-white">
                  ${summary.income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* "LEFT TO SPEND" PROGRESS CARD (FIGMA MINT CARD) */}
        <div className="figma-mint-card p-5">
          <div className="flex items-baseline justify-between mb-1.5">
            <h3 className="text-xs font-bold text-[#1f2430]">Left to Spend</h3>
            <span className="text-xs font-medium text-[#64748b]">
              <strong className="text-[#1f2430] font-mono">
                ${summary.leftToSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </strong>{' '}
              out of ${summary.budgetTotal.toLocaleString('en-US')}
            </span>
          </div>

          {/* Segmented green progress bar */}
          <div className="w-full h-3.5 rounded-full bg-[#dcfce7] p-0.5 mt-2 overflow-hidden relative flex items-center">
            <div
              className="h-full rounded-full bg-[#4ade80] transition-all duration-500 relative"
              style={{ width: `${spendRatio}%` }}
            >
              {/* Divider indicator marker */}
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#16a34a] rounded-full" />
            </div>
          </div>
        </div>

        {/* EXPENSES CATEGORY BREAKDOWN LIST (FIGMA SCREEN 1) */}
        <div className="figma-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#f1edf9]">
            <h3 className="text-sm font-bold text-[#1f2430]">Expenses</h3>
            <Link
              to="/analytics"
              className="text-xs font-semibold text-[#6c5ce7] hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {categories
              .filter((cat) => categoryBudgets[cat.id] || categorySpending[cat.id])
              .slice(0, 6)
              .map((cat) => {
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

                    {/* Progress Bar */}
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
