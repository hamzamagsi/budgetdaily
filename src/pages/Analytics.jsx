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
  Sparkles,
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

  const refreshData = () => {
    setSummary(store.getFinancialSummary())
    setTransactions(store.getTransactions())
    setCategories(store.getCategories())
    setActiveAccount(store.getActiveAccount())
  }

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
    <div className="min-h-screen pb-28 sm:pb-12 bg-[#f3f0ff]">
      <Navbar
        onOpenAddTransaction={() => setIsAddModalOpen(true)}
        onUpgradeClick={() => setIsPremiumModalOpen(true)}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* TOP BAR: ANALYTICS & ACCOUNT (FIGMA SCREEN 4) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#e8e4f5] flex items-center justify-center text-[#6c5ce7] shadow-xs">
              <BarChart3 size={18} />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-[#1f2430]">Analytics & Insights</h1>
              <p className="text-xs text-[#64748b] font-medium">{activeAccount.name} · Spending Trends</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1 rounded-2xl bg-white border border-[#e8e4f5] shadow-xs">
            <span className="px-2.5 py-1 text-xs font-bold text-[#6c5ce7]">{activeAccount.icon} {activeAccount.name}</span>
          </div>
        </div>

        {/* 2-COLUMN RESPONSIVE ANALYTICS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: EXPENSE VS INCOME & BUDGET VS ACTUAL */}
          <div className="lg:col-span-7 space-y-5">
            {/* CHART 1: EXPENSE VS INCOME (FIGMA SCREEN 4) */}
            <div className="figma-card p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#f1edf9]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1f2430]">
                  Expense vs Income (6 Months)
                </h3>
                <div className="flex items-center gap-3 text-[10px] font-bold">
                  <span className="flex items-center gap-1 text-[#ff6b6b]">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff6b6b]" /> Expense
                  </span>
                  <span className="flex items-center gap-1 text-[#22c55e]">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#86efac]" /> Income
                  </span>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="h-56 flex items-end justify-between gap-4 pt-6 pb-2">
                {MONTHS_DATA.map((m) => {
                  const expenseHeight = Math.min(100, (m.expense / 5000) * 100)
                  const incomeHeight = Math.min(100, (m.income / 5000) * 100)

                  return (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full flex items-end justify-center gap-1.5 h-44">
                        <div
                          className="w-3 sm:w-4 rounded-full bg-[#ff8787] transition-all hover:brightness-110"
                          style={{ height: `${expenseHeight}%` }}
                          title={`Expense: $${m.expense}`}
                        />
                        <div
                          className="w-3 sm:w-4 rounded-full bg-[#86efac] transition-all hover:brightness-110"
                          style={{ height: `${incomeHeight}%` }}
                          title={`Income: $${m.income}`}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-[#64748b]">{m.month}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* CHART 2: BUDGET VS ACTUAL (FIGMA SCREEN 4) */}
            <div className="figma-card p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#f1edf9]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1f2430]">
                  Budget vs Actual Spending
                </h3>
                <span className="text-[11px] font-mono font-bold text-[#6c5ce7]">4.5K Target</span>
              </div>

              <div className="relative h-40 w-full pt-4">
                <div className="absolute top-4 left-0 right-0 border-b-2 border-dashed border-[#86efac] flex items-center justify-between">
                  <span className="text-[9px] font-bold font-mono text-[#16a34a] bg-white px-1">
                    4.5K
                  </span>
                </div>

                <svg className="w-full h-32 overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                  <path
                    d="M 10,75 L 60,88 L 120,80 L 180,50 L 240,78 L 290,95"
                    fill="none"
                    stroke="#ff8787"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="10" cy="75" r="4.5" fill="#ff6b6b" />
                  <circle cx="60" cy="88" r="4.5" fill="#ff6b6b" />
                  <circle cx="120" cy="80" r="4.5" fill="#ff6b6b" />
                  <circle cx="180" cy="50" r="4.5" fill="#ff6b6b" />
                  <circle cx="240" cy="78" r="4.5" fill="#ff6b6b" />
                  <circle cx="290" cy="95" r="4.5" fill="#ff6b6b" />
                </svg>

                <div className="flex items-center justify-between text-[10px] font-bold text-[#94a3b8] pt-2">
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

          {/* RIGHT COLUMN: EXPENSE CATEGORY BREAKDOWN TABLE & NO SPEND DAYS */}
          <div className="lg:col-span-5 space-y-5">
            <div className="figma-card p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#f1edf9]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1f2430]">
                  Category Breakdown
                </h3>
                <span className="text-xs font-mono font-bold text-[#64748b]">
                  Total: ${summary.expense.toFixed(2)}
                </span>
              </div>

              <div className="space-y-3.5">
                {categoryStats.map((c) => (
                  <div key={c.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{c.icon}</span>
                        <span className="font-semibold text-[#1f2430]">{c.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-[#1f2430]">${c.spent.toFixed(2)}</span>
                        <span className="text-[11px] font-mono text-[#94a3b8] w-9 text-right font-bold">
                          {c.percent}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#f1edf9] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${c.percent}%`, backgroundColor: c.color || '#6c5ce7' }}
                      />
                    </div>
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
        onAdded={refreshData}
      />

      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />
    </div>
  )
}
