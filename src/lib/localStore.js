// localStore.js
// Persistent localStorage-backed data layer with user-scoped subscriptions,
// multi-account wallets, income & expense tracking, and calendar views.

import { DEFAULT_CATEGORIES } from './categories'

const KEYS = {
  user: 'bd_user',
  budgets: 'bd_budgets',
  transactions: 'bd_transactions',
  accounts: 'bd_accounts',
  activeAccount: 'bd_active_account',
  categoryBudgets: 'bd_category_budgets',
  subscriptionPrefix: 'bd_sub_',
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

export const DEFAULT_ACCOUNTS = [
  { id: 'default', name: 'Default', icon: '👛', color: '#6c5ce7', balance: 2323.56 },
  { id: 'bank', name: 'Chase Checking', icon: '💳', color: '#3b82f6', balance: 4500.00 },
  { id: 'cash', name: 'Cash Wallet', icon: '💵', color: '#10b981', balance: 350.00 },
  { id: 'savings', name: 'High Yield Savings', icon: '🏦', color: '#f59e0b', balance: 12000.00 },
]

export const PLANS = {
  free: { id: 'free', name: 'Free Starter', price: 0, interval: 'forever', isPro: false },
  monthly: { id: 'monthly', name: 'Pro Monthly', price: 1, interval: '/month', isPro: true, savings: null },
  half_yearly: { id: 'half_yearly', name: 'Pro 6 Months', price: 5, interval: '/6 months', isPro: true, savings: 'Save $1' },
  yearly: { id: 'yearly', name: 'Pro Annual', price: 9, interval: '/year', isPro: true, savings: 'Save 25% ($0.75/mo)' },
  lifetime: { id: 'lifetime', name: 'Pro Lifetime', price: 100, interval: 'one-time', isPro: true, savings: 'Pay once, forever' },
}

export const localStore = {
  // --- Auth ---
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

  // --- Subscriptions (Scoped per user so new logins start on FREE plan) ---
  getUserSubKey() {
    const u = this.getUser()
    return u?.email ? `${KEYS.subscriptionPrefix}${u.email.toLowerCase()}` : `${KEYS.subscriptionPrefix}anon`
  },
  getSubscription() {
    const subKey = this.getUserSubKey()
    return read(subKey, {
      status: 'active',
      plan: 'free',
      isPro: false,
      startedAt: new Date().toISOString(),
    })
  },
  setSubscription(sub) {
    const subKey = this.getUserSubKey()
    const planInfo = PLANS[sub.plan] || PLANS.free
    const updated = {
      ...sub,
      status: 'active',
      isPro: planInfo.isPro,
      planName: planInfo.name,
      updatedAt: new Date().toISOString(),
    }
    write(subKey, updated)
    return updated
  },
  isProUser() {
    const sub = this.getSubscription()
    return !!sub.isPro
  },

  // --- Accounts / Wallets ---
  getAccounts() {
    return read(KEYS.accounts, DEFAULT_ACCOUNTS)
  },
  getActiveAccountId() {
    return read(KEYS.activeAccount, 'default')
  },
  setActiveAccountId(id) {
    write(KEYS.activeAccount, id)
  },
  getActiveAccount() {
    const accounts = this.getAccounts()
    const activeId = this.getActiveAccountId()
    return accounts.find((a) => a.id === activeId) || accounts[0]
  },

  // --- Budgets ---
  getActiveBudget() {
    const budgets = read(KEYS.budgets, [])
    const active = budgets.find((b) => b.active)
    if (active) return active

    const defaultBudget = {
      id: 'budget-aug-2024',
      name: 'August Budget',
      periodLabel: 'August · 01 Aug - 31 Aug',
      totalAmount: 4500.00,
      periodDays: 31,
      mode: 'budget', // 'budget' | 'goal'
      categoryBudgetEnabled: true,
      active: true,
      createdAt: new Date().toISOString(),
    }
    write(KEYS.budgets, [defaultBudget])
    return defaultBudget
  },
  updateBudget(budgetData) {
    const budgets = read(KEYS.budgets, [])
    const active = this.getActiveBudget()
    const updated = { ...active, ...budgetData }
    const filtered = budgets.filter((b) => b.id !== active.id)
    write(KEYS.budgets, [...filtered, updated])
    return updated
  },

  // --- Category Budgets ---
  getCategoryBudgets() {
    return read(KEYS.categoryBudgets, {
      rent: 1700,
      healthcare: 200,
      dining: 250,
      entertainment: 200,
      groceries: 500,
      tea: 50,
      transport: 150,
      shopping: 150,
      bills: 100,
    })
  },
  setCategoryBudget(categoryId, amount) {
    const current = this.getCategoryBudgets()
    const updated = { ...current, [categoryId]: Number(amount) || 0 }
    write(KEYS.categoryBudgets, updated)
    return updated
  },

  // --- Transactions (Expenses & Incomes) ---
  getTransactions() {
    const txs = read(KEYS.transactions, null)
    if (txs) return txs

    // Rich sample data from Figma screen
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth()

    const initialTxs = [
      {
        id: 'tx-1',
        type: 'expense',
        amount: 40.72,
        categoryId: 'groceries',
        note: 'Coles',
        date: new Date(y, m, 10, 12, 35).toISOString(),
        accountId: 'default',
      },
      {
        id: 'tx-2',
        type: 'expense',
        amount: 32.66,
        categoryId: 'dining',
        note: 'Bakery',
        date: new Date(y, m, 10, 20, 0).toISOString(),
        accountId: 'default',
      },
      {
        id: 'tx-3',
        type: 'expense',
        amount: 1700.00,
        categoryId: 'rent',
        note: 'Rent',
        date: new Date(y, m, 1, 9, 0).toISOString(),
        accountId: 'default',
      },
      {
        id: 'tx-4',
        type: 'expense',
        amount: 126.15,
        categoryId: 'healthcare',
        note: 'Healthcare prescription',
        date: new Date(y, m, 5, 14, 20).toISOString(),
        accountId: 'default',
      },
      {
        id: 'tx-5',
        type: 'expense',
        amount: 12.00,
        categoryId: 'dining',
        note: 'Sushi',
        date: new Date(y, m, 7, 13, 10).toISOString(),
        accountId: 'default',
      },
      {
        id: 'tx-6',
        type: 'expense',
        amount: 86.40,
        categoryId: 'shopping',
        note: 'Shopping',
        date: new Date(y, m, 9, 16, 45).toISOString(),
        accountId: 'default',
      },
      {
        id: 'tx-income-1',
        type: 'income',
        amount: 4500.00,
        categoryId: 'salary',
        note: 'Monthly Salary',
        date: new Date(y, m, 1, 10, 0).toISOString(),
        accountId: 'default',
      },
    ]
    write(KEYS.transactions, initialTxs)
    return initialTxs
  },

  getExpenses() {
    return this.getTransactions().filter((t) => t.type === 'expense')
  },
  getTodayExpenses() {
    const today = new Date().toISOString().slice(0, 10)
    return this.getExpenses().filter((e) => e.date && e.date.slice(0, 10) === today)
  },

  addTransaction(tx) {
    const txs = this.getTransactions()
    const isPro = this.isProUser()
    const todayTxs = this.getTodayExpenses()

    // Free limit check: max 5 expenses per day
    if (tx.type === 'expense' && !isPro && todayTxs.length >= 5) {
      const error = new Error('FREE_LIMIT_REACHED')
      error.limit = 5
      throw error
    }

    const newTx = {
      id: crypto.randomUUID(),
      type: tx.type || 'expense',
      amount: Number(tx.amount) || 0,
      categoryId: tx.categoryId || (tx.type === 'income' ? 'salary' : 'dining'),
      note: tx.note || '',
      date: tx.date || new Date().toISOString(),
      accountId: tx.accountId || this.getActiveAccountId(),
      recurring: !!tx.recurring,
    }

    write(KEYS.transactions, [newTx, ...txs])
    return newTx
  },
  deleteTransaction(id) {
    const txs = this.getTransactions()
    write(KEYS.transactions, txs.filter((t) => t.id !== id))
  },

  // --- Financial Aggregates ---
  getFinancialSummary() {
    const txs = this.getTransactions()
    const totalIncome = txs
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0)

    const totalExpense = txs
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0)

    const budget = this.getActiveBudget()
    const budgetTotal = budget?.totalAmount || 4500
    const leftToSpend = Math.max(0, budgetTotal - totalExpense)

    return {
      income: totalIncome || 4500.00,
      expense: totalExpense,
      balance: Math.max(0, (totalIncome || 4500.00) - totalExpense),
      leftToSpend,
      budgetTotal,
    }
  },

  // --- Categories (Default + Custom) ---
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
      color: category.color || '#6c5ce7',
      budget: Number(category.budget) || 100,
      isCustom: true,
    }
    write(KEYS.customCategories, [...custom, newCat])
    return newCat
  },

  // --- Recurring Subscriptions / Upcoming ---
  getRecurringBills() {
    return read(KEYS.recurringBills, [
      { id: 'rec-1', name: 'Netflix Premium', amount: 19.99, icon: '🎬', cycle: 'monthly', nextDate: '28 Aug 24' },
      { id: 'rec-2', name: 'Spotify Duo', amount: 14.99, icon: '🎵', cycle: 'monthly', nextDate: '30 Aug 24' },
      { id: 'rec-3', name: 'Gym Membership', amount: 45.00, icon: '🏋️', cycle: 'monthly', nextDate: '01 Sep 24' },
    ])
  },
}
