import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import OrbBackground from './OrbBackground'
import { streamChat, checkHealth, type ChatMessage as ApiMessage } from '../lib/api'

interface Message {
  id: string
  role: 'user' | 'ai'
  text: string
  done: boolean
}

interface ChatPageProps {
  onSignOut: () => void
}

function useTypewriter(text: string, active: boolean, speed = 18) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    if (!active) { setDisplayed(text); return }
    setDisplayed('')
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(interval)
    }, speed)
    return () => clearInterval(interval)
  }, [text, active, speed])

  return displayed
}

function AIBubble({ message }: { message: Message }) {
  const text = useTypewriter(message.text, !message.done)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-start gap-3 max-w-[80%]"
    >
      <div
        className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm"
        style={{ background: 'linear-gradient(135deg, #ff6b35 0%, #0ea5e9 100%)' }}
      >
        🤖
      </div>
      <div
        className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed text-slate-200"
        style={{
          background: 'rgba(15,23,42,0.6)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(16px)',
        }}
      >
        {text}
        {!message.done && (
          <span className="inline-block w-1 h-4 ml-0.5 bg-sky-400 animate-pulse rounded-sm align-middle" />
        )}
      </div>
    </motion.div>
  )
}

function UserBubble({ message }: { message: Message }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex justify-end"
    >
      <div
        className="rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed text-white font-medium max-w-[80%]"
        style={{
          background: 'linear-gradient(135deg, rgba(255,107,53,0.25) 0%, rgba(14,165,233,0.25) 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(16px)',
        }}
      >
        {message.text}
      </div>
    </motion.div>
  )
}

export default function ChatPage({ onSignOut }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'ai',
      text: 'Sovereign GPT online. Factory loop initialized. How can I assist you today?',
      done: true,
    },
  ])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [engineStatus, setEngineStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Check engine health on mount
  useEffect(() => {
    checkHealth()
      .then(() => setEngineStatus('online'))
      .catch(() => setEngineStatus('offline'))
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(() => {
    const text = input.trim()
    if (!text || isThinking) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text, done: true }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsThinking(true)

    // Build conversation history for the API
    const history: ApiMessage[] = messages
      .filter(m => m.id !== '0') // skip the welcome message
      .map(m => ({
        role: m.role === 'ai' ? 'assistant' as const : 'user' as const,
        content: m.text,
      }))
    history.push({ role: 'user', content: text })

    const aiMsgId = (Date.now() + 1).toString()

    // Create the AI message placeholder for streaming
    const aiMsg: Message = { id: aiMsgId, role: 'ai', text: '', done: false }
    setMessages(prev => [...prev, aiMsg])
    setIsThinking(false)

    streamChat(
      history,
      // onToken — append each token as it arrives
      (token) => {
        setMessages(prev =>
          prev.map(m => m.id === aiMsgId ? { ...m, text: m.text + token } : m)
        )
      },
      // onDone — mark the message as complete
      () => {
        setMessages(prev =>
          prev.map(m => m.id === aiMsgId ? { ...m, done: true } : m)
        )
      },
      // onError — show error in the AI bubble
      (error) => {
        setMessages(prev =>
          prev.map(m => m.id === aiMsgId
            ? { ...m, text: `Error: ${error}`, done: true }
            : m
          )
        )
      },
    )
  }, [input, isThinking, messages])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const statusColor = engineStatus === 'online'
    ? 'bg-emerald-400'
    : engineStatus === 'offline'
      ? 'bg-red-400'
      : 'bg-yellow-400'

  const statusText = engineStatus === 'online'
    ? 'Engine Online'
    : engineStatus === 'offline'
      ? 'Engine Offline'
      : 'Connecting...'

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 overflow-hidden">
      <OrbBackground />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-white/5"
        style={{ background: 'rgba(2,6,23,0.7)', backdropFilter: 'blur(20px)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{ background: 'linear-gradient(135deg, #ff6b35 0%, #0ea5e9 100%)' }}
          >
            🤖
          </div>
          <div>
            <h1 className="text-white font-black text-base tracking-tight leading-none">Sovereign GPT</h1>
            <p className="text-slate-500 text-xs mt-0.5 font-medium">The Autonomous Factory Engine</p>
          </div>
        </div>

        {/* Model Status */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-semibold"
            style={{ background: 'rgba(14,165,233,0.1)', color: '#38bdf8' }}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusColor} animate-pulse`} />
            {statusText}
          </div>
          <button
            onClick={onSignOut}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors border border-white/5 hover:border-white/10"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            Sign out
          </button>
        </div>
      </motion.header>

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map(msg =>
            msg.role === 'ai'
              ? <AIBubble key={msg.id} message={msg} />
              : <UserBubble key={msg.id} message={msg} />
          )}
          {isThinking && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-start gap-3"
            >
              <div
                className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                style={{ background: 'linear-gradient(135deg, #ff6b35 0%, #0ea5e9 100%)' }}
              >
                🤖
              </div>
              <div
                className="rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5"
                style={{
                  background: 'rgba(15,23,42,0.6)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                {[0, 1, 2].map(i => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    className="w-1.5 h-1.5 rounded-full bg-sky-400"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 px-4 pb-4 pt-2 border-t border-white/5"
        style={{ background: 'rgba(2,6,23,0.7)', backdropFilter: 'blur(20px)' }}
      >
        <div
          className="flex items-end gap-3 rounded-2xl px-4 py-3 border border-white/10 focus-within:border-sky-500/40 transition-colors"
          style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(16px)' }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={engineStatus === 'offline' ? 'Engine offline — start bridge_api.py first' : 'Send a message...'}
            rows={1}
            disabled={engineStatus === 'offline'}
            className="flex-1 bg-transparent text-white text-sm placeholder-slate-500 resize-none focus:outline-none leading-relaxed disabled:opacity-50"
            style={{ maxHeight: '120px' }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendMessage}
            disabled={!input.trim() || isThinking || engineStatus === 'offline'}
            className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-white transition-opacity disabled:opacity-30"
            style={{ background: 'linear-gradient(135deg, #ff6b35 0%, #0ea5e9 100%)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </motion.button>
        </div>
        <p className="text-center text-slate-600 text-xs mt-2 font-semibold tracking-widest uppercase">
          Protocol V15.4 • Stable
        </p>
      </motion.div>
    </div>
  )
}
