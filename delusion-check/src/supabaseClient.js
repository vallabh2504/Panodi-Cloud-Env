import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Google OAuth Client ID (configure this in Supabase Dashboard > Auth > Providers > Google)
export const GOOGLE_CLIENT_ID = '1070416285672-cs27l82dtl4dm858d19vcgvohj3ptne1.apps.googleusercontent.com'
