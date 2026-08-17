import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { store } from '../lib/store'
import { computeBudgetStatus } from '../lib/budgetEngine'
import { useAuth } from '../context/AuthContext'
import AllowanceGauge from '../components/AllowanceGauge'
import AddExpenseModal from '../components/AddExpenseModal'
import CustomCategoryModal from '../components/CustomCategoryModal'
import ExpenseLog from '../components/ExpenseLog'
import AnalyticsView from '../components/AnalyticsView'
import SubscriptionsTracker from '../components/SubscriptionsTracker'
import PremiumModal from '../components/PremiumModal'
import Navbar from '../components/Navbar'
import confetti from 'canvas-confetti'
import {
  Compass,
  PieChart,
  Calendar,
  History,
  Plus,
  Crown,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, signOut, isPro, upgradePlan } = useAuth()

  const [budget, setBudget] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [categories, setCategories] = useState([])
  const [activeTab, setActiveTab] = useState('today') // 'today' | 'analytics' | 'subscriptions' | 'history'

  // Modals
  const [addExpenseOpen, setAddExpenseOpen] = useState(false)
  const [customCategoryOpen, setCustomCategoryOpen] = useState(false)
  const [premiumModalOpen, setPremiumModalOpen] = useState(false)
  const [premiumHighlight, setPremiumHighlight] = useState('')
  const [limitAlert, setLimitAlert] = useState(false)
  const [proSuccessToast, setProSuccessToast] = useState(false)

  const refresh = () => {
    const b = store.getActiveBudget()
    if (!b) {
      navigate('/onboarding')
      return
    }
    setBudget(b)
    setExpenses(store.getExpenses())
    setCategories(store.getCategories())
  }

  useEffect(() => {
    refresh()

    // Handle return from Polar.sh Checkout
    if (searchParams.get('checkout') === 'success') {
      const plan = searchParams.get('plan') || 'monthly'
      upgradePlan(plan)
      setProSuccessToast(true)
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899'],
        })
      } catch (e) {}

      // Clean search params from URL
      setSearchParams({})
      setTimeout(() => setProSuccessToast(false), 5000)
    }
  }, [searchParams])

  if (!budget) return null

  const status = computeBudgetStatus(budget, expenses)
  const currency = budget.currency || '$'

  const handleOpenPremium = (featureName = '') => {
    setPremiumHighlight(featureName)
    setPremiumModalOpen(true)
  }

  const handleConfirmExpense = ({ amount, label, categoryId, paymentMethod, note }) => {
    try {
      store.addExpense({
        budgetId: budget.id,
        amount,
        label,
        categoryId,
        paymentMethod,
        note,
      })
      setAddExpenseOpen(false)
      refresh()
    } catch (err) {
      if (err.message === 'FREE_LIMIT_REACHED') {
        setAddExpenseOpen(false)
        setLimitAlert(true)
        handleOpenPremium('Unlimited Daily Spend Logging')
      }
    }
  }

  const handleSaveCustomCategory = (catData) => {
    store.addCustomCategory(catData)
    setCategories(store.getCategories())
  }

  const handleDeleteExpense = (id) => {
    store.deleteExpense(id)
    refresh()
  }

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  // Check period ended state
  if (status.periodEnded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-[var(--color-brand)]/20 text-[var(--color-brand)] flex items-center justify-center mb-4 text-2xl">
          🏁
        </div>
        <p className="font-mono text-xs tracking-[0.2em] text-[var(--color-text-dim)] uppercase mb-2">
          Period Complete
        </p>
        <h1 className="font-display text-3xl font-bold mb-2">
          You spent {currency}
          {status.totalSpent.toFixed(2)} of {currency}
          {status.totalBudget.toFixed(2)}
        </h1>
        <p className="text-sm text-[var(--color-text-dim)] mb-8 max-w-sm">
          {status.remainingBudget >= 0
            ? `Fantastic discipline! You finished ${currency}${status.remainingBudget.toFixed(2)} under your planned budget.`
            : `You went ${currency}${Math.abs(status.remainingBudget).toFixed(2)} over your target budget.`}
        </p>
        <button
          onClick={() => navigate('/onboarding')}
          className="px-8 py-3.5 rounded-2xl bg-[var(--color-brand)] text-[var(--color-ink)] font-bold text-sm hover:brightness-110 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
        >
          Start a new budget
        </button>
      </div>
    )
  }

  const todayExpensesCount = store.getTodayExpenses().length

  return (
    <div className="min-h-screen pb-32">
      {/* PRO SUCCESS TOAST (AFTER POLAR CHECKOUT) */}
      {proSuccessToast && (
        <div className="fixed top-5 inset-x-0 z-50 flex justify-center px-4 animate-bounce">
          <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-2xl shadow-amber-500/50">
            <CheckCircle2 size={18} />
            <span>Polar Payment Successful! Pro Member Superpowers Activated 👑</span>
          </div>
        </div>
      )}

      {/* TOP NAVBAR */}
      <Navbar onOpenPremium={handleOpenPremium} onSignOut={handleSignOut} />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-5 space-y-5">
        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0e131f] border border-[var(--color-line)] overflow-x-auto">
          {[
            { id: 'today', label: 'Today Dial', icon: Compass },
            { id: 'analytics', label: 'Analytics & AI', icon: PieChart },
            { id: 'subscriptions', label: 'Subscriptions', icon: Calendar },
            { id: 'history', label: 'History', icon: History },
          ].map((tab) => {
            const Icon = tab.icon
            const isSel = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isSel
                    ? 'bg-[var(--color-panel-elevated)] text-[var(--color-brand)] shadow-md border border-[var(--color-brand)]/30'
                    : 'text-[var(--color-text-dim)] hover:text-white'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* TAB 1: TODAY'S GAUGE VIEW */}
        {activeTab === 'today' && (
          <div className="space-y-4">
            {/* INSTRUMENT GAUGE CARD */}
            <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 flex flex-col items-center relative overflow-hidden">
              <AllowanceGauge status={status} currency={currency} />
            </div>

            {/* KEY METRICS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl bg-[#0e131f] border border-[var(--color-line)] p-4">
                <p className="text-[11px] text-[var(--color-text-faint)] uppercase font-mono tracking-wider">
                  Remaining Total
                </p>
                <p className="font-mono text-xl font-bold mt-1 text-white">
                  {currency}{status.remainingBudget.toFixed(2)}
                </p>
                <p className="text-[10px] text-[var(--color-text-dim)] mt-0.5">
                  of {currency}{status.totalBudget.toFixed(2)} total
                </p>
              </div>

              <div className="rounded-2xl bg-[#0e131f] border border-[var(--color-line)] p-4">
                <p className="text-[11px] text-[var(--color-text-faint)] uppercase font-mono tracking-wider">
                  Days Left
                </p>
                <p className="font-mono text-xl font-bold mt-1 text-white">
                  {status.daysRemaining} <span className="text-xs text-[var(--color-text-dim)] font-normal">days</span>
                </p>
                <p className="text-[10px] text-[var(--color-text-dim)] mt-0.5">
                  until period reset
                </p>
              </div>

              <div className="col-span-2 sm:col-span-1 rounded-2xl bg-[#0e131f] border border-[var(--color-line)] p-4">
                <p className="text-[11px] text-[var(--color-text-faint)] uppercase font-mono tracking-wider">
                  Tomorrow Preview
                </p>
                <p className="font-mono text-xl font-bold mt-1 text-[var(--color-safe)]">
                  {currency}{status.tomorrowsAllowanceIfStopNow.toFixed(2)}
                </p>
                <p className="text-[10px] text-[var(--color-text-dim)] mt-0.5">
                  if no more spend today
                </p>
              </div>
            </div>

            {/* FREE TIER DAILY QUOTA INFO */}
            {!isPro && (
              <div className="p-3 rounded-2xl bg-[#0e131f] border border-[var(--color-line)] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400">⚡</span>
                  <span className="text-[var(--color-text-dim)]">
                    Today's Free Spends: <strong className="text-white">{todayExpensesCount} / 5</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenPremium('Unlimited Expense Logging')}
                  className="text-xs text-[var(--color-brand)] font-bold hover:underline cursor-pointer"
                >
                  Unlock Unlimited ($1)
                </button>
              </div>
            )}

            {/* RECENT TRANSACTIONS */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-white">Today & Recent Spends</h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className="text-xs text-[var(--color-text-dim)] hover:text-white transition-colors cursor-pointer"
                >
                  View all →
                </button>
              </div>
              <ExpenseLog
                expenses={expenses.slice(0, 5)}
                categories={categories}
                currency={currency}
                onDelete={handleDeleteExpense}
                onOpenPremium={handleOpenPremium}
              />
            </div>
          </div>
        )}

        {/* TAB 2: ANALYTICS & AI INSIGHTS */}
        {activeTab === 'analytics' && (
          <AnalyticsView
            budget={budget}
            expenses={expenses}
            categories={categories}
            currency={currency}
            onOpenPremium={handleOpenPremium}
          />
        )}

        {/* TAB 3: RECURRING SUBSCRIPTIONS */}
        {activeTab === 'subscriptions' && (
          <SubscriptionsTracker
            currency={currency}
            onOpenPremium={handleOpenPremium}
          />
        )}

        {/* TAB 4: FULL HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-white">Full Spending History</h3>
                <p className="text-xs text-[var(--color-text-dim)]">
                  {expenses.length} total logged expenses
                </p>
              </div>
            </div>
            <ExpenseLog
              expenses={expenses}
              categories={categories}
              currency={currency}
              onDelete={handleDeleteExpense}
              onOpenPremium={handleOpenPremium}
            />
          </div>
        )}
      </main>

      {/* FLOATING ACTION BUTTON */}
      <div className="fixed bottom-6 inset-x-0 flex justify-center z-30 px-4 pointer-events-none">
        <button
          type="button"
          onClick={() => setAddExpenseOpen(true)}
          className="pointer-events-auto px-6 py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-[var(--color-ink)] font-bold text-sm shadow-2xl shadow-amber-500/40 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer"
        >
          <Plus size={18} strokeWidth={3} />
          <span>Log a Spend</span>
        </button>
      </div>

      {/* MODALS */}
      {addExpenseOpen && (
        <AddExpenseModal
          budget={budget}
          expenses={expenses}
          categories={categories}
          currency={currency}
          onClose={() => setAddExpenseOpen(false)}
          onConfirm={handleConfirmExpense}
          onOpenCustomCategory={() => {
            setAddExpenseOpen(false)
            setCustomCategoryOpen(true)
          }}
          onOpenPremium={handleOpenPremium}
        />
      )}

      {customCategoryOpen && (
        <CustomCategoryModal
          isOpen={customCategoryOpen}
          onClose={() => setCustomCategoryOpen(false)}
          onSave={handleSaveCustomCategory}
          onOpenPremium={handleOpenPremium}
        />
      )}

      <PremiumModal
        isOpen={premiumModalOpen}
        onClose={() => setPremiumModalOpen(false)}
        highlightFeature={premiumHighlight}
      />
    </div>
  )
}
