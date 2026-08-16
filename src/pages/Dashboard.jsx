import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { store } from '../lib/store'
import { computeBudgetStatus } from '../lib/budgetEngine'
import { useAuth } from '../context/AuthContext'
import AllowanceGauge from '../components/AllowanceGauge'
import AddExpenseModal from '../components/AddExpenseModal'
import ExpenseLog from '../components/ExpenseLog'
import { format } from 'date-fns'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [budget, setBudget] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [modalOpen, setModalOpen] = useState(false)

  const refresh = () => {
    const b = store.getActiveBudget()
    if (!b) {
      navigate('/onboarding')
      return
    }
    setBudget(b)
    setExpenses(store.getExpenses())
  }

  useEffect(() => {
    refresh()
  }, [])

  if (!budget) return null

  const status = computeBudgetStatus(budget, expenses)
  const currency = budget.currency || '$'

  const handleConfirmExpense = ({ amount, label }) => {
    store.addExpense({ budgetId: budget.id, amount, label })
    setModalOpen(false)
    refresh()
  }

  const handleDelete = (id) => {
    store.deleteExpense(id)
    refresh()
  }

  if (status.periodEnded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-[var(--color-text-dim)] uppercase mb-3">
          period complete
        </p>
        <h1 className="font-display text-2xl font-semibold mb-2">
          You spent {currency}
          {status.totalSpent.toFixed(2)} of {currency}
          {status.totalBudget.toFixed(2)}
        </h1>
        <p className="text-sm text-[var(--color-text-dim)] mb-8">
          {status.remainingBudget >= 0
            ? `You came in ${currency}${status.remainingBudget.toFixed(2)} under.`
            : `You went ${currency}${Math.abs(status.remainingBudget).toFixed(2)} over.`}
        </p>
        <button
          onClick={() => navigate('/onboarding')}
          className="px-6 py-3 rounded-xl bg-[var(--color-brand)] text-[var(--color-ink)] font-semibold text-sm hover:brightness-110 transition-all"
        >
          Start a new budget
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-28">
      <header className="flex items-center justify-between px-6 py-5 max-w-lg mx-auto">
        <div>
          <span className="font-display font-semibold">BudgetDaily</span>
          <p className="text-xs text-[var(--color-text-faint)] font-mono">
            {format(new Date(), 'EEEE, MMM d')}
          </p>
        </div>
        <button
          onClick={() => {
            signOut()
            navigate('/')
          }}
          className="text-xs text-[var(--color-text-faint)] hover:text-[var(--color-text-dim)] transition-colors"
        >
          Sign out
        </button>
      </header>

      <main className="max-w-lg mx-auto px-6">
        <div className="rounded-3xl bg-[var(--color-panel)] border border-[var(--color-line)] py-8 flex flex-col items-center">
          <AllowanceGauge status={status} currency={currency} />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="rounded-2xl bg-[var(--color-panel)] border border-[var(--color-line)] px-4 py-3.5">
            <p className="text-xs text-[var(--color-text-faint)]">Remaining budget</p>
            <p className="font-mono text-lg font-semibold mt-1">
              {currency}
              {status.remainingBudget.toFixed(2)}
            </p>
          </div>
          <div className="rounded-2xl bg-[var(--color-panel)] border border-[var(--color-line)] px-4 py-3.5">
            <p className="text-xs text-[var(--color-text-faint)]">Days left</p>
            <p className="font-mono text-lg font-semibold mt-1">{status.daysRemaining}</p>
          </div>
        </div>

        <p className="text-xs text-[var(--color-text-faint)] text-center mt-4">
          If you stop spending now, tomorrow's allowance is{' '}
          <span className="text-[var(--color-text-dim)] font-mono">
            {currency}
            {status.tomorrowsAllowanceIfStopNow.toFixed(2)}
          </span>
        </p>

        <div className="mt-8">
          <h2 className="text-sm font-medium text-[var(--color-text-dim)] mb-1">Recent</h2>
          <ExpenseLog expenses={expenses} currency={currency} onDelete={handleDelete} />
        </div>
      </main>

      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3.5 rounded-full bg-[var(--color-brand)] text-[var(--color-ink)] font-semibold text-sm shadow-lg shadow-black/40 hover:brightness-110 transition-all"
      >
        + Log a spend
      </button>

      {modalOpen && (
        <AddExpenseModal
          budget={budget}
          expenses={expenses}
          currency={currency}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirmExpense}
        />
      )}
    </div>
  )
}
