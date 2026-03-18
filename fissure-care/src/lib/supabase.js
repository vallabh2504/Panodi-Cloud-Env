import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://kerblmnjjsbgtwidefqw.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlcmJsbW5qanNiZ3R3aWRlZnF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NjgzMTUsImV4cCI6MjA4OTM0NDMxNX0.OZpy4VXyFUDw8EhuZ1A3uHCTEfZyQmr8W4R3QNJwPOM'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
