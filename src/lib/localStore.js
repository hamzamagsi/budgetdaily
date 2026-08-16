// localStore.js
// Persistent localStorage-backed data layer with full support for
// free/premium subscription gating, custom categories with icons,
// recurring subscriptions tracker, and daily allowance calculation.

import { DEFAULT_CATEGORIES } from './categories'

const KEYS = {
  user: 'bd_user',
  budgets: 'bd_budgets',
  expenses: 'bd_expenses',
  subscription: 'bd_subscription',
  customCategories: 'bd_custom_categories',
  recurringBills: 'bd_recurring_bills',
  savingsGoal: 'bd_savings_goal',
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export const PLANS = {
  free: { id: 'free', name: 'Free Starter', price: 0, interval: 'forever', isPro: false },
  monthly: { id: 'monthly', name: 'Pro Monthly', price: 1, interval: '/month', isPro: true, savings: null },
  half_yearly: { id: 'half_yearly', name: 'Pro 6 Months', price: 5, interval: '/6 months', isPro: true, savings: 'Save $1' },
  yearly: { id: 'yearly', name: 'Pro Annual', price: 9, interval: '/year', isPro: true, savings: 'Save 25% ($0.75/mo)' },
  lifetime: { id: 'lifetime', name: 'Pro Lifetime', price: 100, interval: 'one-time', isPro: true, savings: 'Pay once, forever' },
}

export const localStore = {
  // --- auth ---
  getUser() {
    return read(KEYS.user, null)
  },
  signIn(userData) {
    const user = typeof userData === 'string'
      ? { id: 'user-' + Date.now(), email: userData, verified: true, method: 'email' }
      : { id: userData.id || 'user-' + Date.now(), verified: true, ...userData }
    write(KEYS.user, user)
    return user
  },
  signOut() {
    localStorage.removeItem(KEYS.user)
  },

  // --- subscription (Freemium: 4 Free vs 10 Pro) ---
  getSubscription() {
    return read(KEYS.subscription, {
      status: 'active',
      plan: 'free',
      isPro: false,
      startedAt: new Date().toISOString(),
    })
  },
  setSubscription(sub) {
    const planInfo = PLANS[sub.plan] || PLANS.free
    const updated = {
      ...sub,
      status: 'active',
      isPro: planInfo.isPro,
      planName: planInfo.name,
      updatedAt: new Date().toISOString(),
    }
    write(KEYS.subscription, updated)
    return updated
  },
  isProUser() {
    const sub = this.getSubscription()
    return !!sub.isPro
  },

  // --- budgets ---
  getActiveBudget() {
    const budgets = read(KEYS.budgets, [])
    return budgets.find((b) => b.active) || null
  },
  createBudget(budget) {
    const budgets = read(KEYS.budgets, []).map((b) => ({ ...b, active: false }))
    const newBudget = {
      id: crypto.randomUUID(),
      active: true,
      createdAt: new Date().toISOString(),
      ...budget,
    }
    write(KEYS.budgets, [...budgets, newBudget])
    write(KEYS.expenses, []) // fresh period, fresh expense log
    return newBudget
  },

  // --- expenses with categories & icons ---
  getExpenses() {
    return read(KEYS.expenses, [])
  },
  getTodayExpenses() {
    const expenses = this.getExpenses()
    const today = new Date().toISOString().slice(0, 10)
    return expenses.filter((e) => e.date && e.date.slice(0, 10) === today)
  },
  addExpense(expense) {
    const expenses = read(KEYS.expenses, [])
    const isPro = this.isProUser()
    const todayExpenses = this.getTodayExpenses()

    // Free tier limit: max 5 expenses per day
    if (!isPro && todayExpenses.length >= 5) {
      const error = new Error('FREE_LIMIT_REACHED')
      error.limit = 5
      throw error
    }

    const newExpense = {
      id: crypto.randomUUID(),
      date: expense.date || new Date().toISOString(),
      categoryId: expense.categoryId || 'other',
      paymentMethod: expense.paymentMethod || 'cash', // 'cash' | 'card' | 'wallet'
      note: expense.note || '',
      ...expense,
    }
    write(KEYS.expenses, [...expenses, newExpense])
    return newExpense
  },
  deleteExpense(id) {
    const expenses = read(KEYS.expenses, [])
    write(KEYS.expenses, expenses.filter((e) => e.id !== id))
  },

  // --- categories (Default + Custom Categories) ---
  getCategories() {
    const custom = read(KEYS.customCategories, [])
    return [...DEFAULT_CATEGORIES, ...custom]
  },
  addCustomCategory(category) {
    const custom = read(KEYS.customCategories, [])
    const newCat = {
      id: 'custom-' + Date.now(),
      name: category.name,
      icon: category.icon || '✨',
      color: category.color || '#f59e0b',
      isCustom: true,
    }
    write(KEYS.customCategories, [...custom, newCat])
    return newCat
  },
  deleteCustomCategory(id) {
    const custom = read(KEYS.customCategories, [])
    write(KEYS.customCategories, custom.filter((c) => c.id !== id))
  },

  // --- recurring subscriptions / bills ---
  getRecurringBills() {
    return read(KEYS.recurringBills, [
      { id: 'rec-1', name: 'Netflix', amount: 15.99, icon: '🎬', cycle: 'monthly', nextDate: '2026-09-01' },
      { id: 'rec-2', name: 'Spotify', amount: 10.99, icon: '🎵', cycle: 'monthly', nextDate: '2026-09-05' },
    ])
  },
  addRecurringBill(bill) {
    const bills = this.getRecurringBills()
    const newBill = { id: 'rec-' + Date.now(), ...bill }
    write(KEYS.recurringBills, [...bills, newBill])
    return newBill
  },
  deleteRecurringBill(id) {
    const bills = this.getRecurringBills()
    write(KEYS.recurringBills, bills.filter((b) => b.id !== id))
  },

  // --- savings goal ---
  getSavingsGoal() {
    return read(KEYS.savingsGoal, { target: 500, current: 150, name: 'Emergency Fund 🛡️' })
  },
  setSavingsGoal(goal) {
    write(KEYS.savingsGoal, goal)
  },

  // --- export helper (Pro feature) ---
  exportExpensesCSV() {
    const expenses = this.getExpenses()
    const categories = this.getCategories()
    const headers = ['Date', 'Category', 'Label', 'Amount', 'Payment Method', 'Note']
    const rows = expenses.map((e) => {
      const cat = categories.find((c) => c.id === e.categoryId)?.name || 'General'
      return [
        new Date(e.date).toLocaleString(),
        `"${cat}"`,
        `"${e.label || ''}"`,
        e.amount,
        e.paymentMethod || 'cash',
        `"${e.note || ''}"`,
      ]
    })
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    return csvContent
  },
}
