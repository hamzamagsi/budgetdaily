import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { store } from '../lib/store'
import { format, addDays } from 'date-fns'
import { Sparkles, Calendar, DollarSign, ArrowRight, ShieldCheck } from 'lucide-react'

const CURRENCIES = [
  { symbol: '$', label: 'USD ($)', name: 'Dollar' },
  { symbol: '₨', label: 'PKR (₨)', name: 'Pakistani Rupee' },
  { symbol: '₹', label: 'INR (₹)', name: 'Indian Rupee' },
  { symbol: 'AED', label: 'AED (د.إ)', name: 'Dirham' },
  { symbol: 'SAR', label: 'SAR (﷼)', name: 'Riyal' },
  { symbol: '€', label: 'EUR (€)', name: 'Euro' },
  { symbol: '£', label: 'GBP (£)', name: 'Pound' },
  { symbol: 'CAD', label: 'CAD ($)', name: 'Canadian Dollar' },
  { symbol: 'AUD', label: 'AUD ($)', name: 'Australian Dollar' },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const today = format(new Date(), 'yyyy-MM-dd')
  const defaultEnd = format(addDays(new Date(), 29), 'yyyy-MM-dd')

  const [totalAmount, setTotalAmount] = useState('1000')
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(defaultEnd)
  const [currency, setCurrency] = useState('$')

  const days = Math.max(1, Math.round((new Date(endDate) - new Date(startDate)) / 86400000) + 1)
  const numericAmount = Number(totalAmount) || 0
  const perDay = numericAmount > 0 ? (numericAmount / days).toFixed(2) : '0.00'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!numericAmount || numericAmount <= 0) return
    store.createBudget({
      totalAmount: numericAmount,
      startDate,
      endDate,
      currency,
    })
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-panel-elevated rounded-3xl p-8 border border-[var(--color-line)] shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-brand)]/15 border border-[var(--color-brand)]/30 text-[var(--color-brand)] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={14} />
            <span>Set It Once</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            What's Your Budget?
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-dim)] mt-1">
            Choose your total budget and target period.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* CURRENCY & AMOUNT */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-dim)] mb-1.5">
              Total Budget Amount
            </label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#0e131f] border border-[var(--color-line)] focus-within:border-[var(--color-brand)] focus-within:ring-2 focus-within:ring-[var(--color-brand)]/20 transition-all">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent text-sm font-semibold outline-none text-[var(--color-brand)] cursor-pointer"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.symbol} value={c.symbol} className="bg-[#121927] text-white">
                    {c.symbol} ({c.name})
                  </option>
                ))}
              </select>
              <div className="w-[1px] h-6 bg-[var(--color-line)] mx-1" />
              <input
                type="number"
                inputMode="decimal"
                min="1"
                step="any"
                required
                placeholder="1000"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="flex-1 bg-transparent outline-none font-mono text-2xl font-bold text-white placeholder-[var(--color-text-faint)]"
              />
            </div>
          </div>

          {/* DATES */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-dim)] mb-1.5">
                Starts On
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e131f] border border-[var(--color-line)] text-xs text-white outline-none focus:border-[var(--color-brand)] font-mono transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-dim)] mb-1.5">
                Ends On
              </label>
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e131f] border border-[var(--color-line)] text-xs text-white outline-none focus:border-[var(--color-brand)] font-mono transition-all"
              />
            </div>
          </div>

          {/* REALTIME CALCULATION PREVIEW */}
          <div className="rounded-2xl bg-gradient-to-r from-[#182338] to-[#121a2c] p-4 border border-[var(--color-line)] flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-[var(--color-text-dim)] block">
                {days} day{days !== 1 ? 's' : ''} duration
              </span>
              <span className="text-[11px] text-[var(--color-text-faint)]">
                Starting daily allowance
              </span>
            </div>
            <div className="text-right">
              <span className="font-mono text-xl font-bold text-[var(--color-safe)]">
                {currency}{perDay}
              </span>
              <span className="text-xs text-[var(--color-text-dim)] block">/ day</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-[var(--color-ink)] font-bold text-sm hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-amber-500/25"
          >
            <span>Start Tracking Daily</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}
