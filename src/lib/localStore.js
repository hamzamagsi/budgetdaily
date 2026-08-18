// localStore.js
// Production-grade user-scoped data layer for BudgetDaily.
// Every new user starts with a clean slate ($0 balance, 0 transactions, empty budget).
// Supports global multi-currency and strict user-isolated storage.

import { DEFAULT_CATEGORIES } from './categories'

export const SUPPORTED_CURRENCIES = [
  { symbol: '$', code: 'USD', name: 'US Dollar ($)' },
  { symbol: '₨', code: 'PKR', name: 'Pakistani Rupee (₨)' },
  { symbol: '₹', code: 'INR', name: 'Indian Rupee (₹)' },
  { symbol: '€', code: 'EUR', name: 'Euro (€)' },
  { symbol: '£', code: 'GBP', name: 'British Pound (£)' },
  { symbol: 'AED', code: 'AED', name: 'UAE Dirham (AED)' },
  { symbol: 'SAR', code: 'SAR', name: 'Saudi Riyal (SAR)' },
  { symbol: 'C$', code: 'CAD', name: 'Canadian Dollar (C$)' },
  { symbol: 'A$', code: 'AUD', name: 'Australian Dollar (A$)' },
  { symbol: '¥', code: 'JPY', name: 'Japanese Yen (¥)' },
  { symbol: '₩', code: 'KRW', name: 'South Korean Won (₩)' },
  { symbol: '₺', code: 'TRY', name: 'Turkish Lira (₺)' },
  { symbol: 'R$', code: 'BRL', name: 'Brazilian Real (R$)' },
]

function getUserEmail() {
  try {
    const raw = localStorage.getItem('bd_user')
    if (raw) {
      const u = JSON.parse(raw)
      return u?.email ? u.email.toLowerCase().trim() : 'guest'
    }
  } catch {}
  return 'guest'
}

function readUser(keySuffix, fallback) {
  try {
    const email = getUserEmail()
    const raw = localStorage.getItem(`bd_${email}_${keySuffix}`)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeUser(keySuffix, value) {
  try {
    const email = getUserEmail()
    localStorage.setItem(`bd_${email}_${keySuffix}`, JSON.stringify(value))
  } catch {}
}

export const PLANS = {
  free: { id: 'free', name: 'Free Starter', price: 0, interval: 'forever', isPro: false },
  monthly: { id: 'monthly', name: 'Pro Monthly', price: 1.99, interval: '/month', isPro: true, savings: null },
  half_yearly: { id: 'half_yearly', name: 'Pro 6 Months', price: 9.99, interval: '/6 months', isPro: true, savings: 'Save 15%' },
  yearly: { id: 'yearly', name: 'Pro Annual', price: 19.99, interval: '/year', isPro: true, savings: 'Save 25%' },
  lifetime: { id: 'lifetime', name: 'Pro Lifetime', price: 100.00, interval: 'one-time', isPro: true, savings: 'Pay once, forever' },
}

export const localStore = {
  // --- Auth ---
  getUser() {
    try {
      const raw = localStorage.getItem('bd_user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },
  signIn(userData) {
    const user = typeof userData === 'string'
      ? { id: 'user-' + Date.now(), email: userData, verified: true, method: 'email' }
      : { id: userData.id || 'user-' + Date.now(), verified: true, ...userData }
    localStorage.setItem('bd_user', JSON.stringify(user))
    return user
  },
  signOut() {
    localStorage.removeItem('bd_user')
  },

  // --- Currency (User Configured) ---
  getCurrency() {
    const budget = this.getActiveBudget()
    return budget?.currency || readUser('currency', '$')
  },
  setCurrency(symbol) {
    writeUser('currency', symbol)
    const active = this.getActiveBudget()
    if (active) {
      this.updateBudget({ currency: symbol })
    }
  },

  // --- Subscriptions (Strictly Free by Default for all accounts) ---
  getSubscription() {
    return readUser('subscription', {
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
    writeUser('subscription', updated)
    return updated
  },
  isProUser() {
    const sub = this.getSubscription()
    return !!sub.isPro
  },

  // --- Accounts / Wallets (Scoped to User) ---
  getAccounts() {
    const fallback = [
      { id: 'default', name: 'Default Wallet', icon: '👛', color: '#6c5ce7', balance: 0.00 },
      { id: 'bank', name: 'Main Checking', icon: '💳', color: '#3b82f6', balance: 0.00 },
      { id: 'cash', name: 'Cash Wallet', icon: '💵', color: '#10b981', balance: 0.00 },
      { id: 'savings', name: 'Savings Fund', icon: '🏦', color: '#f59e0b', balance: 0.00 },
    ]
    return readUser('accounts', fallback)
  },
  setAccounts(accounts) {
    writeUser('accounts', accounts)
  },
  getActiveAccountId() {
    return readUser('active_account_id', 'default')
  },
  setActiveAccountId(id) {
    writeUser('active_account_id', id)
  },
  getActiveAccount() {
    const accounts = this.getAccounts()
    const activeId = this.getActiveAccountId()
    return accounts.find((a) => a.id === activeId) || accounts[0]
  },

  // --- Budgets (User Scoped - null for brand new users until onboarded) ---
  getActiveBudget() {
    const budget = readUser('active_budget', null)
    return budget
  },
  createBudget(budgetData) {
    const newBudget = {
      id: 'budget-' + Date.now(),
      name: budgetData.name || 'My Budget',
      periodLabel: budgetData.periodLabel || 'Current Period',
      totalAmount: Number(budgetData.totalAmount) || 0,
      periodDays: Number(budgetData.periodDays) || 30,
      startDate: budgetData.startDate || new Date().toISOString().slice(0, 10),
      endDate: budgetData.endDate || new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      currency: budgetData.currency || '$',
      mode: budgetData.mode || 'budget',
      categoryBudgetEnabled: true,
      active: true,
      createdAt: new Date().toISOString(),
    }
    writeUser('active_budget', newBudget)
    return newBudget
  },
  updateBudget(budgetData) {
    const active = this.getActiveBudget()
    if (!active) {
      return this.createBudget(budgetData)
    }
    const updated = { ...active, ...budgetData }
    writeUser('active_budget', updated)
    return updated
  },

  // --- Category Budgets ---
  getCategoryBudgets() {
    return readUser('category_budgets', {
      rent: 0,
      healthcare: 0,
      dining: 0,
      entertainment: 0,
      groceries: 0,
      transport: 0,
      shopping: 0,
      bills: 0,
    })
  },
  setCategoryBudget(categoryId, amount) {
    const current = this.getCategoryBudgets()
    const updated = { ...current, [categoryId]: Number(amount) || 0 }
    writeUser('category_budgets', updated)
    return updated
  },

  // --- Transactions (Expenses & Incomes - 100% user-scoped and clean) ---
  getTransactions() {
    return readUser('transactions', [])
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

    // Free tier daily limit check
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

    const updated = [newTx, ...txs]
    writeUser('transactions', updated)

    // Update wallet balance
    const accounts = this.getAccounts()
    const activeAccId = newTx.accountId
    const updatedAccounts = accounts.map((acc) => {
      if (acc.id === activeAccId) {
        const delta = newTx.type === 'income' ? newTx.amount : -newTx.amount
        return { ...acc, balance: Math.max(0, acc.balance + delta) }
      }
      return acc
    })
    this.setAccounts(updatedAccounts)

    return newTx
  },
  deleteTransaction(id) {
    const txs = this.getTransactions()
    const filtered = txs.filter((t) => t.id !== id)
    writeUser('transactions', filtered)
  },

  // --- Financial Summary ---
  getFinancialSummary() {
    const txs = this.getTransactions()
    const budget = this.getActiveBudget()
    const budgetTotal = budget?.totalAmount || 0

    const totalIncome = txs
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0)

    const totalExpense = txs
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0)

    const leftToSpend = Math.max(0, budgetTotal - totalExpense)
    const days = budget?.periodDays || 30
    const safeDaily = days > 0 ? leftToSpend / days : 0

    return {
      income: totalIncome,
      expense: totalExpense,
      balance: Math.max(0, totalIncome - totalExpense),
      leftToSpend,
      budgetTotal,
      safeDaily,
      currency: budget?.currency || '$',
    }
  },

  // --- Categories ---
  getCategories() {
    const custom = readUser('custom_categories', [])
    return [...DEFAULT_CATEGORIES, ...custom]
  },
  addCustomCategory(category) {
    const custom = readUser('custom_categories', [])
    const newCat = {
      id: 'custom-' + Date.now(),
      name: category.name,
      icon: category.icon || '✨',
      color: category.color || '#6c5ce7',
      budget: Number(category.budget) || 100,
      isCustom: true,
    }
    const updated = [...custom, newCat]
    writeUser('custom_categories', updated)
    return newCat
  },

  // --- Recurring Bills ---
  getRecurringBills() {
    return readUser('recurring_bills', [])
  },
  addRecurringBill(bill) {
    const bills = this.getRecurringBills()
    const newBill = {
      id: 'rec-' + Date.now(),
      name: bill.name,
      amount: Number(bill.amount) || 0,
      icon: bill.icon || '🧾',
      nextDate: bill.nextDate || 'Upcoming',
    }
    const updated = [...bills, newBill]
    writeUser('recurring_bills', updated)
    return newBill
  },
}
