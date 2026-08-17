import { useState, useMemo } from 'react'
import { store } from '../lib/store'
import { getCategoryById } from '../lib/categories'
import {
  Calendar as CalendarIcon,
  Search,
  List,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Plus,
} from 'lucide-react'

export default function CalendarView({ onOpenAddTransaction }) {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 7, 10)) // August 10, 2024 default to match Figma
  const [selectedDay, setSelectedDay] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  const transactions = store.getTransactions()
  const categories = store.getCategories()
  const activeAccount = store.getActiveAccount()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthName = currentDate.toLocaleString('en-US', { month: 'long' })
  const shortYear = String(year).slice(-2)

  // Calculate days in month and starting day offset
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayIndex = new Date(year, month, 1).getDay() // 0 = Sun, 1 = Mon ...
  const prevMonthDays = new Date(year, month, 0).getDate()

  // Map transactions to dates
  const dailySpendMap = useMemo(() => {
    const map = {}
    transactions.forEach((tx) => {
      if (!tx.date) return
      const d = new Date(tx.date)
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate()
        if (tx.type === 'expense') {
          map[day] = (map[day] || 0) + Number(tx.amount || 0)
        }
      }
    })
    return map
  }, [transactions, year, month])

  // Get transactions for selected day
  const selectedDayTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (!tx.date) return false
      const d = new Date(tx.date)
      const matchesDay = d.getFullYear() === year && d.getMonth() === month && d.getDate() === selectedDay
      if (!matchesDay) return false

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const cat = getCategoryById(categories, tx.categoryId)
        return (
          (tx.note && tx.note.toLowerCase().includes(q)) ||
          (cat.name && cat.name.toLowerCase().includes(q))
        )
      }
      return true
    })
  }, [transactions, year, month, selectedDay, searchQuery, categories])

  // Selected Day Summary
  const dayExpense = selectedDayTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)

  const dayIncome = selectedDayTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)

  const dayTotal = dayIncome - dayExpense

  // Format selected date label
  const selectedDateObj = new Date(year, month, selectedDay)
  const selectedDateLabel = selectedDateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  })

  return (
    <div className="figma-card p-5 sm:p-6 space-y-4">
      {/* TOP CALENDAR HEADER (FIGMA SCREEN 4) */}
      <div className="flex items-center justify-between pb-3 border-b border-[#f1edf9]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#ede9fe] text-[#6c5ce7] flex items-center justify-center font-bold">
            <CalendarIcon size={16} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#1f2430]">
              {monthName} {shortYear}
            </h3>
            <p className="text-[10px] text-[#64748b] font-medium">{activeAccount.name}</p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 text-[#64748b]">
          <button
            type="button"
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              showSearch ? 'bg-[#ede9fe] text-[#6c5ce7]' : 'hover:bg-[#f8f6ff]'
            }`}
          >
            <Search size={15} />
          </button>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#f8f6ff] text-xs">
            <span>{activeAccount.icon}</span>
          </div>
        </div>
      </div>

      {/* SEARCH BAR TOGGLE */}
      {showSearch && (
        <div className="animate-in fade-in zoom-in-95">
          <input
            type="text"
            placeholder="Search transactions by name or note (e.g. Coles, Sushi)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#f8f6ff] border border-[#e8e4f5] outline-none focus:border-[#6c5ce7]"
          />
        </div>
      )}

      {/* DAYS OF WEEK HEADER */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider py-1">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* CALENDAR MATRIX GRID (FIGMA SCREEN 4) */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Previous Month Pad Days */}
        {Array.from({ length: firstDayIndex }).map((_, i) => {
          const prevDay = prevMonthDays - firstDayIndex + i + 1
          return (
            <div key={`prev-${i}`} className="p-2 text-[11px] font-medium text-[#cbd5e1] opacity-50">
              <span>{prevDay}</span>
            </div>
          )
        })}

        {/* Current Month Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const isSelected = selectedDay === day
          const spend = dailySpendMap[day]

          return (
            <div
              key={`day-${day}`}
              onClick={() => setSelectedDay(day)}
              className={`p-1.5 sm:p-2 rounded-xl cursor-pointer transition-all flex flex-col items-center justify-between min-h-[44px] sm:min-h-[50px] ${
                isSelected
                  ? 'border-2 border-[#6c5ce7] bg-[#ede9fe]/40 shadow-xs'
                  : 'hover:bg-[#f8f6ff] border border-transparent'
              }`}
            >
              <span className={`text-xs font-semibold ${isSelected ? 'text-[#6c5ce7] font-bold' : 'text-[#1f2430]'}`}>
                {day}
              </span>

              {/* Little red spend label under date */}
              {spend ? (
                <span className="text-[9px] font-mono font-bold text-[#ef4444] leading-tight block truncate max-w-full">
                  {spend >= 1000 ? `${(spend / 1000).toFixed(1)}k` : Math.round(spend)}
                </span>
              ) : (
                <span className="text-[9px] text-transparent leading-tight block">-</span>
              )}
            </div>
          )
        })}
      </div>

      {/* SELECTED DATE SUMMARY HERO PILL (FIGMA SCREEN 4) */}
      <div className="p-4 rounded-2xl bg-[#6c5ce7] text-white shadow-md shadow-[#6c5ce7]/20">
        <div className="flex items-center justify-between pb-2 border-b border-white/20 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">
            {selectedDateLabel}
          </span>
          <button
            type="button"
            onClick={onOpenAddTransaction}
            className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white/20 hover:bg-white/30 text-white cursor-pointer"
          >
            <Plus size={12} />
            <span>Add Log</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-[10px] text-white/70">Expense</p>
            <p className="text-xs sm:text-sm font-bold font-mono text-[#ffa8a8]">
              ${dayExpense.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-white/70">Income</p>
            <p className="text-xs sm:text-sm font-bold font-mono text-[#86efac]">
              ${dayIncome.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-white/70">Total</p>
            <p className="text-xs sm:text-sm font-bold font-mono text-white">
              {dayTotal >= 0 ? `$${dayTotal.toFixed(2)}` : `-$${Math.abs(dayTotal).toFixed(2)}`}
            </p>
          </div>
        </div>
      </div>

      {/* SELECTED DAY TRANSACTION FEED (FIGMA SCREEN 4) */}
      <div className="space-y-2 pt-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
          Transactions ({selectedDayTransactions.length})
        </p>

        {selectedDayTransactions.length === 0 ? (
          <div className="p-4 text-center rounded-2xl bg-[#f8f6ff] text-xs text-[#94a3b8]">
            No transactions logged for this date.
          </div>
        ) : (
          selectedDayTransactions.map((tx) => {
            const cat = getCategoryById(categories, tx.categoryId)
            const d = new Date(tx.date)
            const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })

            return (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#f8f6ff] border border-[#e8e4f5] hover:bg-[#f1edf9] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-lg shadow-xs">
                    {cat.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1f2430]">{tx.note || cat.name}</p>
                    <p className="text-[10px] text-[#64748b]">
                      {selectedDateLabel} {timeStr}
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono font-bold text-xs">
                  <span className={tx.type === 'income' ? 'text-[#16a34a]' : 'text-[#1f2430]'}>
                    {tx.type === 'income' ? `+$${Number(tx.amount).toFixed(2)}` : `-$${Number(tx.amount).toFixed(2)}`}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
