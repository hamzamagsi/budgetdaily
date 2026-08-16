import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { store } from '../lib/store'
import { format, addDays } from 'date-fns'

export default function Onboarding() {
  const navigate = useNavigate()
  const today = format(new Date(), 'yyyy-MM-dd')
  const defaultEnd = format(addDays(new Date(), 29), 'yyyy-MM-dd')

  const [totalAmount, setTotalAmount] = useState('')
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(defaultEnd)
  const [currency, setCurrency] = useState('$')

  const days = Math.max(1, Math.round((new Date(endDate) - new Date(startDate)) / 86400000) + 1)
  const perDay = totalAmount ? (Number(totalAmount) / days).toFixed(2) : '0.00'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!totalAmount || Number(totalAmount) <= 0) return
    store.createBudget({
      totalAmount: Number(totalAmount),
      startDate,
      endDate,
      currency,
    })
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <p className="font-mono text-xs tracking-[0.2em] text-[var(--color-warn)] uppercase mb-2 text-center">
          set it once
        </p>
        <h1 className="font-display text-2xl font-semibold text-center mb-8">What's your budget?</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs text-[var(--color-text-dim)] mb-2">Total amount</label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--color-panel)] border border-[var(--color-line)] focus-within:border-[var(--color-brand)] transition-colors">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent text-sm outline-none text-[var(--color-text-dim)]"
              >
                <option value="$">$</option>
                <option value="₨">₨</option>
                <option value="€">€</option>
                <option value="£">£</option>
              </select>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                required
                placeholder="1000"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="flex-1 bg-transparent outline-none font-mono text-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[var(--color-text-dim)] mb-2">Starts</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-panel)] border border-[var(--color-line)] text-sm outline-none focus:border-[var(--color-brand)] transition-colors font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--color-text-dim)] mb-2">Ends</label>
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-panel)] border border-[var(--color-line)] text-sm outline-none focus:border-[var(--color-brand)] transition-colors font-mono"
              />
            </div>
          </div>

          <div className="rounded-xl bg-[var(--color-panel-2)] px-4 py-3 flex items-center justify-between">
            <span className="text-xs text-[var(--color-text-dim)]">
              {days} day{days !== 1 ? 's' : ''} · today's starting allowance
            </span>
            <span className="font-mono text-sm font-semibold text-[var(--color-safe)]">
              {currency}
              {perDay}/day
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[var(--color-brand)] text-[var(--color-ink)] font-semibold text-sm hover:brightness-110 transition-all"
          >
            Start tracking
          </button>
        </form>
      </div>
    </div>
  )
}
