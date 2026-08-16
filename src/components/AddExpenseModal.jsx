import { useState } from 'react'
import { canSpend } from '../lib/budgetEngine'

export default function AddExpenseModal({ budget, expenses, currency, onClose, onConfirm }) {
  const [amount, setAmount] = useState('')
  const [label, setLabel] = useState('')

  const numericAmount = Number(amount) || 0
  const check = numericAmount > 0 ? canSpend(budget, expenses, numericAmount) : null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!numericAmount || numericAmount <= 0) return
    if (check && !check.allowed) return
    onConfirm({ amount: numericAmount, label: label || 'Expense' })
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 px-4 pb-4 sm:pb-4">
      <div className="w-full max-w-sm bg-[var(--color-panel)] border border-[var(--color-line)] rounded-2xl p-6">
        <h2 className="font-display text-lg font-semibold mb-4">Log a spend</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--color-panel-2)] border border-[var(--color-line)] focus-within:border-[var(--color-brand)] transition-colors">
            <span className="text-[var(--color-text-dim)] font-mono">{currency}</span>
            <input
              autoFocus
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-transparent outline-none font-mono text-lg"
            />
          </div>
          <input
            type="text"
            placeholder="What was it? (optional)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-panel-2)] border border-[var(--color-line)] text-sm outline-none focus:border-[var(--color-brand)] transition-colors"
          />

          {check?.reason && (
            <p
              className="text-xs rounded-lg px-3 py-2"
              style={{
                color: check.allowed ? 'var(--color-warn)' : 'var(--color-over)',
                background: check.allowed ? 'rgba(232,179,84,0.1)' : 'rgba(232,115,95,0.1)',
              }}
            >
              {check.reason}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[var(--color-line)] text-sm text-[var(--color-text-dim)] hover:text-[var(--color-text)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!numericAmount || (check && !check.allowed)}
              className="flex-1 py-3 rounded-xl bg-[var(--color-brand)] text-[var(--color-ink)] font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {check && !check.allowed ? "Can't log this" : 'Log it'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
