import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Send, Sun, Moon, Copy, Check,
  Zap,
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

function AIAvatar() {
  return (
    <motion.div 
      whileHover={{ scale: 1.12 }}
      className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 dark:from-violet-600 dark:via-purple-600 dark:to-indigo-700 flex items-center justify-center shadow-lg shadow-violet-500/30 dark:shadow-violet-600/40 ring-1 ring-violet-400/40 dark:ring-violet-400/60 relative overflow-hidden group"
    >
      {/* Shine animation */}
      <motion.div 
        animate={{ x: ['100%', '-100%'] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />
      <Zap size={15} className="text-white relative z-10" strokeWidth={2.5} />
    </motion.div>
  )
}

function AIMessage({ message }: { message: Message }) {
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
      transition={{ duration: 0.3 }}
      className="group flex gap-4 px-5 py-6 hover:bg-white/[0.02] dark:hover:bg-white/[0.03] transition-colors rounded-lg"
    >
      <AIAvatar />
      <div className="flex-1 min-w-0 space-y-2.5 pt-1">
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-black tracking-widest uppercase text-violet-600 dark:text-violet-400 select-none">Sovereign GPT</span>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-600 select-none">{message.ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <p className="text-[15px] leading-[1.8] text-zinc-800 dark:text-zinc-100 whitespace-pre-wrap break-words font-medium">
          {message.text}
          {!message.done && <span className="inline-block w-[2px] h-[16px] ml-[3px] bg-gradient-to-b from-violet-500 to-transparent animate-pulse" />}
        </p>
        {message.done && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity pt-1">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copy} 
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/10 transition-all"
            >
              {hasCopied ? <><Check size={12} className="text-emerald-500" /> Copied</> : <><Copy size={12} /> Copy</>}
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
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-[75%] px-4 py-3 rounded-2xl rounded-br-sm bg-gradient-to-br from-violet-600 to-indigo-600 dark:from-violet-600 dark:to-indigo-700 text-white text-[15px] shadow-lg shadow-violet-500/25 dark:shadow-violet-600/30 font-medium leading-relaxed"
      >
        {message.text}
      </motion.div>
    </div>
  )
}

function ThinkingIndicator() {
  return (
    <div className="flex gap-4 px-5 py-6">
      <AIAvatar />
      <div className="flex items-center gap-2 py-2">
        {[0, 1, 2].map(i => (
          <motion.span 
            key={i} 
            className="w-2 h-2 rounded-full bg-gradient-to-b from-violet-500 to-indigo-500" 
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }} 
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} 
          />
        ))}
      </div>
    </div>
  )
}

export default function ChatPage({ onSignOut, theme, toggleTheme }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([{ id: 'welcome', role: 'assistant', text: 'Sovereign GPT online. How can I assist you today?', done: true, ts: new Date() }])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [engineOnline, setEngineOnline] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { checkHealth().then(setEngineOnline) }, [])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isThinking])

  const sendMessage = useCallback(async () => {
    const text = input.trim(); if (!text || isThinking) return
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', text, done: true, ts: new Date() }
    setMessages(prev => [...prev, userMsg]); setInput(''); setIsThinking(true)
    const aiId = `a-${Date.now()}`
    try {
      setMessages(prev => [...prev, { id: aiId, role: 'assistant', text: '', done: false, ts: new Date() }])
      setIsThinking(false)
      await streamChat([...messages, userMsg].map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })), (chunk) => {
        setMessages(prev => prev.map(m => m.id === aiId ? { ...m, text: m.text + chunk } : m))
      })
      setMessages(prev => prev.map(m => m.id === aiId ? { ...m, done: true } : m))
    } catch {
      setMessages(prev => prev.map(m => m.id === aiId ? { ...m, text: 'Engine Offline. Check Tunnel.', done: true } : m))
      setIsThinking(false)
    }
  }, [input, isThinking, messages])

  return (
    <div className="flex flex-col h-full bg-white dark:bg-transparent transition-theme">
      {/* Premium Header */}
      <header className="flex-shrink-0 flex items-center justify-between px-6 h-16 border-b border-zinc-200/50 dark:border-white/10 glass-lg">
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.08, rotate: 5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg blur-lg opacity-40 dark:opacity-50" />
            <Zap size={20} className="text-violet-600 dark:text-violet-400 relative z-10" strokeWidth={2.5} />
          </motion.div>
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-[15px] text-zinc-900 dark:text-white tracking-tight">Sovereign GPT</span>
            <motion.div 
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider ${engineOnline ? 'bg-emerald-500/20 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/20 dark:bg-red-500/15 text-red-600 dark:text-red-400'}`}
            >
              {engineOnline ? '● ONLINE' : '● OFFLINE'}
            </motion.div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button 
            onClick={toggleTheme}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-9 h-9 rounded-lg glass flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all group"
          >
            {theme === 'dark' ? 
              <Sun size={16} className="group-hover:rotate-12 transition-transform" /> : 
              <Moon size={16} className="group-hover:-rotate-12 transition-transform" />
            }
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSignOut} 
            className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/10 transition-all"
          >
            Sign Out
          </motion.button>
        </div>
      </header>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="max-w-4xl mx-auto">
          {messages.map(m => m.role === 'assistant' ? <AIMessage key={m.id} message={m} /> : <UserMessage key={m.id} message={m} />)}
          {isThinking && <ThinkingIndicator />}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Premium Input Area */}
      <div className="flex-shrink-0 px-4 py-4 bg-gradient-to-t from-white dark:from-slate-950 dark:to-slate-950/50 border-t border-zinc-200/50 dark:border-white/10 backdrop-blur-sm transition-theme">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-3 shadow-lg flex gap-3"
          >
            <textarea 
              ref={textareaRef}
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())} 
              placeholder="Ask Sovereign GPT anything…" 
              className="flex-1 bg-transparent text-zinc-900 dark:text-zinc-50 outline-none resize-none p-2 placeholder-zinc-400 dark:placeholder-zinc-600 text-[14px] leading-relaxed font-medium" 
              rows={1} 
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              disabled={!input.trim() || isThinking}
              className="p-2.5 bg-gradient-to-br from-violet-600 to-indigo-600 dark:from-violet-600 dark:to-indigo-700 hover:from-violet-700 hover:to-indigo-700 dark:hover:from-violet-700 dark:hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-all shadow-lg shadow-violet-500/30 dark:shadow-violet-600/40 group flex-shrink-0"
            >
              <Send size={18} className="group-hover:scale-110 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
