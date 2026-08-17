// categories.js
// Predefined rich categories with Figma emoji icons and modern styling

export const DEFAULT_CATEGORIES = [
  { id: 'rent', name: 'Rent', icon: '🏠', color: '#6366f1', budget: 1700, isCustom: false },
  { id: 'healthcare', name: 'Healthcare', icon: '❤️', color: '#ec4899', budget: 200, isCustom: false },
  { id: 'dining', name: 'Dining Out', icon: '🍣', color: '#f43f5e', budget: 250, isCustom: false },
  { id: 'entertainment', name: 'Entertainment', icon: '🍺', color: '#f59e0b', budget: 200, isCustom: false },
  { id: 'groceries', name: 'Groceries', icon: '🍎', color: '#10b981', budget: 500, isCustom: false },
  { id: 'tea', name: 'Tea / Chai', icon: '☕', color: '#d97706', budget: 50, isCustom: false },
  { id: 'coffee', name: 'Coffee & Cafe', icon: '🍵', color: '#059669', budget: 60, isCustom: false },
  { id: 'transport', name: 'Transport & Fuel', icon: '🚗', color: '#3b82f6', budget: 150, isCustom: false },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#8b5cf6', budget: 150, isCustom: false },
  { id: 'bills', name: 'Bills & Utilities', icon: '💡', color: '#06b6d4', budget: 100, isCustom: false },
  { id: 'other', name: 'Other / General', icon: '🏷️', color: '#94a3b8', budget: 90, isCustom: false },
]

export const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Salary', icon: '💼', color: '#22c55e' },
  { id: 'freelance', name: 'Freelance', icon: '💻', color: '#10b981' },
  { id: 'investments', name: 'Investments / Dividends', icon: '📈', color: '#3b82f6' },
  { id: 'gift_income', name: 'Gifts & Bonus', icon: '🎁', color: '#f59e0b' },
  { id: 'other_income', name: 'Other Income', icon: '💵', color: '#8b5cf6' },
]

export const EMOJI_PICKER_OPTIONS = [
  '🏠', '❤️', '🍣', '🍺', '🍎', '☕', '🍵', '🍔', '🍕', '🌮', '🍜', '🍩',
  '🛒', '🚗', '⛽', '🚕', '🚌', '🛍️', '💡', '🎬', '🎮', '🎵', '💊', '🏥',
  '🏋️', '📚', '✈️', '🎁', '📱', '💼', '🪙', '💳', '💵', '🐾', '🪴', '🏷️'
]

export const COLOR_OPTIONS = [
  '#6366f1', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#3b82f6',
  '#8b5cf6', '#06b6d4', '#d97706', '#059669', '#22c55e', '#64748b'
]

export function getCategoryById(categories, id) {
  const all = [...(categories || DEFAULT_CATEGORIES), ...INCOME_CATEGORIES]
  return all.find((c) => c.id === id) || {
    id: 'other',
    name: 'General',
    icon: '🏷️',
    color: '#94a3b8',
  }
}
