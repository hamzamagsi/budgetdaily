import { createClient } from '@supabase/supabase-js'

const rawUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://ntqdpadurkidossorggo.supabase.co'

const anonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_WTyAlOa7bSBla69D108uLQ_2VMIMnQ0'

// Normalize URL: remove any /rest/v1 or trailing slashes
const normalizedUrl = rawUrl
  ? rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '')
  : ''

export const supabase =
  normalizedUrl && anonKey ? createClient(normalizedUrl, anonKey) : null

export const isSupabaseConfigured = !!supabase
