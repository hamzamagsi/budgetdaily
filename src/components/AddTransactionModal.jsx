import { useState } from 'react'
import { store } from '../lib/store'
import { DEFAULT_CATEGORIES, INCOME_CATEGORIES, getCategoryById } from '../lib/categories'
import {
  ArrowLeft,
  Calendar,
  Wallet,
  Tag,
  Repeat,
  Bell,
  Check,
  ChevronRight,
  Calculator,
  X,
} from 'lucide-react'

export default function AddTransactionModal({ isOpen, onClose, onAdded, onUpgradeClick }) {
  if (!isOpen) return null

  const [type, setType] = useState('expense') // 'expense' | 'income'
  const [calcDisplay, setCalcDisplay] = useState('0')
  const [note, setNote] = useState('')
  const [categoryId, setCategoryId] = useState('dining')
  const [accountId, setAccountId] = useState('default')
  const [isRecurring, setIsRecurring] = useState(false)
  const [showCategoryPicker, setShowCategoryPicker] = useState(false)
  const [error, setError] = useState('')

  const accounts = store.getAccounts()
  const currentAccount = accounts.find((a) => a.id === accountId) || accounts[0]

  const categories = type === 'expense' ? store.getCategories() : INCOME_CATEGORIES
  const selectedCategory = getCategoryById(categories, categoryId)

  // Current Date formatted as "Sun 11 Aug 24  09:24 am"
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date())

  // Calculator Keypad Logic
  const handleKeypadPress = (key) => {
    setError('')
    if (key === 'AC') {
      setCalcDisplay('0')
      return
    }

    if (key === 'DEL') {
      if (calcDisplay.length <= 1) {
        setCalcDisplay('0')
      } else {
        setCalcDisplay(calcDisplay.slice(0, -1))
      }
      return
    }

    if (key === '=') {
      try {
        // Safe evaluation of simple arithmetic (+, -, *, /)
        const sanitized = calcDisplay.replace(/×/g, '*').replace(/÷/g, '/')
        // Only allow digits, operators, and decimals
        if (/^[0-9+\-*/. ]+$/.test(sanitized)) {
          // eslint-disable-next-line no-eval
          const result = Function(`'use strict'; return (${sanitized})`)()
          if (!isNaN(result) && isFinite(result)) {
            setCalcDisplay(String(Math.round(result * 100) / 100))
          }
        }
      } catch (err) {
        console.warn('Calc eval error:', err)
      }
      return
    }

    // Numbers & operators
    if (calcDisplay === '0' && !['+', '-', '×', '÷', '.'].includes(key)) {
      setCalcDisplay(key)
    } else {
      setCalcDisplay(calcDisplay + key)
    }
  }

  // Submit Transaction
  const handleSubmit = () => {
    let finalAmount = 0
    try {
      const sanitized = calcDisplay.replace(/×/g, '*').replace(/÷/g, '/')
      // eslint-disable-next-line no-eval
      const evaled = Function(`'use strict'; return (${sanitized})`)()
      finalAmount = Number(evaled) || 0
    } catch (e) {
      finalAmount = parseFloat(calcDisplay) || 0
    }

    if (finalAmount <= 0) {
      setError('Please enter a valid amount greater than $0')
      return
    }

    try {
      store.addTransaction({
        type,
        amount: finalAmount,
        categoryId: selectedCategory.id,
        note: note.trim() || selectedCategory.name,
        accountId: currentAccount.id,
        recurring: isRecurring,
        date: new Date().toISOString(),
      })

      onAdded?.()
      onClose()
    } catch (err) {
      if (err.message === 'FREE_LIMIT_REACHED') {
        onClose()
        onUpgradeClick?.('Unlimited Daily Spend Logging')
      } else {
        setError('Could not save transaction. Please try again.')
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#e8e4f5] my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="flex items-center justify-between pb-3 border-b border-[#f1edf9]">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 text-xs font-semibold text-[#6c5ce7] hover:opacity-80 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Cancel</span>
          </button>

          <h3 className="text-sm font-bold text-[#1f2430]">Add transaction</h3>

          <div className="flex items-center gap-2 text-[#94a3b8]">
            <button
              type="button"
              onClick={() => setIsRecurring(!isRecurring)}
              title="Toggle recurring"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isRecurring ? 'bg-[#ede9fe] text-[#6c5ce7]' : 'hover:bg-[#f8f6ff]'
              }`}
            >
              <Repeat size={15} />
            </button>
            <button
              type="button"
              onClick={() => setShowCategoryPicker(true)}
              title="Category tags"
              className="p-1.5 rounded-lg hover:bg-[#f8f6ff] transition-colors cursor-pointer"
            >
              <Tag size={15} />
            </button>
          </div>
        </div>

        {/* DATE & TIME BADGE */}
        <div className="flex items-center justify-center gap-2 py-3 text-xs text-[#64748b] font-medium">
          <Calendar size={14} className="text-[#6c5ce7]" />
          <span>{formattedDate}</span>
        </div>

        {/* EXPENSE / INCOME TOGGLE PILLS */}
        <div className="flex items-center justify-center gap-6 my-2">
          <label
            onClick={() => {
              setType('expense')
              setCategoryId('dining')
            }}
            className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none"
          >
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center border-2 transition-all ${
                type === 'expense'
                  ? 'border-[#6c5ce7] bg-[#6c5ce7]'
                  : 'border-[#cbd5e1] bg-white'
              }`}
            >
              {type === 'expense' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <span className={type === 'expense' ? 'text-[#1f2430]' : 'text-[#94a3b8]'}>
              Expense
            </span>
          </label>

          <label
            onClick={() => {
              setType('income')
              setCategoryId('salary')
            }}
            className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none"
          >
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center border-2 transition-all ${
                type === 'income'
                  ? 'border-[#6c5ce7] bg-[#6c5ce7]'
                  : 'border-[#cbd5e1] bg-white'
              }`}
            >
              {type === 'income' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <span className={type === 'income' ? 'text-[#1f2430]' : 'text-[#94a3b8]'}>
              Income
            </span>
          </label>
        </div>

        {/* ACCOUNT SELECTOR */}
        <div className="mt-3">
          <label className="block text-[11px] font-semibold text-[#64748b] mb-1">Account</label>
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#f8f6ff] border border-[#e8e4f5]">
            <div className="flex items-center gap-2.5">
              <span className="text-base">{currentAccount.icon}</span>
              <span className="text-xs font-bold text-[#1f2430]">{currentAccount.name}</span>
            </div>
            <ChevronRight size={16} className="text-[#94a3b8]" />
          </div>
        </div>

        {/* AMOUNT INPUT BOX (FIGMA BLUE-MINT PILL) */}
        <div className="mt-3">
          <label className="block text-[11px] font-semibold text-[#64748b] mb-1">Amount</label>
          <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[#e6f4f1] border border-[#c7ede4] text-[#0f766e]">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-mono">$</span>
              <span className="text-2xl font-extrabold font-mono tracking-tight">
                {calcDisplay}
              </span>
            </div>
            <Calculator size={18} className="text-[#0d9488]" />
          </div>
        </div>

        {/* NOTES INPUT */}
        <div className="mt-3">
          <label className="block text-[11px] font-semibold text-[#64748b] mb-1">
            Notes (optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Sushi, Coffee, Petrol..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-[#f8f6ff] border border-[#e8e4f5] text-[#1f2430] outline-none focus:border-[#6c5ce7]"
          />
        </div>

        {/* CATEGORY PICKER ROW */}
        <div className="mt-3 mb-4">
          <label className="block text-[11px] font-semibold text-[#64748b] mb-1">Category</label>
          <div
            onClick={() => setShowCategoryPicker(true)}
            className="flex items-center justify-between p-3 rounded-2xl bg-[#f8f6ff] border border-[#e8e4f5] cursor-pointer hover:border-[#6c5ce7] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">{selectedCategory.icon}</span>
              <span className="text-xs font-bold text-[#1f2430]">{selectedCategory.name}</span>
            </div>
            <ChevronRight size={16} className="text-[#94a3b8]" />
          </div>
        </div>

        {/* CALCULATOR KEYPAD (FIGMA SCREEN 2) */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#f1edf9]">
          <button type="button" onClick={() => handleKeypadPress('AC')} className="calc-btn calc-btn-action py-2.5 text-xs">
            AC
          </button>
          <button type="button" onClick={() => handleKeypadPress('÷')} className="calc-btn calc-btn-action py-2.5 text-sm">
            ÷
          </button>
          <button type="button" onClick={() => handleKeypadPress('×')} className="calc-btn calc-btn-action py-2.5 text-sm">
            ×
          </button>
          <button type="button" onClick={() => handleKeypadPress('DEL')} className="calc-btn calc-btn-action py-2.5 text-xs">
            del
          </button>

          <button type="button" onClick={() => handleKeypadPress('7')} className="calc-btn py-2.5 text-sm">
            7
          </button>
          <button type="button" onClick={() => handleKeypadPress('8')} className="calc-btn py-2.5 text-sm">
            8
          </button>
          <button type="button" onClick={() => handleKeypadPress('9')} className="calc-btn py-2.5 text-sm">
            9
          </button>
          <button type="button" onClick={() => handleKeypadPress('-')} className="calc-btn calc-btn-action py-2.5 text-sm">
            -
          </button>

          <button type="button" onClick={() => handleKeypadPress('4')} className="calc-btn py-2.5 text-sm">
            4
          </button>
          <button type="button" onClick={() => handleKeypadPress('5')} className="calc-btn py-2.5 text-sm">
            5
          </button>
          <button type="button" onClick={() => handleKeypadPress('6')} className="calc-btn py-2.5 text-sm">
            6
          </button>
          <button type="button" onClick={() => handleKeypadPress('+')} className="calc-btn calc-btn-action py-2.5 text-sm">
            +
          </button>

          <button type="button" onClick={() => handleKeypadPress('1')} className="calc-btn py-2.5 text-sm">
            1
          </button>
          <button type="button" onClick={() => handleKeypadPress('2')} className="calc-btn py-2.5 text-sm">
            2
          </button>
          <button type="button" onClick={() => handleKeypadPress('3')} className="calc-btn py-2.5 text-sm">
            3
          </button>
          <button type="button" onClick={() => handleKeypadPress('=')} className="calc-btn calc-btn-equal py-2.5 text-sm row-span-2">
            =
          </button>

          <button type="button" onClick={() => handleKeypadPress('0')} className="calc-btn py-2.5 text-sm col-span-2">
            0
          </button>
          <button type="button" onClick={() => handleKeypadPress('.')} className="calc-btn py-2.5 text-sm">
            .
          </button>
        </div>

        {error && <p className="text-center text-xs text-red-500 font-medium mt-2">{error}</p>}

        {/* SAVE BUTTON */}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full py-3.5 mt-3 rounded-2xl bg-[#6c5ce7] hover:bg-[#5849cf] text-white text-xs font-bold shadow-lg shadow-[#6c5ce7]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Check size={16} />
          <span>Save {type === 'expense' ? 'Expense' : 'Income'}</span>
        </button>
      </div>

      {/* CATEGORY PICKER SHEET */}
      {showCategoryPicker && (
        <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-3 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#e8e4f5]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#f1edf9]">
              <h4 className="text-xs font-bold text-[#1f2430]">Select Category</h4>
              <button
                type="button"
                onClick={() => setShowCategoryPicker(false)}
                className="p-1 rounded-full text-[#94a3b8] hover:text-[#1f2430]"
              >
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
              {categories.map((cat) => {
                const isSelected = selectedCategory.id === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCategoryId(cat.id)
                      setShowCategoryPicker(false)
                    }}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl text-left text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#ede9fe] text-[#6c5ce7] font-bold border border-[#ddd6fe]'
                        : 'bg-[#f8f6ff] text-[#334155] hover:bg-[#f1edf9]'
                    }`}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span className="truncate">{cat.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
