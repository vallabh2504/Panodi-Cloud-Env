import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kerblmnjjsbgtwidefqw.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseAnonKey !== 'placeholder')

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey || 'placeholder'
)
