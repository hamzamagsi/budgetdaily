import { useState, useEffect } from 'react'
import { store } from '../lib/store'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import AddTransactionModal from '../components/AddTransactionModal'
import PremiumModal from '../components/PremiumModal'
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  PieChart as PieIcon,
  ChevronRight,
  MoreVertical,
  Calendar,
  Layers,
} from 'lucide-react'

const MONTHS_DATA = [
  { month: 'Mar', expense: 1800, income: 4200, actual: 1800 },
  { month: 'Apr', expense: 1400, income: 4300, actual: 1400 },
  { month: 'May', expense: 2200, income: 4500, actual: 2200 },
  { month: 'Jun', expense: 3100, income: 4800, actual: 3100 },
  { month: 'Jul', expense: 2400, income: 4500, actual: 2400 },
  { month: 'Aug', expense: 2176.44, income: 4500, actual: 2176.44 },
]

export default function Analytics() {
  const [summary, setSummary] = useState(store.getFinancialSummary())
  const [transactions, setTransactions] = useState(store.getTransactions())
  const [categories, setCategories] = useState(store.getCategories())
  const [activeAccount, setActiveAccount] = useState(store.getActiveAccount())

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false)

  const categoryTotals = {}
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryTotals[t.categoryId] = (categoryTotals[t.categoryId] || 0) + Number(t.amount || 0)
    })

  const totalExpense = summary.expense || 1
  const categoryStats = categories
    .map((cat) => {
      const spent = categoryTotals[cat.id] || 0
      const percent = Math.round((spent / totalExpense) * 100)
      return { ...cat, spent, percent }
    })
    .filter((c) => c.spent > 0)
    .sort((a, b) => b.spent - a.spent)

  return (
    <div className="min-h-screen pb-28 lg:pb-12 bg-[#f3f0ff]">
      <Navbar
        onOpenAddTransaction={() => setIsAddModalOpen(true)}
        onUpgradeClick={() => setIsPremiumModalOpen(true)}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* TOP BAR: ANALYTICS & ACCOUNT */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#e8e4f5] flex items-center justify-center text-[#6c5ce7] shadow-xs">
              <BarChart3 size={18} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#1f2430]">Financial Analytics</h2>
              <p className="text-xs text-[#64748b] font-medium">{activeAccount.name} Wallet</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white border border-[#e8e4f5] shadow-xs text-xs font-bold text-[#6c5ce7]">
            <span>{activeAccount.icon}</span>
            <span>{activeAccount.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* CHART 1: EXPENSE VS INCOME */}
          <div className="figma-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f1edf9]">
              <h3 className="text-sm font-bold text-[#1f2430]">Expense vs Income (Last 6 Months)</h3>
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-[#ff6b6b]">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff6b6b]" /> Expense
                </span>
                <span className="flex items-center gap-1.5 text-[#22c55e]">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#86efac]" /> Income
                </span>
              </div>
            </div>

            <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2">
              {MONTHS_DATA.map((m) => {
                const expenseHeight = Math.min(100, (m.expense / 5000) * 100)
                const incomeHeight = Math.min(100, (m.income / 5000) * 100)

                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-full flex items-end justify-center gap-1.5 h-40">
                      <div
                        className="w-3.5 sm:w-4 rounded-full bg-[#ff8787] transition-all hover:brightness-110"
                        style={{ height: `${expenseHeight}%` }}
                        title={`Expense: $${m.expense}`}
                      />
                      <div
                        className="w-3.5 sm:w-4 rounded-full bg-[#86efac] transition-all hover:brightness-110"
                        style={{ height: `${incomeHeight}%` }}
                        title={`Income: $${m.income}`}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#64748b]">{m.month}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* CHART 2: BUDGET VS ACTUAL */}
          <div className="figma-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f1edf9]">
              <h3 className="text-sm font-bold text-[#1f2430]">Budget Target vs Actual Spend</h3>
              <span className="text-xs font-mono font-bold text-[#6c5ce7] bg-[#ede9fe] px-2.5 py-1 rounded-full">
                4.5K Monthly Target
              </span>
            </div>

            <div className="relative h-56 w-full pt-6">
              <div className="absolute top-6 left-0 right-0 border-b-2 border-dashed border-[#86efac] flex items-center justify-between">
                <span className="text-[10px] font-bold font-mono text-[#16a34a] bg-white px-2 py-0.5 rounded-md shadow-xs">
                  4.5K Target
                </span>
              </div>

              <svg className="w-full h-40 overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                <path
                  d="M 10,75 L 60,88 L 120,80 L 180,50 L 240,78 L 290,95"
                  fill="none"
                  stroke="#ff8787"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="10" cy="75" r="5" fill="#ff6b6b" />
                <circle cx="60" cy="88" r="5" fill="#ff6b6b" />
                <circle cx="120" cy="80" r="5" fill="#ff6b6b" />
                <circle cx="180" cy="50" r="5" fill="#ff6b6b" />
                <circle cx="240" cy="78" r="5" fill="#ff6b6b" />
                <circle cx="290" cy="95" r="5" fill="#ff6b6b" />
              </svg>

              <div className="flex items-center justify-between text-xs font-bold text-[#94a3b8] pt-3">
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
              </div>
            </div>
          </div>
        </div>

        {/* EXPENSE CATEGORY BREAKDOWN TABLE */}
        <div className="figma-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f1edf9]">
            <h3 className="text-sm font-bold text-[#1f2430]">Expense Category Breakdown</h3>
            <span className="text-xs font-mono font-bold text-[#64748b]">
              Total Period Spend: ${summary.expense.toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categoryStats.map((c) => (
              <div key={c.id} className="p-3.5 rounded-2xl bg-[#f8f6ff] border border-[#e8e4f5] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{c.icon}</span>
                    <span className="font-bold text-[#1f2430]">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold font-mono text-[#1f2430]">${c.spent.toFixed(2)}</span>
                    <span className="text-xs font-bold font-mono text-[#6c5ce7] w-10 text-right">
                      {c.percent}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-[#e8e4f5] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${c.percent}%`, backgroundColor: c.color || '#6c5ce7' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav onOpenAddTransaction={() => setIsAddModalOpen(true)} />

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdded={() => {
          setSummary(store.getFinancialSummary())
          setTransactions(store.getTransactions())
        }}
      />

      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />
    </div>
  )
}
