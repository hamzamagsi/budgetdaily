import { useState } from 'react'
import { EMOJI_PICKER_OPTIONS, COLOR_OPTIONS } from '../lib/categories'
import { useAuth } from '../context/AuthContext'
import { X, Sparkles, Plus, Crown } from 'lucide-react'

export default function CustomCategoryModal({ isOpen, onClose, onSave, onOpenPremium }) {
  const { isPro } = useAuth()
  const [name, setName] = useState('')
  const [selectedEmoji, setSelectedEmoji] = useState('☕')
  const [selectedColor, setSelectedColor] = useState('#f59e0b')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isPro) {
      onOpenPremium('Custom Categories & Icon Maker')
      return
    }

    if (!name.trim()) {
      setError('Please enter a category name')
      return
    }

    onSave({
      name: name.trim(),
      icon: selectedEmoji,
      color: selectedColor,
    })
    setName('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-md glass-panel-elevated rounded-3xl p-6 border border-[var(--color-line)] shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[var(--color-text-dim)] hover:text-white transition-colors"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-[var(--color-brand)]/15 border border-[var(--color-brand)]/30 flex items-center justify-center text-[var(--color-brand)]">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <span>Create Custom Category</span>
              {!isPro && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-brand)] text-[var(--color-ink)] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Crown size={10} /> PRO
                </span>
              )}
            </h3>
            <p className="text-xs text-[var(--color-text-dim)]">Customize your own icon, name, and color</p>
          </div>
        </div>

        {!isPro && (
          <div className="p-3.5 rounded-2xl bg-[rgba(245,158,11,0.12)] border border-[rgba(245,158,11,0.25)] mb-5 text-xs text-[var(--color-brand)] flex items-center justify-between">
            <span>Unlock unlimited custom categories with Pro ($1/mo)</span>
            <button
              type="button"
              onClick={() => onOpenPremium('Custom Categories')}
              className="px-2.5 py-1 rounded-lg bg-[var(--color-brand)] text-[var(--color-ink)] font-bold text-[11px] hover:brightness-110"
            >
              Upgrade
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Preview Badge */}
          <div className="flex items-center justify-center py-4 bg-[#0e131f] rounded-2xl border border-[var(--color-line)]">
            <div
              className="px-4 py-2 rounded-2xl flex items-center gap-2.5 border"
              style={{
                background: `${selectedColor}18`,
                borderColor: `${selectedColor}50`,
                color: '#ffffff',
              }}
            >
              <span className="text-2xl">{selectedEmoji}</span>
              <span className="font-medium text-sm">{name || 'Your Category Name'}</span>
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-dim)] mb-1.5">
              Category Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Chai & Snacks, Gaming, Gym"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0e131f] border border-[var(--color-line)] text-sm text-white outline-none focus:border-[var(--color-brand)] transition-all"
            />
            {error && <p className="text-xs text-[var(--color-over)] mt-1">{error}</p>}
          </div>

          {/* Emoji Picker Grid */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-dim)] mb-1.5">
              Choose Icon / Emoji
            </label>
            <div className="grid grid-cols-8 gap-1.5 p-2 bg-[#0e131f] rounded-xl border border-[var(--color-line)] max-h-36 overflow-y-auto">
              {EMOJI_PICKER_OPTIONS.map((emoji, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                    selectedEmoji === emoji
                      ? 'bg-[var(--color-panel-elevated)] ring-2 ring-[var(--color-brand)] scale-110'
                      : 'hover:bg-white/5'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-dim)] mb-1.5">
              Choose Color Tag
            </label>
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-7 h-7 rounded-full shrink-0 transition-transform ${
                    selectedColor === color ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#0e131f]' : 'hover:scale-110'
                  }`}
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[var(--color-line)] text-xs text-[var(--color-text-dim)] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[var(--color-brand)] text-[var(--color-ink)] font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-[var(--color-brand)]/20"
            >
              <Plus size={16} />
              <span>Save Category</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
