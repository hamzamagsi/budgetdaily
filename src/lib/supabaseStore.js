// supabaseStore.js
// Same interface as localStore.js, backed by real Postgres via Supabase.
// Swap it in inside src/lib/store.js once VITE_SUPABASE_URL / ANON_KEY are set
// and you've run supabase/schema.sql against your project.

import { supabase } from './supabaseClient'

export const supabaseStore = {
  async getUser() {
    const { data } = await supabase.auth.getUser()
    return data?.user || null
  },
  async signIn(email) {
    // Magic-link auth — no passwords to manage.
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) throw error
    return { email, pending: true }
  },
  async signOut() {
    await supabase.auth.signOut()
  },

  async getActiveBudget() {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('active', true)
      .maybeSingle()
    if (error) throw error
    return data
  },
  async createBudget(budget) {
    await supabase.from('budgets').update({ active: false }).eq('active', true)
    const { data, error } = await supabase
      .from('budgets')
      .insert({ ...budget, active: true })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getExpenses(budgetId) {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('budget_id', budgetId)
      .order('date', { ascending: false })
    if (error) throw error
    return data
  },
  async addExpense(expense) {
    const { data, error } = await supabase.from('expenses').insert(expense).select().single()
    if (error) throw error
    return data
  },
  async deleteExpense(id) {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (error) throw error
  },

  async getSubscription() {
    const { data, error } = await supabase.from('subscriptions').select('*').maybeSingle()
    if (error) throw error
    return data
  },
}
