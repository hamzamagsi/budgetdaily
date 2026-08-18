import { isSupabaseConfigured } from './supabaseClient'
import { localStore, SUPPORTED_CURRENCIES } from './localStore'

export const store = localStore
export const usingLocalStore = !isSupabaseConfigured
export { SUPPORTED_CURRENCIES }
