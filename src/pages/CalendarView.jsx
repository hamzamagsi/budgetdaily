import { useState } from 'react'
import { store } from '../lib/store'
import { getCategoryById } from '../lib/categories'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import AddTransactionModal from '../components/AddTransactionModal'
import PremiumModal from '../components/PremiumModal'
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
  ArrowLeft,
} from 'lucide-react'

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(10) // default 10th matching Figma
  const [activeAccount, setActiveAccount] = useState(store.getActiveAccount())
  const [transactions, setTransactions] = useState(store.getTransactions())
  const [categories, setCategories] = useState(store.getCategories())

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]

  // Days in month calculation
  const firstDayIndex = new Date(year, month, 1).getDay() // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevDaysInMonth = new Date(year, month, 0).getDate()

  // Calculate daily spending map
  const dailySpending = {}
  const dailyIncome = {}
  const dailyTransactionsMap = {}

  transactions.forEach((t) => {
    const d = new Date(t.date)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const dayNum = d.getDate()
      dailyTransactionsMap[dayNum] = dailyTransactionsMap[dayNum] || []
      dailyTransactionsMap[dayNum].push(t)

      if (t.type === 'expense') {
        dailySpending[dayNum] = (dailySpending[dayNum] || 0) + Number(t.amount || 0)
      } else {
        dailyIncome[dayNum] = (dailyIncome[dayNum] || 0) + Number(t.amount || 0)
      }
    }
  })

  // Selected Day summary
  const selectedDayTxs = dailyTransactionsMap[selectedDay] || []
  const selectedDayExpense = dailySpending[selectedDay] || 0
  const selectedDayIncome = dailyIncome[selectedDay] || 0
  const selectedDayTotal = selectedDayIncome - selectedDayExpense

  const refreshData = () => {
    setTransactions(store.getTransactions())
    setCategories(store.getCategories())
    setActiveAccount(store.getActiveAccount())
  }

  return (
    <div className="min-h-screen pb-28 sm:pb-12 bg-[#f3f0ff]">
      <Navbar
        onOpenAddTransaction={() => setIsAddModalOpen(true)}
        onUpgradeClick={() => setIsPremiumModalOpen(true)}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-4">
        {/* TOP BAR: MONTH & ACTIONS (FIGMA SCREEN 4) */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white border border-[#e8e4f5] flex items-center justify-center text-[#6c5ce7] shadow-xs">
              <CalendarIcon size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1f2430]">
                {monthNames[month]} {String(year).slice(-2)}
              </h2>
              <p className="text-[10px] text-[#64748b] font-medium">{activeAccount.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 rounded-xl bg-white border border-[#e8e4f5] text-[#64748b] hover:text-[#1f2430] cursor-pointer shadow-xs"
            >
              <Search size={15} />
            </button>
            <button
              type="button"
              className="p-2 rounded-xl bg-white border border-[#e8e4f5] text-[#64748b] hover:text-[#1f2430] cursor-pointer shadow-xs"
            >
              <List size={15} />
            </button>
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-white border border-[#e8e4f5] shadow-xs">
              <span className="px-1.5 py-0.5 text-xs">{activeAccount.icon}</span>
              <MoreVertical size={16} className="text-[#94a3b8]" />
            </div>
          </div>
        </div>

        {/* CALENDAR GRID CARD */}
        <div className="figma-card p-4 sm:p-6 space-y-4">
          {/* Day Names Header */}
          <div className="grid grid-cols-7 text-center text-xs font-bold text-[#64748b] pb-2 border-b border-[#f1edf9]">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Day Grid Cells */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {/* Previous Month trailing days */}
            {Array.from({ length: firstDayIndex }).map((_, i) => {
              const dayNum = prevDaysInMonth - firstDayIndex + i + 1
              return (
                <div
                  key={`prev-${i}`}
                  className="h-14 sm:h-16 flex flex-col items-center justify-start p-1 text-xs text-[#cbd5e1] select-none opacity-50"
                >
                  <span>{dayNum}</span>
                </div>
              )
            })}

            {/* Current Month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1
              const isSelected = selectedDay === dayNum
              const spend = dailySpending[dayNum]
              const income = dailyIncome[dayNum]

              return (
                <div
                  key={`cur-${dayNum}`}
                  onClick={() => setSelectedDay(dayNum)}
                  className={`h-14 sm:h-16 flex flex-col items-center justify-start p-1 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'border-2 border-[#6c5ce7] bg-[#f8f6ff] shadow-xs scale-105'
                      : 'hover:bg-[#f8f6ff] border border-transparent'
                  }`}
                >
                  <span
                    className={`text-xs font-bold ${
                      isSelected ? 'text-[#6c5ce7]' : 'text-[#1f2430]'
                    }`}
                  >
                    {dayNum}
                  </span>

                  {/* Pink spend indicator if spent on that day */}
                  {spend > 0 && (
                    <span className="text-[9px] font-bold font-mono text-[#ff6b6b] mt-1 truncate">
                      {spend >= 1000 ? `${(spend / 1000).toFixed(1)}k` : Math.round(spend)}
                    </span>
                  )}

                  {/* Green income indicator */}
                  {income > 0 && (
                    <span className="text-[9px] font-bold font-mono text-[#16a34a] mt-0.5 truncate">
                      +{income >= 1000 ? `${(income / 1000).toFixed(1)}k` : Math.round(income)}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* SELECTED DAY SUMMARY CARD (FIGMA SCREEN 4 PURPLE CARD) */}
        <div className="figma-hero-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/15">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {monthNames[month]} {selectedDay}, {year}
            </h3>
            <span className="text-xs font-mono text-white/80">
              {selectedDayTxs.length} transaction{selectedDayTxs.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="grid grid-cols-3 text-center divide-x divide-white/15">
            <div>
              <p className="text-[10px] text-white/70 font-medium">Expense</p>
              <p className="text-sm sm:text-base font-bold font-mono text-[#ffa8a8]">
                ${selectedDayExpense.toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-[10px] text-white/70 font-medium">Income</p>
              <p className="text-sm sm:text-base font-bold font-mono text-[#86efac]">
                ${selectedDayIncome.toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-[10px] text-white/70 font-medium">Total</p>
              <p
                className={`text-sm sm:text-base font-bold font-mono ${
                  selectedDayTotal >= 0 ? 'text-[#86efac]' : 'text-white'
                }`}
              >
                {selectedDayTotal >= 0 ? '+' : '-'}${Math.abs(selectedDayTotal).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* SELECTED DAY TRANSACTION FEED (FIGMA SCREEN 4) */}
        <div className="figma-card p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#f1edf9]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
              Day's Transactions
            </h4>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs font-bold text-[#6c5ce7] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} />
              <span>Add to Day</span>
            </button>
          </div>

          {selectedDayTxs.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#94a3b8]">
              No transactions recorded on {monthNames[month]} {selectedDay}.
            </div>
          ) : (
            <div className="space-y-2.5">
              {selectedDayTxs.map((t) => {
                const cat = getCategoryById(categories, t.categoryId)
                const txTime = new Intl.DateTimeFormat('en-US', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                  year: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                }).format(new Date(t.date))

                return (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#f8f6ff] border border-[#e8e4f5]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{cat.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-[#1f2430]">
                          {t.note || cat.name}
                        </p>
                        <p className="text-[10px] text-[#64748b]">{txTime}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs font-bold font-mono ${
                          t.type === 'income' ? 'text-[#16a34a]' : 'text-[#ff6b6b]'
                        }`}
                      >
                        {t.type === 'income' ? '+' : '-'}${Number(t.amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
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
