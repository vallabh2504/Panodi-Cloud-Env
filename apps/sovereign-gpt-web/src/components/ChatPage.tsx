import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Sun, Moon, Copy, Check, LogOut,
  Zap, RotateCcw, ChevronDown,
} from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import type { Theme } from '../App'
import { useChat, type Message } from '../hooks/useChat'

/* ─── Props ─────────────────────────────────────────────────── */
interface ChatPageProps {
  onSignOut: () => void
  theme: Theme
  toggleTheme: () => void
  user: User
}

/* ─── Typewriter hook ────────────────────────────────────────── */
function useTypewriter(text: string, active: boolean, speed = 14) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    if (!active) { setDisplayed(text); return }
    setDisplayed('')
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, active, speed])
  return displayed
}

/* ─── AI Avatar ──────────────────────────────────────────────── */
function AIAvatar() {
  return (
    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 ring-1 ring-violet-400/20">
      <Zap size={14} className="text-white" strokeWidth={2.5} />
    </div>
  )
}

/* ─── AI Message ─────────────────────────────────────────────── */
function AIMessage({ message }: { message: Message }) {
  const text = useTypewriter(message.text, !message.done)
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(message.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group flex gap-4 px-4 py-5"
    >
      <AIAvatar />

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold tracking-widest uppercase text-violet-500 dark:text-violet-400 select-none">
            Sovereign GPT
          </span>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-600 select-none">
            {message.ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <p className="text-[15px] leading-[1.75] text-zinc-800 dark:text-zinc-100 font-normal tracking-[-0.01em]">
          {text}
          {!message.done && (
            <span className="inline-block w-[2px] h-[15px] ml-[2px] bg-violet-400 rounded-full align-middle cursor-blink" />
          )}
        </p>

        {message.done && (
          <div className="flex items-center gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={copy}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            >
              {copied
                ? <><Check size={12} className="text-emerald-500" /> Copied</>
                : <><Copy size={12} /> Copy</>
              }
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ─── User Message ───────────────────────────────────────────── */
function UserMessage({ message }: { message: Message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="flex justify-end px-4 py-2"
    >
      <div className="group relative max-w-[75%]">
        <div className="px-4 py-3 rounded-2xl rounded-br-sm bg-gradient-to-br from-violet-600 to-indigo-600 text-white text-[15px] leading-relaxed font-normal shadow-md shadow-violet-600/20 select-text">
          {message.text}
        </div>
        <div className="text-right mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] text-zinc-400 dark:text-zinc-600">
            {message.ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Thinking Indicator ─────────────────────────────────────── */
function ThinkingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.25 }}
      className="flex gap-4 px-4 py-5"
    >
      <AIAvatar />
      <div className="flex items-center gap-1.5 py-2">
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            className="block w-[7px] h-[7px] rounded-full bg-violet-400 dark:bg-violet-500"
            animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </motion.div>
  )
}

/* ─── Date Divider ───────────────────────────────────────────── */
function DateDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2">
      <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
      <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-600 select-none">{label}</span>
      <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
    </div>
  )
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function ChatPage({ onSignOut, theme, toggleTheme, user }: ChatPageProps) {
  const { messages, isThinking, isLoading, sendMessage, clearChat } = useChat(user)

  const [input, setInput]           = useState('')
  const [showScrollBtn, setShowScrollBtn] = useState(false)

  const bottomRef    = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const textareaRef  = useRef<HTMLTextAreaElement>(null)

  /* Auto-scroll on new messages */
  const scrollToBottom = useCallback((smooth = true) => {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isThinking, scrollToBottom])

  /* Show scroll-to-bottom button when user scrolls up */
  useEffect(() => {
    const el = scrollAreaRef.current
    if (!el) return
    const handler = () => {
      const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
      setShowScrollBtn(distFromBottom > 200)
    }
    el.addEventListener('scroll', handler, { passive: true })
    return () => el.removeEventListener('scroll', handler)
  }, [])

  /* Auto-resize textarea */
  const resizeTextarea = useCallback(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 180) + 'px'
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    resizeTextarea()
  }

  /* Submit */
  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || isThinking) return
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    await sendMessage(text)
  }, [input, isThinking, sendMessage])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  /* User display */
  const avatarUrl   = user.user_metadata?.avatar_url as string | undefined
  const displayName = (user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'User') as string
  const initial     = displayName[0]?.toUpperCase() ?? 'U'

  /* ── Loading skeleton while chat history is being fetched ── */
  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-zinc-50 dark:bg-[#0b0b0f]">
        <div className="flex items-center gap-3 text-sm text-zinc-400 dark:text-zinc-600">
          <div className="w-5 h-5 rounded-full border-2 border-violet-300 dark:border-violet-800 border-t-violet-500 animate-spin" />
          Loading conversation…
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-zinc-50 dark:bg-[#0b0b0f] transition-colors duration-300">

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="flex-shrink-0 z-40 flex items-center justify-between px-4 h-[60px] border-b border-zinc-200/80 dark:border-zinc-800/60 bg-white/80 dark:bg-[#0b0b0f]/80 backdrop-blur-xl">

        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/25 ring-1 ring-violet-400/20">
            <Zap size={14} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="flex items-center gap-2.5 select-none">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Sovereign GPT
            </span>
            <div className="hidden sm:flex items-center gap-1.5 h-[22px] px-2.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Online</span>
            </div>
            <div className="hidden md:flex items-center h-[22px] px-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60">
              <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">608K params</span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1">
          <button
            onClick={clearChat}
            title="Clear conversation"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-all duration-150"
          >
            <RotateCcw size={15} />
          </button>

          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-all duration-150"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <div className="w-px h-5 mx-1 bg-zinc-200 dark:bg-zinc-700/60" />

          <div className="flex items-center gap-2.5">
            {avatarUrl
              ? <img src={avatarUrl} alt={displayName} className="w-7 h-7 rounded-full ring-2 ring-violet-400/30 object-cover" />
              : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-violet-400/20 select-none">
                  {initial}
                </div>
              )
            }
            <span className="hidden lg:block text-xs font-medium text-zinc-600 dark:text-zinc-400 max-w-[120px] truncate select-none">
              {displayName}
            </span>
          </div>

          <button
            onClick={onSignOut}
            title="Sign out"
            className="flex items-center gap-1.5 h-9 px-3 ml-1 rounded-xl text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-all duration-150"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      {/* ── Messages ───────────────────────────────────────── */}
      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto scroll-smooth">
        <div className="max-w-3xl mx-auto pb-6 pt-2">
          <DateDivider label="Today" />

          <AnimatePresence initial={false}>
            {messages.map(msg =>
              msg.role === 'ai'
                ? <AIMessage key={msg.id} message={msg} />
                : <UserMessage key={msg.id} message={msg} />
            )}
            {isThinking && <ThinkingIndicator key="thinking" />}
          </AnimatePresence>

          <div ref={bottomRef} className="h-2" />
        </div>
      </div>

      {/* ── Scroll-to-bottom button ─────────────────────────── */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.85, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 8 }}
            transition={{ duration: 0.2 }}
            onClick={() => scrollToBottom()}
            className="absolute bottom-[110px] left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-lg hover:shadow-xl transition-shadow"
          >
            <ChevronDown size={13} />
            Scroll to bottom
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Input ──────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-t border-zinc-200/80 dark:border-zinc-800/60 bg-white/80 dark:bg-[#0b0b0f]/80 backdrop-blur-xl px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end rounded-2xl border border-zinc-200 dark:border-zinc-700/60 bg-white dark:bg-zinc-900/80 shadow-sm focus-within:border-violet-400/60 dark:focus-within:border-violet-500/50 focus-within:ring-2 focus-within:ring-violet-400/10 dark:focus-within:ring-violet-500/10 transition-all duration-200">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Message Sovereign GPT…"
              rows={1}
              disabled={isThinking}
              className="flex-1 min-w-0 bg-transparent text-[14px] text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 resize-none focus:outline-none px-5 py-[14px] leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ maxHeight: '180px' }}
            />

            <div className="flex-shrink-0 p-2.5">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={handleSend}
                disabled={!input.trim() || isThinking}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-violet-600 transition-colors shadow-md shadow-violet-500/25"
              >
                {isThinking
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <Send size={15} strokeWidth={2} />
                }
              </motion.button>
            </div>
          </div>

          <p className="flex items-center justify-center gap-2 mt-2.5 text-[11px] text-zinc-400 dark:text-zinc-600 select-none">
            <span className="inline-flex items-center gap-0.5">
              <kbd className="px-1.5 py-0.5 rounded-md border border-zinc-300 dark:border-zinc-700 font-mono text-[10px] text-zinc-500 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-800">⏎</kbd>
              {' '}to send
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <span className="inline-flex items-center gap-0.5">
              <kbd className="px-1.5 py-0.5 rounded-md border border-zinc-300 dark:border-zinc-700 font-mono text-[10px] text-zinc-500 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-800">⇧⏎</kbd>
              {' '}new line
            </span>
          </p>
        </div>
      </div>

    </div>
  )
}
