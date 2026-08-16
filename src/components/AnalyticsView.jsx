import { useMemo } from 'react'
import { getCategoryById } from '../lib/categories'
import { useAuth } from '../context/AuthContext'
import { store } from '../lib/store'
import {
  TrendingUp,
  PieChart,
  Bot,
  Download,
  Lock,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from 'lucide-react'

export default function AnalyticsView({
  budget,
  expenses = [],
  categories = [],
  currency = '$',
  onOpenPremium,
}) {
  const { isPro } = useAuth()

  // Calculate Category Breakdowns
  const categoryBreakdown = useMemo(() => {
    const map = {}
    let total = 0
    expenses.forEach((e) => {
      const amount = Number(e.amount) || 0
      total += amount
      const catId = e.categoryId || 'other'
      map[catId] = (map[catId] || 0) + amount
    })

    return Object.entries(map)
      .map(([catId, amount]) => {
        const cat = getCategoryById(categories, catId)
        const pct = total > 0 ? Math.round((amount / total) * 100) : 0
        return { ...cat, amount, pct }
      })
      .sort((a, b) => b.amount - a.amount)
  }, [expenses, categories])

  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
  }, [expenses])

  // AI Spending Advice generator based on expenses
  const aiAdvice = useMemo(() => {
    if (!expenses.length) {
      return 'Start logging your daily spends (like tea, meals, and transport) to activate AI insights.'
    }
    const topCat = categoryBreakdown[0]
    if (topCat) {
      return `You spend the most on ${topCat.name} (${currency}${topCat.amount.toFixed(2)} / ${topCat.pct}% of total). Saving just 15% here could extend your budget by 4 more days.`
    }
    return "Your daily spending rhythm is stable. Keep tomorrow's daily allowance intact by capping evening discretionary spends."
  }, [expenses, categoryBreakdown, currency])

  const handleExportCSV = () => {
    if (!isPro) {
      onOpenPremium('Export Reports to CSV')
      return
    }
    const csvContent = store.exportExpensesCSV()
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `BudgetDaily_Report_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* EXPORT & PRO BANNER */}
      <div className="flex items-center justify-between p-4 rounded-3xl bg-[#0e131f] border border-[var(--color-line)]">
        <div>
          <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
            <span>Visual Analytics & Reports</span>
            {!isPro && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-brand)] text-[var(--color-ink)] font-bold">
                PRO PREVIEW
              </span>
            )}
          </h3>
          <p className="text-xs text-[var(--color-text-dim)]">Deep dive into where every coin goes</p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="px-3.5 py-2 rounded-xl bg-[#162033] hover:bg-[#1e2c47] border border-[var(--color-line)] text-xs font-semibold text-white flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Download size={14} className="text-[var(--color-brand)]" />
          <span>Export CSV</span>
          {!isPro && <Lock size={12} className="text-[var(--color-text-faint)] ml-0.5" />}
        </button>
      </div>

      {/* AI SPENDING ADVISOR CARD */}
      <div className="relative p-5 rounded-3xl bg-gradient-to-br from-[#19243a] via-[#121927] to-[#0c101a] border border-[var(--color-brand)]/40 shadow-xl overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-brand)] uppercase tracking-wider mb-2">
          <Bot size={16} />
          <span>AI Spending Advisor</span>
        </div>
        <p className="text-sm font-medium text-white leading-relaxed">
          "{aiAdvice}"
        </p>
        <div className="mt-3 flex items-center gap-2 text-[11px] text-[var(--color-text-dim)] font-mono">
          <Sparkles size={13} className="text-[var(--color-brand)]" />
          <span>Analyzed across {expenses.length} transaction entries</span>
        </div>
      </div>

      {/* SPENDING BY CATEGORY BREAKDOWN */}
      <div className="p-6 rounded-3xl bg-[#0e131f] border border-[var(--color-line)]">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h4 className="text-sm font-bold text-white">Spend by Category</h4>
            <p className="text-xs text-[var(--color-text-faint)]">
              Total period spend: {currency}{totalSpent.toFixed(2)}
            </p>
          </div>
          <PieChart size={18} className="text-[var(--color-text-dim)]" />
        </div>

        {categoryBreakdown.length === 0 ? (
          <p className="text-xs text-center py-6 text-[var(--color-text-faint)]">
            No spending data to categorize yet.
          </p>
        ) : (
          <div className="space-y-3.5">
            {categoryBreakdown.map((cat) => (
              <div key={cat.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{cat.icon}</span>
                    <span className="font-medium text-white">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-white font-semibold">
                      {currency}{cat.amount.toFixed(2)}
                    </span>
                    <span className="text-[var(--color-text-faint)] text-[11px]">
                      ({cat.pct}%)
                    </span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-[#162033] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${cat.pct}%`,
                      background: cat.color || 'var(--color-brand)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PRO UPGRADE CARD */}
      {!isPro && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-[#0e131f] border border-amber-500/30 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Zap size={24} />
          </div>
          <h4 className="font-display text-lg font-bold text-white">Unlock All 10 Pro Features</h4>
          <p className="text-xs text-[var(--color-text-dim)] max-w-sm mx-auto">
            Get automated recurring subscription tracking, unlimited categories, Excel/PDF exports, and custom themes for just $1/mo.
          </p>
          <button
            type="button"
            onClick={() => onOpenPremium('Pro Analytics')}
            className="px-6 py-2.5 rounded-xl bg-[var(--color-brand)] text-[var(--color-ink)] font-bold text-xs hover:brightness-110 shadow-lg shadow-amber-500/20"
          >
            Upgrade to Pro ($1/mo)
          </button>
        </div>
      )}
    </div>
  )
}
