import { format } from 'date-fns'

export default function ExpenseLog({ expenses, currency, onDelete }) {
  if (!expenses.length) {
    return (
      <p className="text-sm text-[var(--color-text-faint)] text-center py-8">
        Nothing logged yet. Tap "Log a spend" when you buy something.
      </p>
    )
  }

  const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <ul className="divide-y divide-[var(--color-line)]">
      {sorted.map((e) => (
        <li key={e.id} className="flex items-center justify-between py-3 group">
          <div>
            <p className="text-sm">{e.label || 'Expense'}</p>
            <p className="text-xs text-[var(--color-text-faint)] font-mono">
              {format(new Date(e.date), 'MMM d, h:mm a')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm">
              {currency}
              {Number(e.amount).toFixed(2)}
            </span>
            <button
              onClick={() => onDelete(e.id)}
              className="text-xs text-[var(--color-text-faint)] hover:text-[var(--color-over)] transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Delete expense"
            >
              Remove
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
