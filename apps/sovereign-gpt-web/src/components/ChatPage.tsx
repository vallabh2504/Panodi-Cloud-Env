import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Sun, Moon, Copy, Check,
  Zap, TreePine, Binary, Palette,
} from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import type { Theme } from '../App'
import { streamChat, checkHealth } from '../lib/api'

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  done: boolean
  ts: Date
}

interface ChatPageProps {
  onSignOut: () => void
  theme: Theme
  toggleTheme: () => void
  user: User
}

const themeIcons: Record<Theme, React.ReactNode> = {
  dark: <Moon size={16} />,
  light: <Sun size={16} />,
  forest: <TreePine size={16} />,
  cyber: <Binary size={16} />,
}

const themeLabels: Record<Theme, string> = {
  dark: 'Obsidian',
  light: 'Frosted',
  forest: 'Forest',
  cyber: 'Cyber',
}

const avatarGradients: Record<Theme, string> = {
  dark: 'from-violet-500 via-purple-500 to-indigo-600',
  light: 'from-indigo-400 via-blue-400 to-indigo-500',
  forest: 'from-emerald-500 via-green-600 to-teal-700',
  cyber: 'from-fuchsia-500 via-purple-600 to-cyan-500',
}

const easeOut = [0.23, 1, 0.32, 1] as const

function AIAvatar({ theme }: { theme: Theme }) {
  return (
    <motion.div
      whileHover={{ scale: 1.12 }}
      className={`flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br ${avatarGradients[theme]} flex items-center justify-center shadow-lg relative overflow-hidden transition-all duration-500`}
    >
      <motion.div
        animate={{ x: ['100%', '-100%'] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />
      <Zap size={15} className="text-white relative z-10" strokeWidth={2.5} />
    </motion.div>
  )
}

function AIMessage({ message, theme }: { message: Message; theme: Theme }) {
  const [hasCopied, setHasCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(message.text)
    setHasCopied(true)
    setTimeout(() => setHasCopied(false), 2000)
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: easeOut }}
      className="group flex gap-4 px-5 py-6 hover:bg-white/[0.02] dark:hover:bg-white/[0.02] transition-colors rounded-2xl"
    >
      <AIAvatar theme={theme} />
      <div className="flex-1 min-w-0 space-y-2.5 pt-1">
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-black tracking-widest uppercase accent-text select-none">Sovereign GPT</span>
          <span className="text-[10px] opacity-40 select-none">
            {message.ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="text-[15px] leading-[1.8] whitespace-pre-wrap break-words font-medium transition-all duration-300">
          {message.text}
          {!message.done && <span className="streaming-cursor" />}
        </div>
        {message.done && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity pt-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copy}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold glass hover:bg-white/10 transition-all"
            >
              {hasCopied ? (
                <><Check size={12} className="text-emerald-500" /> Copied</>
              ) : (
                <><Copy size={12} /> Copy</>
              )}
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function UserMessage({ message }: { message: Message }) {
  return (
    <div className="flex justify-end px-5 py-3">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.4, ease: easeOut }}
        className="bubble-user text-white text-[15px] font-medium leading-relaxed"
      >
        {message.text}
      </motion.div>
    </div>
  )
}

function ThinkingIndicator({ theme }: { theme: Theme }) {
  return (
    <div className="flex gap-4 px-5 py-6">
      <AIAvatar theme={theme} />
      <div className="flex items-center gap-2 py-2">
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-current opacity-40"
            animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  )
}

export default function ChatPage({ onSignOut, theme, toggleTheme }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'assistant', text: 'Sovereign GPT online. How can I assist you today?', done: true, ts: new Date() },
  ])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [engineOnline, setEngineOnline] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { checkHealth().then(setEngineOnline) }, [])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isThinking])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || isThinking) return
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', text, done: true, ts: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsThinking(true)
    const aiId = `a-${Date.now()}`
    try {
      setMessages(prev => [...prev, { id: aiId, role: 'assistant', text: '', done: false, ts: new Date() }])
      setIsThinking(false)
      await streamChat(
        [...messages, userMsg].map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })),
        (chunk) => {
          setMessages(prev => prev.map(m => (m.id === aiId ? { ...m, text: m.text + chunk } : m)))
        },
      )
      setMessages(prev => prev.map(m => (m.id === aiId ? { ...m, done: true } : m)))
    } catch {
      setMessages(prev => prev.map(m => (m.id === aiId ? { ...m, text: 'Engine Offline. Check Tunnel.', done: true } : m)))
      setIsThinking(false)
    }
  }, [input, isThinking, messages])

  return (
    <div className="flex flex-col h-full transition-all duration-700">
      {/* ── Premium Header ─────────────────────────────────────── */}
      <header className="flex-shrink-0 flex items-center justify-between px-6 h-16 header-glow glass backdrop-blur-xl z-50">
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.08, rotate: 5 }} className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--accent))] to-[rgb(var(--accent-glow))] rounded-lg blur-lg opacity-40" />
            <Zap size={20} className="relative z-10 accent-text" strokeWidth={2.5} />
          </motion.div>
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-[15px] tracking-tight">Sovereign GPT</span>
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider"
              style={{
                background: engineOnline ? 'var(--status-online-bg)' : 'rgba(239, 68, 68, 0.15)',
                color: engineOnline ? 'var(--status-online-text)' : '#f87171',
              }}
            >
              {engineOnline ? '\u25CF ONLINE' : '\u25CF OFFLINE'}
            </motion.div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme cycle button */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="h-10 px-3 rounded-xl glass flex items-center gap-2 transition-all group overflow-hidden"
            title={`Theme: ${themeLabels[theme]}`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ y: 20, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: -20, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-1.5"
              >
                {themeIcons[theme]}
                <span className="text-[10px] font-bold tracking-widest uppercase hidden sm:inline">
                  {themeLabels[theme]}
                </span>
              </motion.div>
            </AnimatePresence>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSignOut}
            className="text-sm font-semibold opacity-60 hover:opacity-100 px-3 py-2 rounded-lg hover:bg-white/10 transition-all"
          >
            Sign Out
          </motion.button>
        </div>
      </header>

      {/* ── Messages ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto scrollbar-hide py-4">
        <div className="max-w-4xl mx-auto">
          {messages.map(m =>
            m.role === 'assistant' ? (
              <AIMessage key={m.id} message={m} theme={theme} />
            ) : (
              <UserMessage key={m.id} message={m} />
            ),
          )}
          {isThinking && <ThinkingIndicator theme={theme} />}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Premium Input Area ─────────────────────────────────── */}
      <div className="flex-shrink-0 px-4 py-6 bg-gradient-to-t from-black/20 to-transparent backdrop-blur-sm z-50">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass input-glow rounded-2xl p-3 shadow-2xl flex gap-3 transition-all duration-300"
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              placeholder="Ask Sovereign GPT anything\u2026"
              className="flex-1 bg-transparent outline-none resize-none p-2 placeholder-current/20 text-[14px] leading-relaxed font-medium"
              rows={1}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              disabled={!input.trim() || isThinking}
              className="p-2.5 rounded-xl transition-all shadow-xl group flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(135deg, rgb(var(--accent)), rgb(var(--accent-glow)))`,
              }}
            >
              <Send size={18} className="text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
