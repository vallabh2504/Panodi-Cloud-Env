import { supabase } from '../lib/supabase'

/* ─── Types ─────────────────────────────────────────────────── */

export interface DbChat {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
}

export interface DbMessage {
  id: string
  chat_id: string
  user_id: string
  role: 'user' | 'ai'
  content: string
  created_at: string
}

/* ─── Profile ────────────────────────────────────────────────── */

/**
 * Upsert the user's public profile row from their auth metadata.
 * Called once on every sign-in so the row is always up to date.
 */
export async function ensureProfile(
  userId: string,
  email: string | undefined,
  fullName: string | undefined,
  avatarUrl: string | undefined,
): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .upsert(
      { id: userId, email: email ?? null, full_name: fullName ?? null, avatar_url: avatarUrl ?? null },
      { onConflict: 'id' },
    )
  if (error) throw error
}

/* ─── Preferences ────────────────────────────────────────────── */

export async function loadThemePreference(userId: string): Promise<'dark' | 'light' | null> {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('theme')
    .eq('user_id', userId)
    .single()
  if (error) return null
  return (data?.theme as 'dark' | 'light') ?? null
}

export async function saveThemePreference(userId: string, theme: 'dark' | 'light'): Promise<void> {
  const { error } = await supabase
    .from('user_preferences')
    .upsert({ user_id: userId, theme }, { onConflict: 'user_id' })
  if (error) throw error
}

/* ─── Chats ──────────────────────────────────────────────────── */

/** Return the most recently updated chat, or create one if none exists. */
export async function getOrCreateChat(userId: string): Promise<DbChat> {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1)

  if (error) throw error

  if (data && data.length > 0) return data[0] as DbChat

  return createChat(userId)
}

export async function createChat(userId: string, title = 'New Chat'): Promise<DbChat> {
  const { data, error } = await supabase
    .from('chats')
    .insert({ user_id: userId, title })
    .select()
    .single()

  if (error) throw error
  return data as DbChat
}

export async function updateChatTitle(chatId: string, title: string): Promise<void> {
  const { error } = await supabase
    .from('chats')
    .update({ title })
    .eq('id', chatId)
  if (error) throw error
}

/** Bump updated_at so this chat sorts first next session. */
export async function touchChat(chatId: string): Promise<void> {
  const { error } = await supabase
    .from('chats')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', chatId)
  if (error) throw error
}

/* ─── Messages ───────────────────────────────────────────────── */

export async function loadMessages(chatId: string): Promise<DbMessage[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []) as DbMessage[]
}

export async function saveMessage(
  chatId: string,
  userId: string,
  role: 'user' | 'ai',
  content: string,
): Promise<DbMessage> {
  const { data, error } = await supabase
    .from('messages')
    .insert({ chat_id: chatId, user_id: userId, role, content })
    .select()
    .single()

  if (error) throw error
  return data as DbMessage
}

export async function clearChatMessages(chatId: string): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('chat_id', chatId)
  if (error) throw error
}
