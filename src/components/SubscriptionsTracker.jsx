import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { store } from '../lib/store'
import {
  Calendar,
  Plus,
  Trash2,
  Lock,
  Sparkles,
  Zap,
  Film,
  Music,
  Dumbbell,
  Home,
  Wifi,
} from 'lucide-react'

export default function SubscriptionsTracker({ currency = '$', onOpenPremium }) {
  const { isPro } = useAuth()
  const [bills, setBills] = useState(() => store.getRecurringBills())
  const [isAdding, setIsAdding] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [cycle, setCycle] = useState('monthly')
  const [icon, setIcon] = useState('🎬')

  const totalMonthlyBills = bills.reduce((sum, b) => {
    const amt = Number(b.amount) || 0
    return sum + (b.cycle === 'yearly' ? amt / 12 : amt)
  }, 0)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!isPro) {
      onOpenPremium('Recurring Subscriptions Tracker')
      return
    }
    if (!name || !amount) return
    const newBill = store.addRecurringBill({
      name: name.trim(),
      amount: Number(amount),
      cycle,
      icon,
      nextDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    })
    setBills(store.getRecurringBills())
    setName('')
    setAmount('')
    setIsAdding(false)
  }

  const handleDelete = (id) => {
    store.deleteRecurringBill(id)
    setBills(store.getRecurringBills())
  }

  return (
    <div className="space-y-6">
      {/* SUMMARY CARD */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#18233a] to-[#0e131f] border border-[var(--color-line)] flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-faint)]">
            Fixed Monthly Commitments
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-bold font-mono text-white">
              {currency}{totalMonthlyBills.toFixed(2)}
            </span>
            <span className="text-xs text-[var(--color-text-dim)]">/ month</span>
          </div>
          <p className="text-xs text-[var(--color-text-faint)] mt-1">
            (~{currency}{(totalMonthlyBills / 30).toFixed(2)}/day impact on your daily allowance)
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!isPro) {
              onOpenPremium('Recurring Subscriptions Tracker')
            } else {
              setIsAdding(!isAdding)
            }
          }}
          className="px-4 py-2 rounded-xl bg-[var(--color-brand)] text-[var(--color-ink)] font-bold text-xs hover:brightness-110 flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
        >
          <Plus size={14} />
          <span>Add Subscription</span>
          {!isPro && <Lock size={12} />}
        </button>
      </div>

      {/* ADD BILL FORM */}
      {isAdding && isPro && (
        <form onSubmit={handleAdd} className="p-5 rounded-3xl bg-[#0e131f] border border-[var(--color-brand)]/40 space-y-4">
          <h4 className="text-sm font-bold text-white">Add Recurring Subscription</h4>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Service Name (e.g. Gym, Netflix)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#162033] border border-[var(--color-line)] text-xs text-white outline-none focus:border-[var(--color-brand)]"
            />
            <input
              type="number"
              required
              step="any"
              placeholder="Amount (e.g. 15.00)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#162033] border border-[var(--color-line)] text-xs text-white font-mono outline-none focus:border-[var(--color-brand)]"
            />
          </div>

          <div className="flex gap-2">
            {['🎬', '🎵', '🏋️', '🏠', '⚡', '📱'].map((ic) => (
              <button
                key={ic}
                type="button"
                onClick={() => setIcon(ic)}
                className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center ${
                  icon === ic ? 'bg-[var(--color-panel-elevated)] ring-1 ring-[var(--color-brand)]' : 'bg-[#162033]'
                }`}
              >
                {ic}
              </button>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-[var(--color-text-dim)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-[var(--color-brand)] text-[var(--color-ink)] text-xs font-bold"
            >
              Save Subscription
            </button>
          </div>
        </form>
      )}

      {/* BILLS LIST */}
      <div className="rounded-3xl bg-[#0e131f] border border-[var(--color-line)] divide-y divide-[var(--color-line-subtle)] overflow-hidden">
        {bills.map((bill) => (
          <div key={bill.id} className="p-4 flex items-center justify-between hover:bg-[#141c2c] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#182338] flex items-center justify-center text-lg">
                {bill.icon || '🎬'}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{bill.name}</p>
                <p className="text-[11px] text-[var(--color-text-faint)] font-mono">
                  Billed {bill.cycle} · Next: {bill.nextDate || 'Upcoming'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-bold text-white">
                {currency}{Number(bill.amount).toFixed(2)}
              </span>
              {isPro && (
                <button
                  type="button"
                  onClick={() => handleDelete(bill.id)}
                  className="p-1 text-[var(--color-text-faint)] hover:text-[var(--color-over)] transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
