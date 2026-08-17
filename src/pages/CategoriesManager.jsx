import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { store } from '../lib/store'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import AddTransactionModal from '../components/AddTransactionModal'
import PremiumModal from '../components/PremiumModal'
import {
  ArrowLeft,
  Tag,
  Plus,
  Trash2,
  Check,
  Sparkles,
  ChevronRight,
  X,
} from 'lucide-react'

// All icons from Figma Screen 3
const FIGMA_CATEGORY_ICONS = [
  '👽', '🤖', '🍎', '🍏', '🎨', '🎖️', '💼', '🏛️',
  '🏀', '👧', '🍺', '🚲', '₿', '🦴', '📗', '🍔',
  '📅', '📷', '🍬', '🐱', '🪙', '📜', '📊', '🧀',
  '♞', '🔲', '🌲', '🕒', '☕', '🍵', '🏠', '❤️',
  '🍣', '✈️', '🎁', '📱', '🎮', '🚗', '🛍️', '💡',
]

export default function CategoriesManager() {
  const navigate = useNavigate()
  const { isPro } = useAuth()

  const [categories, setCategories] = useState(store.getCategories())
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false)

  // Custom Category Creation Form States
  const [isCreating, setIsCreating] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('🎨')
  const [categoryBudget, setCategoryBudget] = useState(150)
  const [error, setError] = useState('')

  const handleCreateCategory = (e) => {
    e.preventDefault()
    setError('')

    if (!categoryName.trim()) {
      setError('Please enter a category name')
      return
    }

    if (!isPro && categories.filter((c) => c.isCustom).length >= 1) {
      setIsPremiumModalOpen(true)
      return
    }

    store.addCustomCategory({
      name: categoryName.trim(),
      icon: selectedIcon,
      budget: Number(categoryBudget) || 150,
      color: '#6c5ce7',
    })

    setCategories(store.getCategories())
    setIsCreating(false)
    setCategoryName('')
    setSelectedIcon('🎨')
  }

  const handleDeleteCategory = (catId) => {
    store.deleteCustomCategory(catId)
    setCategories(store.getCategories())
  }

  return (
    <div className="min-h-screen pb-28 sm:pb-12 bg-[#f3f0ff]">
      <Navbar
        onOpenAddTransaction={() => setIsAddModalOpen(true)}
        onUpgradeClick={() => setIsPremiumModalOpen(true)}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-4">
        {/* TOP HEADER */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#6c5ce7] hover:opacity-80 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          <h2 className="text-sm font-bold text-[#1f2430]">Custom Categories</h2>

          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#6c5ce7] text-white text-xs font-bold shadow-xs hover:bg-[#5849cf] transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>New Category</span>
          </button>
        </div>

        {/* CREATE CATEGORY MODAL / SHEET (FIGMA SCREEN 3) */}
        {isCreating && (
          <div className="figma-card p-5 sm:p-6 space-y-4 border-2 border-[#6c5ce7]">
            <div className="flex items-center justify-between pb-2 border-b border-[#f1edf9]">
              <h3 className="text-xs font-bold text-[#1f2430] uppercase tracking-wider">
                Create Your Own Category
              </h3>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="p-1 text-[#94a3b8] hover:text-[#1f2430]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#64748b] mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ice Cream, Gaming, Skateboarding..."
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#f8f6ff] border border-[#e8e4f5] text-xs text-[#1f2430] outline-none focus:border-[#6c5ce7]"
                />
              </div>

              {/* ICON PICKER GRID (FIGMA SCREEN 3) */}
              <div>
                <label className="block text-xs font-semibold text-[#64748b] mb-2">
                  Choose a category icon
                </label>
                <div className="grid grid-cols-8 sm:grid-cols-10 gap-2 max-h-48 overflow-y-auto p-2 rounded-2xl bg-[#f8f6ff] border border-[#e8e4f5]">
                  {FIGMA_CATEGORY_ICONS.map((icon) => {
                    const isSelected = selectedIcon === icon
                    return (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setSelectedIcon(icon)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#6c5ce7] text-white shadow-md scale-110'
                            : 'hover:bg-white text-[#334155]'
                        }`}
                      >
                        {icon}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#64748b] mb-1">
                  Monthly Budget Limit ($)
                </label>
                <input
                  type="number"
                  value={categoryBudget}
                  onChange={(e) => setCategoryBudget(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#f8f6ff] border border-[#e8e4f5] text-xs text-[#1f2430] outline-none focus:border-[#6c5ce7] font-mono"
                />
              </div>

              {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#6c5ce7] hover:bg-[#5849cf] text-white text-xs font-bold shadow-md shadow-[#6c5ce7]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Check size={16} />
                <span>Save Category</span>
              </button>
            </form>
          </div>
        )}

        {/* CATEGORIES GRID */}
        <div className="figma-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#f1edf9]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
              All Categories ({categories.length})
            </h4>
            <span className="text-xs text-[#6c5ce7] font-semibold">
              {categories.filter((c) => c.isCustom).length} Custom
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f8f6ff] border border-[#e8e4f5] hover:border-[#6c5ce7]/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#e8e4f5] flex items-center justify-center text-xl shadow-xs">
                    {cat.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1f2430]">{cat.name}</p>
                    <p className="text-[10px] text-[#64748b] font-mono">
                      Budget: ${cat.budget || 150} / mo
                    </p>
                  </div>
                </div>

                {cat.isCustom && (
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat.id)}
                    title="Delete category"
                    className="p-1.5 rounded-lg text-[#94a3b8] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav onOpenAddTransaction={() => setIsAddModalOpen(true)} />

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />
    </div>
  )
}
