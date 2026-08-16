import { useState } from 'react'
import { canSpend } from '../lib/budgetEngine'
import { QUICK_PRESETS } from '../lib/categories'
import { useAuth } from '../context/AuthContext'
import {
  X,
  Plus,
  CreditCard,
  Banknote,
  Smartphone,
  Tag,
  AlertCircle,
  Sparkles,
  Lock,
} from 'lucide-react'

export default function AddExpenseModal({
  budget,
  expenses,
  categories,
  currency,
  onClose,
  onConfirm,
  onOpenCustomCategory,
  onOpenPremium,
}) {
  const { isPro } = useAuth()
  const [amount, setAmount] = useState('')
  const [label, setLabel] = useState('')
  const [note, setNote] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('tea') // Default to tea ☕
  const [paymentMethod, setPaymentMethod] = useState('cash')

  const numericAmount = Number(amount) || 0
  const check = numericAmount > 0 ? canSpend(budget, expenses, numericAmount) : null

  const handleApplyPreset = (preset) => {
    setAmount(preset.amount.toString())
    setSelectedCategoryId(preset.categoryId)
    setLabel(preset.label)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!numericAmount || numericAmount <= 0) return
    if (check && !check.allowed) return

    const selectedCategory = categories.find((c) => c.id === selectedCategoryId)
    const finalLabel = label.trim() || selectedCategory?.name || 'Spend'

    onConfirm({
      amount: numericAmount,
      label: finalLabel,
      categoryId: selectedCategoryId,
      paymentMethod,
      note: note.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg glass-panel-elevated rounded-3xl p-6 border border-[var(--color-line)] shadow-2xl my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[var(--color-text-dim)] hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <div className="mb-5">
          <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
            <span>Log a Spend</span>
          </h2>
          <p className="text-xs text-[var(--color-text-dim)]">Choose a category or tap a quick shortcut</p>
        </div>

        {/* QUICK SHORTCUT PRESETS */}
        <div className="mb-5">
          <p className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-faint)] mb-2">
            Quick Shortcuts
          </p>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {QUICK_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-[#0e131f] hover:bg-[#161f33] border border-[var(--color-line)] text-xs text-[var(--color-text)] flex items-center gap-1.5 transition-all hover:scale-105"
              >
                <span>{preset.icon}</span>
                <span className="font-medium">{preset.label}</span>
                <span className="text-[var(--color-text-faint)] font-mono">
                  {currency}{preset.amount}
                </span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* AMOUNT INPUT */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-dim)] mb-1.5">
              Spend Amount
            </label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#0e131f] border border-[var(--color-line)] focus-within:border-[var(--color-brand)] focus-within:ring-2 focus-within:ring-[var(--color-brand)]/20 transition-all">
              <span className="text-xl font-bold text-[var(--color-brand)] font-mono">{currency}</span>
              <input
                autoFocus
                type="number"
                inputMode="decimal"
                min="0.01"
                step="any"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-transparent outline-none font-mono text-2xl font-bold text-white placeholder-[var(--color-text-faint)]"
              />
            </div>
          </div>

          {/* CATEGORY SELECTOR WITH ICONS */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-[var(--color-text-dim)]">
                Category & Icon
              </label>
              <button
                type="button"
                onClick={onOpenCustomCategory}
                className="text-xs text-[var(--color-brand)] hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <Plus size={13} />
                <span>Custom Category</span>
                {!isPro && <Lock size={11} className="opacity-70" />}
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-44 overflow-y-auto p-1 bg-[#0a0e17] rounded-2xl border border-[var(--color-line)]">
              {categories.map((cat) => {
                const isSelected = selectedCategoryId === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`p-2 rounded-xl text-left transition-all flex items-center gap-2 border ${
                      isSelected
                        ? 'bg-[var(--color-panel-elevated)] border-[var(--color-brand)] ring-1 ring-[var(--color-brand)] text-white scale-[1.02]'
                        : 'bg-[#0e131f] border-[var(--color-line-subtle)] text-[var(--color-text-dim)] hover:bg-[#151f33]'
                    }`}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span className="text-xs font-medium truncate">{cat.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* DESCRIPTION / NOTE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-dim)] mb-1.5">
                Item / Description
              </label>
              <input
                type="text"
                placeholder="e.g. Afternoon Karak Tea"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e131f] border border-[var(--color-line)] text-xs text-white outline-none focus:border-[var(--color-brand)] transition-all"
              />
            </div>

            {/* PAYMENT METHOD SELECTOR */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-dim)] mb-1.5">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-1 bg-[#0e131f] p-1 rounded-xl border border-[var(--color-line)]">
                {[
                  { id: 'cash', label: 'Cash', icon: Banknote },
                  { id: 'card', label: 'Card', icon: CreditCard },
                  { id: 'wallet', label: 'Wallet', icon: Smartphone },
                ].map((pm) => {
                  const Icon = pm.icon
                  const isSel = paymentMethod === pm.id
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`py-1.5 text-[11px] font-medium rounded-lg flex items-center justify-center gap-1 transition-all ${
                        isSel
                          ? 'bg-[var(--color-panel-elevated)] text-[var(--color-brand)] shadow-sm'
                          : 'text-[var(--color-text-dim)] hover:text-white'
                      }`}
                    >
                      <Icon size={12} />
                      <span>{pm.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* BUDGET IMPACT WARNING / ADVICE */}
          {check?.reason && (
            <div
              className={`text-xs rounded-xl p-3 border flex items-start gap-2 ${
                check.allowed
                  ? 'bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.25)] text-[var(--color-warn)]'
                  : 'bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.25)] text-[var(--color-over)]'
              }`}
            >
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{check.reason}</span>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl border border-[var(--color-line)] text-xs font-semibold text-[var(--color-text-dim)] hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!numericAmount || (check && !check.allowed)}
              className="flex-1 py-3.5 rounded-2xl bg-[var(--color-brand)] text-[var(--color-ink)] font-bold text-xs hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[var(--color-brand)]/20 cursor-pointer"
            >
              {check && !check.allowed ? 'Exceeds Budget Limit' : 'Confirm Spend'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
