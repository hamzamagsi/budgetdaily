import { useState } from 'react'
import { store } from '../lib/store'
import { ArrowLeft, Check, Sparkles, X } from 'lucide-react'

export const FIGMA_ICONS = [
  '👽', '🤖', '🍎', '🍏', '🎨', '🎖️', '💼', '🏛️',
  '🏀', '👧', '🍺', '🚲', '🪙', '🦴', '📗', '🍔',
  '🗓️', '📷', '🦯', '🐱', '☕', '📜', '📊', '🧀',
  '♞', '🖲️', '🌲', '🕒', '🏠', '❤️', '🍣', '✈️'
]

export const FIGMA_COLORS = [
  '#6c5ce7', '#ff6b6b', '#10b981', '#3b82f6',
  '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6'
]

export default function CustomCategoryModal({ isOpen, onClose, onCreated }) {
  if (!isOpen) return null

  const [selectedIcon, setSelectedIcon] = useState('🎨')
  const [selectedColor, setSelectedColor] = useState('#6c5ce7')
  const [name, setName] = useState('')
  const [budget, setBudget] = useState('150')
  const [error, setError] = useState('')

  const handleSave = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter a category name')
      return
    }

    store.addCustomCategory({
      name: name.trim(),
      icon: selectedIcon,
      color: selectedColor,
      budget: Number(budget) || 100,
    })

    onCreated?.()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#e8e4f5] animate-in fade-in zoom-in-95">
        {/* HEADER (FIGMA SCREEN 3) */}
        <div className="flex items-center justify-between pb-4 border-b border-[#f1edf9] mb-4">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-bold text-[#6c5ce7] hover:opacity-80 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <h3 className="text-sm font-bold text-[#1f2430]">Choose a category icon</h3>
          <div className="w-6" />
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* ICON PICKER GRID (FIGMA SCREEN 3) */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] mb-2">
              Select Icon
            </label>
            <div className="grid grid-cols-4 gap-2.5 p-3 rounded-2xl bg-[#f8f6ff] border border-[#e8e4f5] max-h-48 overflow-y-auto">
              {FIGMA_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`h-11 rounded-xl text-2xl flex items-center justify-center transition-all cursor-pointer ${
                    selectedIcon === icon
                      ? 'bg-white border-2 border-[#6c5ce7] shadow-sm scale-105'
                      : 'hover:bg-white/80'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* CATEGORY NAME */}
          <div>
            <label className="block text-xs font-semibold text-[#64748b] mb-1">
              Category Name
            </label>
            <div className="flex items-center gap-2">
              <span className="w-10 h-10 rounded-xl bg-[#f8f6ff] border border-[#e8e4f5] flex items-center justify-center text-xl shrink-0">
                {selectedIcon}
              </span>
              <input
                type="text"
                required
                placeholder="e.g. Gaming, Snacks, Gym..."
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError('')
                }}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#f8f6ff] border border-[#e8e4f5] text-[#1f2430] outline-none focus:border-[#6c5ce7]"
              />
            </div>
          </div>

          {/* MONTHLY BUDGET LIMIT */}
          <div>
            <label className="block text-xs font-semibold text-[#64748b] mb-1">
              Monthly Limit ($)
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#f8f6ff] border border-[#e8e4f5] text-[#1f2430] outline-none focus:border-[#6c5ce7] font-mono font-bold"
            />
          </div>

          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#6c5ce7] hover:bg-[#5849cf] text-white text-xs font-bold shadow-lg shadow-[#6c5ce7]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Check size={16} />
            <span>Create Category</span>
          </button>
        </form>
      </div>
    </div>
  )
}
