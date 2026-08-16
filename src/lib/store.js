import { isSupabaseConfigured } from './supabaseClient'
import { localStore } from './localStore'
// import { supabaseStore } from './supabaseStore' // uncomment once Supabase is connected

// One flag flips the entire app from local demo mode to real accounts.
// See README.md -> "Connecting Supabase" for the two-line swap.
export const store = localStore
export const usingLocalStore = !isSupabaseConfigured
