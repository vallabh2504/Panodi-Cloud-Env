import { useState, useEffect, useCallback, useRef } from 'react'
import type { User } from '@supabase/supabase-js'
import {
  ensureProfile,
  getOrCreateChat,
  createChat,
  loadMessages,
  saveMessage,
  touchChat,
  clearChatMessages,
  updateChatTitle,
} from '../services/chatService'

/* ─── Types ─────────────────────────────────────────────────── */

export interface Message {
  id: string
  role: 'user' | 'ai'
  text: string
  done: boolean
  ts: Date
}

/* ─── Placeholder responses (replaced when model is connected) ── */
const PLACEHOLDER_RESPONSES = [
  "Sovereign GPT online. All 608K parameters are actively processing your input through the autonomous factory loop.",
  "Acknowledged. Running inference across the full parameter matrix. The factory loop has parsed your query and generated this response.",
  "Processing complete. The sovereign inference engine has analyzed your input and distilled an optimized output.",
  "Factory loop active. Your request has been routed through all inference nodes and the response is ready.",
  "Sovereign protocol engaged. Query processed — standing by for further instructions.",
]

/* ─── Hook ───────────────────────────────────────────────────── */

export function useChat(user: User) {
  const [messages, setMessages]   = useState<Message[]>([])
  const [chatId, setChatId]       = useState<string | null>(null)
  const [isThinking, setIsThinking] = useState(false)
  const [isLoading, setIsLoading]   = useState(true)
  const responseIndex = useRef(0)

  /* ── Init: ensure profile + load latest chat + its messages ── */
  useEffect(() => {
    let cancelled = false

    async function init() {
      setIsLoading(true)
      try {
        // Upsert public profile from Google OAuth metadata
        await ensureProfile(
          user.id,
          user.email,
          user.user_metadata?.full_name as string | undefined,
          user.user_metadata?.avatar_url as string | undefined,
        )

        const chat = await getOrCreateChat(user.id)
        if (cancelled) return
        setChatId(chat.id)

        const dbMsgs = await loadMessages(chat.id)
        if (cancelled) return

        if (dbMsgs.length === 0) {
          // Brand new chat — show welcome message (UI only, not persisted)
          setMessages([{
            id: 'welcome',
            role: 'ai',
            text: 'Sovereign GPT online. Factory loop initialized. How can I assist you today?',
            done: true,
            ts: new Date(),
          }])
        } else {
          setMessages(dbMsgs.map(m => ({
            id: m.id,
            role: m.role,
            text: m.content,
            done: true,
            ts: new Date(m.created_at),
          })))
        }
      } catch (err) {
        console.error('[useChat] init error:', err)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    init()
    return () => { cancelled = true }
  }, [user.id]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Send message ────────────────────────────────────────── */
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isThinking || !chatId) return

    // Optimistically render user bubble immediately
    const optId = `opt-${Date.now()}`
    setMessages(prev => [...prev, {
      id: optId,
      role: 'user',
      text,
      done: true,
      ts: new Date(),
    }])
    setIsThinking(true)

    try {
      // Persist user message
      const savedUser = await saveMessage(chatId, user.id, 'user', text)

      // Replace optimistic ID with the real DB id
      setMessages(prev => prev.map(m =>
        m.id === optId
          ? { ...m, id: savedUser.id, ts: new Date(savedUser.created_at) }
          : m,
      ))

      // Auto-title the chat from the first user message
      const allMsgs = await loadMessages(chatId)
      if (allMsgs.filter(m => m.role === 'user').length === 1) {
        const title = text.length > 50 ? text.slice(0, 47) + '…' : text
        await updateChatTitle(chatId, title)
      }

      // Simulated thinking delay (will be replaced by real model call)
      await new Promise(r => setTimeout(r, 480 + Math.random() * 280))

      const aiText = PLACEHOLDER_RESPONSES[responseIndex.current % PLACEHOLDER_RESPONSES.length]
      responseIndex.current++

      // Add AI message to UI — done:false triggers typewriter animation
      const aiOptId = `ai-opt-${Date.now()}`
      const aiTs = new Date()
      setMessages(prev => [...prev, {
        id: aiOptId,
        role: 'ai',
        text: aiText,
        done: false,
        ts: aiTs,
      }])
      setIsThinking(false)

      // Persist AI response + touch chat
      const savedAi = await saveMessage(chatId, user.id, 'ai', aiText)
      await touchChat(chatId)

      // Wait for typewriter animation to finish, then mark done
      const typewriterMs = aiText.length * 14 + 100
      await new Promise(r => setTimeout(r, typewriterMs))

      setMessages(prev => prev.map(m =>
        m.id === aiOptId
          ? { ...m, id: savedAi.id, done: true }
          : m,
      ))
    } catch (err) {
      console.error('[useChat] sendMessage error:', err)
      setIsThinking(false)
    }
  }, [chatId, isThinking, user.id])

  /* ── Clear chat ──────────────────────────────────────────── */
  const clearChat = useCallback(async () => {
    if (!chatId) return
    try {
      // Delete messages from current chat, then start a fresh one
      await clearChatMessages(chatId)
      const newChat = await createChat(user.id)
      setChatId(newChat.id)
      responseIndex.current = 0
      setMessages([{
        id: 'welcome',
        role: 'ai',
        text: 'Conversation cleared. How can I assist you?',
        done: true,
        ts: new Date(),
      }])
    } catch (err) {
      console.error('[useChat] clearChat error:', err)
    }
  }, [chatId, user.id])

  return { messages, chatId, isThinking, isLoading, sendMessage, clearChat }
}
