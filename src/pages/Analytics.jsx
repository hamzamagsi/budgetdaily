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

  // Calculate category spending for donut breakdown
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

      <main className="max-w-xl mx-auto px-4 pt-4 sm:pt-6 space-y-4">
        {/* TOP BAR: ANALYTICS & ACCOUNT (FIGMA SCREEN 4) */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white border border-[#e8e4f5] flex items-center justify-center text-[#6c5ce7] shadow-xs">
              <BarChart3 size={16} />
            </div>
            <div>
              <h2 className="text-xs font-bold text-[#1f2430]">Analytics</h2>
              <p className="text-[10px] text-[#64748b] font-medium">{activeAccount.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-[#e8e4f5] shadow-xs">
            <span className="px-2 py-1 text-xs">{activeAccount.icon}</span>
            <MoreVertical size={16} className="text-[#94a3b8]" />
          </div>
        </div>

        {/* CHART 1: EXPENSE VS INCOME (FIGMA SCREEN 4) */}
        <div className="figma-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#f1edf9]">
            <h3 className="text-xs font-bold text-[#1f2430]">Expense vs Income</h3>
            <div className="flex items-center gap-3 text-[10px] font-semibold">
              <span className="flex items-center gap-1 text-[#ff6b6b]">
                <div className="w-2 h-2 rounded-full bg-[#ff6b6b]" /> Expense
              </span>
              <span className="flex items-center gap-1 text-[#22c55e]">
                <div className="w-2 h-2 rounded-full bg-[#86efac]" /> Income
              </span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2">
            {MONTHS_DATA.map((m) => {
              const expenseHeight = Math.min(100, (m.expense / 5000) * 100)
              const incomeHeight = Math.min(100, (m.income / 5000) * 100)

              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1 h-36">
                    {/* Expense Bar (Pink) */}
                    <div
                      className="w-2.5 sm:w-3 rounded-full bg-[#ff8787] transition-all hover:brightness-110"
                      style={{ height: `${expenseHeight}%` }}
                      title={`Expense: $${m.expense}`}
                    />
                    {/* Income Bar (Green) */}
                    <div
                      className="w-2.5 sm:w-3 rounded-full bg-[#86efac] transition-all hover:brightness-110"
                      style={{ height: `${incomeHeight}%` }}
                      title={`Income: $${m.income}`}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[#64748b]">{m.month}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* CHART 2: BUDGET VS ACTUAL (FIGMA SCREEN 4) */}
        <div className="figma-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#f1edf9]">
            <h3 className="text-xs font-bold text-[#1f2430]">Budget vs Actual</h3>
            <span className="text-[11px] font-mono font-bold text-[#6c5ce7]">4.5K Budget</span>
          </div>

          {/* Line Chart Curve Simulation with SVG */}
          <div className="relative h-36 w-full pt-4">
            {/* Target Budget Line (4.5K green dashed line) */}
            <div className="absolute top-4 left-0 right-0 border-b-2 border-dashed border-[#86efac] flex items-center justify-between">
              <span className="text-[9px] font-bold font-mono text-[#16a34a] bg-white px-1">
                4.5K
              </span>
            </div>

            {/* SVG Actual Spending Curve */}
            <svg className="w-full h-28 overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
              <path
                d="M 10,75 L 60,88 L 120,80 L 180,50 L 240,78 L 290,95"
                fill="none"
                stroke="#ff8787"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Data points */}
              <circle cx="10" cy="75" r="4" fill="#ff6b6b" />
              <circle cx="60" cy="88" r="4" fill="#ff6b6b" />
              <circle cx="120" cy="80" r="4" fill="#ff6b6b" />
              <circle cx="180" cy="50" r="4" fill="#ff6b6b" />
              <circle cx="240" cy="78" r="4" fill="#ff6b6b" />
              <circle cx="290" cy="95" r="4" fill="#ff6b6b" />
            </svg>

            {/* Month labels */}
            <div className="flex items-center justify-between text-[9px] font-bold text-[#94a3b8] pt-2">
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
            </div>
          </div>
        </div>

        {/* CHART 3: EXPENSE CATEGORY BREAKDOWN TABLE */}
        <div className="figma-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#f1edf9]">
            <h3 className="text-xs font-bold text-[#1f2430]">Expense Category Breakdown</h3>
            <span className="text-[11px] font-mono text-[#64748b]">
              Total: ${summary.expense.toFixed(2)}
            </span>
          </div>

          <div className="space-y-3">
            {categoryStats.map((c) => (
              <div key={c.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span>{c.icon}</span>
                    <span className="font-semibold text-[#1f2430]">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-[#1f2430]">${c.spent.toFixed(2)}</span>
                    <span className="text-[10px] font-mono text-[#94a3b8] w-8 text-right">
                      {c.percent}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#f1edf9] overflow-hidden">
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
