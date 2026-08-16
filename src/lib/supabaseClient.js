import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// If you haven't set up Supabase yet, this stays null and the app
// automatically runs on the local (localStorage) data layer instead.
// See README.md -> "Connecting Supabase" to switch to the real backend.
export const supabase = url && anonKey ? createClient(url, anonKey) : null

export const isSupabaseConfigured = !!supabase
