import { useState } from 'react'
import { format, isToday, isYesterday, subDays, isBefore, startOfDay } from 'date-fns'
import { getCategoryById } from '../lib/categories'
import { useAuth } from '../context/AuthContext'
import {
  Trash2,
  Search,
  Filter,
  CreditCard,
  Banknote,
  Smartphone,
  Lock,
  Sparkles,
} from 'lucide-react'

export default function ExpenseLog({
  expenses = [],
  categories = [],
  currency = '$',
  onDelete,
  onOpenPremium,
}) {
  const { isPro } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all')

  if (!expenses.length) {
    return (
      <div className="text-center py-12 px-4 rounded-3xl bg-[#0e131f] border border-[var(--color-line)]">
        <div className="w-12 h-12 rounded-2xl bg-[var(--color-panel-elevated)] text-[var(--color-text-dim)] flex items-center justify-center mx-auto mb-3 text-xl">
          ☕
        </div>
        <p className="text-sm font-semibold text-white">No expenses logged yet</p>
        <p className="text-xs text-[var(--color-text-dim)] mt-1 max-w-xs mx-auto">
          Tap "+ Log a Spend" whenever you buy chai, lunch, or pay a bill.
        </p>
      </div>
    )
  }

  // Free Tier rule: only show last 3 days of history
  const threeDaysAgo = startOfDay(subDays(new Date(), 3))
  const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date))

  // Filter based on search & category
  const filtered = sorted.filter((e) => {
    const cat = getCategoryById(categories, e.categoryId)
    const matchesSearch =
      (e.label || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.note || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCat = selectedCategoryFilter === 'all' || e.categoryId === selectedCategoryFilter
    return matchesSearch && matchesCat
  })

  const hiddenCount = !isPro
    ? filtered.filter((e) => isBefore(new Date(e.date), threeDaysAgo)).length
    : 0

  const visibleExpenses = !isPro
    ? filtered.filter((e) => !isBefore(new Date(e.date), threeDaysAgo))
    : filtered

  const formatExpenseDate = (dateStr) => {
    const d = new Date(dateStr)
    if (isToday(d)) return `Today, ${format(d, 'h:mm a')}`
    if (isYesterday(d)) return `Yesterday, ${format(d, 'h:mm a')}`
    return format(d, 'MMM d, h:mm a')
  }

  const getPaymentIcon = (method) => {
    switch (method) {
      case 'card':
        return <CreditCard size={11} className="text-blue-400" />
      case 'wallet':
        return <Smartphone size={11} className="text-purple-400" />
      default:
        return <Banknote size={11} className="text-emerald-400" />
    }
  }

  return (
    <div className="space-y-4">
      {/* SEARCH AND FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0e131f] border border-[var(--color-line)] text-xs text-white placeholder-[var(--color-text-faint)] outline-none focus:border-[var(--color-brand)] transition-all"
          />
          <Search size={14} className="absolute left-3 top-2.5 text-[var(--color-text-faint)]" />
        </div>

        {/* Category filter dropdown */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
          <button
            type="button"
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all ${
              selectedCategoryFilter === 'all'
                ? 'bg-[var(--color-panel-elevated)] text-[var(--color-brand)] border border-[var(--color-brand)]/40'
                : 'bg-[#0e131f] text-[var(--color-text-dim)] border border-[var(--color-line)] hover:text-white'
            }`}
          >
            All
          </button>
          {categories.slice(0, 6).map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategoryFilter(c.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1 transition-all ${
                selectedCategoryFilter === c.id
                  ? 'bg-[var(--color-panel-elevated)] text-[var(--color-brand)] border border-[var(--color-brand)]/40'
                  : 'bg-[#0e131f] text-[var(--color-text-dim)] border border-[var(--color-line)] hover:text-white'
              }`}
            >
              <span>{c.icon}</span>
              <span className="truncate max-w-[70px]">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TRANSACTION LIST */}
      <div className="rounded-3xl bg-[#0e131f] border border-[var(--color-line)] overflow-hidden divide-y divide-[var(--color-line-subtle)]">
        {visibleExpenses.map((e) => {
          const category = getCategoryById(categories, e.categoryId)
          return (
            <div
              key={e.id}
              className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-[#141b2a] transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Category Avatar */}
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0 border"
                  style={{
                    background: `${category.color}15`,
                    borderColor: `${category.color}35`,
                  }}
                >
                  {category.icon}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white truncate">
                      {e.label || category.name}
                    </p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#182236] text-[var(--color-text-dim)] flex items-center gap-1 font-mono">
                      {getPaymentIcon(e.paymentMethod)}
                      <span className="capitalize">{e.paymentMethod || 'cash'}</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--color-text-faint)] font-mono mt-0.5">
                    {formatExpenseDate(e.date)} {e.note ? `· ${e.note}` : ''}
                  </p>
                </div>
              </div>

              {/* Amount & Delete */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-sm sm:text-base font-bold text-white">
                  -{currency}
                  {Number(e.amount).toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={() => onDelete(e.id)}
                  className="p-1.5 rounded-lg text-[var(--color-text-faint)] hover:text-[var(--color-over)] hover:bg-[var(--color-over)]/10 opacity-70 sm:opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  aria-label="Delete spend"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* FREE PLAN HISTORY LIMIT LOCK BANNER */}
      {!isPro && hiddenCount > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Lock size={15} />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">
                {hiddenCount} older transaction{hiddenCount > 1 ? 's' : ''} locked
              </p>
              <p className="text-[11px] text-[var(--color-text-dim)]">
                Free plan includes 3-day history. Upgrade for lifetime history.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenPremium('Lifetime History')}
            className="px-3 py-1.5 rounded-xl bg-[var(--color-brand)] text-[var(--color-ink)] text-xs font-bold hover:brightness-110 shrink-0"
          >
            Unlock ($1)
          </button>
        </div>
      )}
    </div>
  )
}
