// localStore.js
// A localStorage-backed data layer with the exact same shape as the
// Supabase queries in supabaseStore.js. This lets the app run fully
// standalone (no account needed) today, and swap to real accounts +
// real persistence later without touching any component.

const KEYS = {
  user: 'bd_user',
  budgets: 'bd_budgets',
  expenses: 'bd_expenses',
  subscription: 'bd_subscription',
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

export const localStore = {
  // --- auth (mocked) ---
  getUser() {
    return read(KEYS.user, null)
  },
  signIn(email) {
    const user = { id: 'local-user', email }
    write(KEYS.user, user)
    return user
  },
  signOut() {
    localStorage.removeItem(KEYS.user)
  },

  // --- budgets ---
  getActiveBudget() {
    const budgets = read(KEYS.budgets, [])
    return budgets.find((b) => b.active) || null
  },
  createBudget(budget) {
    const budgets = read(KEYS.budgets, []).map((b) => ({ ...b, active: false }))
    const newBudget = { id: crypto.randomUUID(), active: true, createdAt: new Date().toISOString(), ...budget }
    write(KEYS.budgets, [...budgets, newBudget])
    write(KEYS.expenses, []) // fresh period, fresh expense log
    return newBudget
  },

  // --- expenses ---
  getExpenses() {
    return read(KEYS.expenses, [])
  },
  addExpense(expense) {
    const expenses = read(KEYS.expenses, [])
    const newExpense = { id: crypto.randomUUID(), date: new Date().toISOString(), ...expense }
    write(KEYS.expenses, [...expenses, newExpense])
    return newExpense
  },
  deleteExpense(id) {
    const expenses = read(KEYS.expenses, [])
    write(KEYS.expenses, expenses.filter((e) => e.id !== id))
  },

  // --- subscription (mocked locally; real status comes from Stripe webhook in production) ---
  getSubscription() {
    return read(KEYS.subscription, { status: 'trialing', plan: 'monthly' })
  },
  setSubscription(sub) {
    write(KEYS.subscription, sub)
  },
}
