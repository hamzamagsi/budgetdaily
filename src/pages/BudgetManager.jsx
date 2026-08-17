import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { store } from '../lib/store'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import AddTransactionModal from '../components/AddTransactionModal'
import PremiumModal from '../components/PremiumModal'
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  Trash2,
  Check,
  Sparkles,
  Wallet,
} from 'lucide-react'

export default function BudgetManager() {
  const navigate = useNavigate()
  const [budget, setBudget] = useState(store.getActiveBudget())
  const [categoryBudgets, setCategoryBudgets] = useState(store.getCategoryBudgets())
  const [categories, setCategories] = useState(store.getCategories())
  const [activeAccount, setActiveAccount] = useState(store.getActiveAccount())

  const [mode, setMode] = useState(budget?.mode || 'budget') // 'budget' | 'goal'
  const [totalAmount, setTotalAmount] = useState(budget?.totalAmount || 4500)
  const [categoryBudgetEnabled, setCategoryBudgetEnabled] = useState(
    budget?.categoryBudgetEnabled ?? true
  )

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false)
  const [saveToast, setSaveToast] = useState(false)

  // Calculate total allocated sum across categories
  const totalAllocated = Object.entries(categoryBudgets).reduce((sum, [catId, val]) => {
    return sum + (Number(val) || 0)
  }, 0)

  const handleCategoryAmountChange = (catId, val) => {
    const num = Math.max(0, Number(val) || 0)
    const updated = { ...categoryBudgets, [catId]: num }
    setCategoryBudgets(updated)
    store.setCategoryBudget(catId, num)
  }

  const handleSaveBudget = () => {
    store.updateBudget({
      totalAmount: Number(totalAmount) || 4500,
      mode,
      categoryBudgetEnabled,
    })
    setSaveToast(true)
    setTimeout(() => setSaveToast(false), 2000)
  }

  return (
    <div className="min-h-screen pb-28 sm:pb-12 bg-[#f3f0ff]">
      <Navbar
        onOpenAddTransaction={() => setIsAddModalOpen(true)}
        onUpgradeClick={() => setIsPremiumModalOpen(true)}
      />

      <main className="max-w-xl mx-auto px-4 pt-4 sm:pt-6 space-y-4">
        {/* TOP HEADER: PERIOD PICKER & ACTIONS (FIGMA SCREEN 3) */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#6c5ce7] hover:opacity-80 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border border-[#e8e4f5] text-xs font-bold text-[#1f2430] shadow-xs">
            <span>01 Aug 24 - 31 Aug 24</span>
            <ChevronDown size={14} className="text-[#94a3b8]" />
          </div>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset this budget period?')) {
                setTotalAmount(4500)
                handleSaveBudget()
              }
            }}
            title="Reset period"
            className="p-2 rounded-xl bg-white border border-[#e8e4f5] text-[#94a3b8] hover:text-red-500 transition-colors cursor-pointer shadow-xs"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* ACCOUNT SELECTOR PILL */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#e8e4f5] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-base">{activeAccount.icon}</span>
            <span className="text-xs font-bold text-[#1f2430]">{activeAccount.name}</span>
          </div>
          <span className="text-xs font-mono font-semibold text-[#64748b]">
            ${activeAccount.balance.toFixed(2)}
          </span>
        </div>

        {/* BUDGET VS GOAL TOGGLE TABS */}
        <div className="flex rounded-2xl bg-[#e2deef] p-1 border border-[#d8d3e8]">
          <button
            type="button"
            onClick={() => setMode('budget')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'budget'
                ? 'bg-[#6c5ce7] text-white shadow-md shadow-[#6c5ce7]/20'
                : 'text-[#64748b] hover:text-[#1f2430]'
            }`}
          >
            Budget
          </button>
          <button
            type="button"
            onClick={() => setMode('goal')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'goal'
                ? 'bg-[#6c5ce7] text-white shadow-md shadow-[#6c5ce7]/20'
                : 'text-[#64748b] hover:text-[#1f2430]'
            }`}
          >
            Goal
          </button>
        </div>

        {/* TOTAL BUDGET AMOUNT INPUT (FIGMA SCREEN 3) */}
        <div>
          <label className="block text-xs font-semibold text-[#64748b] mb-1.5">
            {mode === 'budget' ? 'Total Period Budget' : 'Target Savings Goal'}
          </label>
          <div className="flex items-center justify-between px-5 py-4 rounded-3xl bg-[#e6f4f1] border border-[#c7ede4] text-[#0f766e]">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono">$</span>
              <input
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight bg-transparent border-none outline-none w-48 text-[#0f766e]"
              />
            </div>
          </div>
        </div>

        {/* "SET CATEGORY BUDGET" TOGGLE SWITCH */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#e8e4f5] shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#ede9fe] text-[#6c5ce7] flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1f2430]">Set category budget</p>
              <p className="text-[10px] text-[#64748b]">Allocate specific limits per category</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={categoryBudgetEnabled}
              onChange={(e) => setCategoryBudgetEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6c5ce7]"></div>
          </label>
        </div>

        {/* CATEGORY ALLOCATION ROWS (FIGMA SCREEN 3) */}
        {categoryBudgetEnabled && (
          <div className="figma-card p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
              Category Allocations
            </h4>

            <div className="space-y-2.5">
              {categories.map((cat) => {
                const amount = categoryBudgets[cat.id] ?? cat.budget ?? 0
                return (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-[#f8f6ff] border border-[#e8e4f5]"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-xs font-bold text-[#1f2430]">{cat.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#e6f4f1] border border-[#c7ede4] text-[#0f766e] text-xs font-mono font-bold">
                      <span>$</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => handleCategoryAmountChange(cat.id, e.target.value)}
                        className="w-16 bg-transparent border-none outline-none text-right font-bold text-xs text-[#0f766e]"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* STICKY BOTTOM SUMMARY BAR (FIGMA SCREEN 3) */}
        <div className="p-4 rounded-2xl bg-[#6c5ce7] text-white flex items-center justify-between shadow-lg shadow-[#6c5ce7]/30">
          <div>
            <p className="text-[10px] text-white/80 font-medium">Total Allocated</p>
            <p className="text-sm font-bold font-mono">
              ${totalAllocated.toLocaleString('en-US', { minimumFractionDigits: 2 })} out of $
              {Number(totalAmount).toLocaleString('en-US')}
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveBudget}
            className="px-4 py-2 rounded-xl bg-white text-[#6c5ce7] text-xs font-bold hover:bg-white/90 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Check size={15} />
            <span>{saveToast ? 'Saved!' : 'Save Budget'}</span>
          </button>
        </div>
      </main>

      <BottomNav onOpenAddTransaction={() => setIsAddModalOpen(true)} />

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdded={() => {
          setBudget(store.getActiveBudget())
          setCategoryBudgets(store.getCategoryBudgets())
        }}
      />

      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />
    </div>
  )
}
