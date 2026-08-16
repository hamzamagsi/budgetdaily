// categories.js
// Predefined rich categories with emoji icons and modern styling

export const DEFAULT_CATEGORIES = [
  { id: 'tea', name: 'Tea / Chai', icon: '☕', color: '#f59e0b', isCustom: false },
  { id: 'coffee', name: 'Coffee & Cafe', icon: '🍵', color: '#d97706', isCustom: false },
  { id: 'food', name: 'Food & Dining', icon: '🍔', color: '#ef4444', isCustom: false },
  { id: 'groceries', name: 'Groceries', icon: '🛒', color: '#10b981', isCustom: false },
  { id: 'transport', name: 'Fuel & Transport', icon: '🚗', color: '#3b82f6', isCustom: false },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#ec4899', isCustom: false },
  { id: 'bills', name: 'Bills & Utilities', icon: '💡', color: '#8b5cf6', isCustom: false },
  { id: 'entertainment', name: 'Fun & Movies', icon: '🎬', color: '#a855f7', isCustom: false },
  { id: 'health', name: 'Health & Pharmacy', icon: '💊', color: '#06b6d4', isCustom: false },
  { id: 'fitness', name: 'Gym & Fitness', icon: '🏋️', color: '#14b8a6', isCustom: false },
  { id: 'education', name: 'Education & Books', icon: '📚', color: '#6366f1', isCustom: false },
  { id: 'travel', name: 'Travel & Trips', icon: '✈️', color: '#0ea5e9', isCustom: false },
  { id: 'gifts', name: 'Gifts & Charity', icon: '🎁', color: '#f43f5e', isCustom: false },
  { id: 'tech', name: 'Tech & Gadgets', icon: '📱', color: '#64748b', isCustom: false },
  { id: 'work', name: 'Work & Office', icon: '💼', color: '#78716c', isCustom: false },
  { id: 'pets', name: 'Pets & Animals', icon: '🐾', color: '#eab308', isCustom: false },
  { id: 'other', name: 'Other / General', icon: '🏷️', color: '#94a3b8', isCustom: false },
]

export const QUICK_PRESETS = [
  { label: 'Tea / Chai', amount: 1.5, categoryId: 'tea', icon: '☕' },
  { label: 'Coffee', amount: 3.5, categoryId: 'coffee', icon: '🍵' },
  { label: 'Snack / Lunch', amount: 8.0, categoryId: 'food', icon: '🍔' },
  { label: 'Fuel / Ride', amount: 5.0, categoryId: 'transport', icon: '🚗' },
  { label: 'Groceries', amount: 15.0, categoryId: 'groceries', icon: '🛒' },
]

export const EMOJI_PICKER_OPTIONS = [
  '☕', '🍵', '🍔', '🍕', '🌮', '🍜', '🍩', '🛒', '🚗', '⛽', '🚕', '🚌',
  '🛍️', '👕', '👟', '💡', '⚡', '💧', '🎬', '🎮', '🎵', '🎟️', '💊', '🏥',
  '🏋️', '⚽', '🎾', '📚', '🎓', '✈️', '🏨', '🏖️', '🎁', '💐', '📱', '💻',
  '💼', '🪙', '💳', '🐾', '🐶', '🐱', '👶', '🪴', '✂️', '🧹', '🛠️', '🏷️'
]

export const COLOR_OPTIONS = [
  '#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6',
  '#06b6d4', '#14b8a6', '#6366f1', '#0ea5e9', '#f43f5e', '#64748b'
]

export function getCategoryById(categories, id) {
  return categories.find((c) => c.id === id) || {
    id: 'other',
    name: 'General',
    icon: '🏷️',
    color: '#94a3b8',
  }
}
