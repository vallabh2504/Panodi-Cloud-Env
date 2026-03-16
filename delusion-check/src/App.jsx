import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, TrendingDown, AlertTriangle } from 'lucide-react'
import FloatingEmojis from './components/FloatingEmojis'
import RoastCard from './components/RoastCard'
import { analyzeDelusion } from './utils/roastEngine'

// ── Scanning animation shown while "processing" ──
function ScanningOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(5,5,16,0.92)' }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Spinning hexagon scanner */}
        <div className="relative w-24 h-24">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full"
            style={{ border: '2px solid transparent', borderTopColor: '#39ff14', borderRightColor: '#39ff14' }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-3 rounded-full"
            style={{ border: '2px solid transparent', borderTopColor: '#ff2d78', borderLeftColor: '#ff2d78' }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-3xl">🤡</div>
        </div>

        <div className="text-center">
          <motion.p
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="font-mono text-sm tracking-widest uppercase"
            style={{ color: '#39ff14' }}
          >
            Scanning Delusion Levels...
          </motion.p>
          <p className="font-mono text-xs mt-1" style={{ color: 'rgba(226,232,240,0.3)' }}>
            Cross-referencing with reality database
          </p>
        </div>

        {/* Fake progress bar */}
        <div className="w-48 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(57,255,20,0.1)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
            className="h-full"
            style={{ background: 'linear-gradient(90deg, #39ff14, #ff2d78)', boxShadow: '0 0 10px #39ff14' }}
          />
        </div>
      </div>
    </motion.div>
  )
}

// ── Input form ──
function InputForm({ onSubmit }) {
  const [dream, setDream] = useState('')
  const [reality, setReality] = useState('')
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (dream.trim().length < 5) e.dream = 'Tell us more about your dream (min 5 chars)'
    if (reality.trim().length < 5) e.reality = 'Be honest about your reality (min 5 chars)'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) onSubmit(dream.trim(), reality.trim())
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto flex flex-col gap-6"
    >
      {/* Dream input */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest" style={{ color: '#00f5ff' }}>
          <Zap size={12} />
          Your Wildest Dream / Goal
        </label>
        <textarea
          value={dream}
          onChange={e => { setDream(e.target.value); setErrors(p => ({ ...p, dream: '' })) }}
          placeholder="e.g. Become a billionaire by selling chai from a cart by next year..."
          rows={3}
          className="cyber-input w-full rounded-sm px-4 py-3 text-sm"
          style={errors.dream ? { borderColor: '#ff2d78', boxShadow: '0 0 0 1px #ff2d78' } : {}}
        />
        {errors.dream && (
          <p className="text-xs font-mono" style={{ color: '#ff2d78' }}>{errors.dream}</p>
        )}
        <div className="flex items-center justify-between">
          <p className="text-xs font-mono" style={{ color: 'rgba(226,232,240,0.3)' }}>
            Be ambitious. Be specific.
          </p>
          <span className="text-xs font-mono" style={{ color: dream.length > 200 ? '#ff2d78' : 'rgba(226,232,240,0.25)' }}>
            {dream.length}/250
          </span>
        </div>
      </div>

      {/* Divider with icon */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: 'rgba(255,45,120,0.2)' }} />
        <TrendingDown size={16} style={{ color: '#ff2d78', opacity: 0.6 }} />
        <div className="h-px flex-1" style={{ background: 'rgba(255,45,120,0.2)' }} />
      </div>

      {/* Reality input */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest" style={{ color: '#ff2d78' }}>
          <AlertTriangle size={12} />
          Your Current Reality
        </label>
        <textarea
          value={reality}
          onChange={e => { setReality(e.target.value); setErrors(p => ({ ...p, reality: '' })) }}
          placeholder="e.g. I spend 8 hours scrolling Instagram, binge Netflix, and procrastinate daily..."
          rows={3}
          className="cyber-input w-full rounded-sm px-4 py-3 text-sm"
          style={errors.reality ? { borderColor: '#ff2d78', boxShadow: '0 0 0 1px #ff2d78' } : {}}
        />
        {errors.reality && (
          <p className="text-xs font-mono" style={{ color: '#ff2d78' }}>{errors.reality}</p>
        )}
        <div className="flex items-center justify-between">
          <p className="text-xs font-mono" style={{ color: 'rgba(226,232,240,0.3)' }}>
            Be brutally honest. We can handle it.
          </p>
          <span className="text-xs font-mono" style={{ color: reality.length > 200 ? '#ff2d78' : 'rgba(226,232,240,0.25)' }}>
            {reality.length}/250
          </span>
        </div>
      </div>

      {/* Submit button */}
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="relative w-full py-4 rounded-sm font-mono font-bold text-sm uppercase tracking-widest overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(57,255,20,0.15) 0%, rgba(255,45,120,0.15) 100%)',
          border: '1px solid rgba(57,255,20,0.5)',
          color: '#39ff14',
          boxShadow: '0 0 30px rgba(57,255,20,0.2), 0 0 60px rgba(57,255,20,0.1)',
        }}
      >
        {/* Shine sweep */}
        <motion.div
          className="absolute inset-0 -skew-x-12"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)' }}
          animate={{ x: ['-200%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="relative z-10 flex items-center justify-center gap-2">
          <Zap size={16} />
          RUN DELUSION CHECK
          <Zap size={16} />
        </span>
      </motion.button>

      {/* Disclaimer */}
      <p className="text-center text-xs font-mono" style={{ color: 'rgba(226,232,240,0.2)' }}>
        ⚠️ Results may cause existential crisis. Hyderabadi roasts are brutal but loving.
      </p>
    </motion.form>
  )
}

// ── Header ──
function Header() {
  return (
    <div className="text-center mb-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.4em] mb-4 px-4 py-1.5 rounded-sm"
        style={{
          border: '1px solid rgba(255,45,120,0.3)',
          color: '#ff2d78',
          background: 'rgba(255,45,120,0.05)',
        }}
      >
        <span className="animate-pulse-neon">◉</span>
        Reality Check Protocol v1.0
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1, type: 'spring', stiffness: 200 }}
        className="text-4xl md:text-6xl lg:text-7xl font-bold mb-3 leading-none"
      >
        <span className="glow-green" style={{ color: '#39ff14' }}>DELUSION</span>
        <br />
        <span className="glow-pink" style={{ color: '#ff2d78' }}>CHECK</span>
        <span style={{ color: 'rgba(226,232,240,0.4)' }}>.AI</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-sm md:text-base font-mono max-w-lg mx-auto"
        style={{ color: 'rgba(226,232,240,0.5)' }}
      >
        Enter your dream. Face your reality. Get roasted by Hyderabad's finest.
        <br />
        <span style={{ color: 'rgba(226,232,240,0.3)' }}>No filter. No mercy. 100% free.</span>
      </motion.p>
    </div>
  )
}

// ── Main App ──
export default function App() {
  const [phase, setPhase] = useState('input') // 'input' | 'scanning' | 'result'
  const [result, setResult] = useState(null)
  const [inputData, setInputData] = useState({ dream: '', reality: '' })

  const handleSubmit = (dream, reality) => {
    setInputData({ dream, reality })
    setPhase('scanning')

    setTimeout(() => {
      const analysis = analyzeDelusion(dream, reality)
      setResult(analysis)
      setPhase('result')
    }, 1600)
  }

  const handleReset = () => {
    setPhase('input')
    setResult(null)
  }

  return (
    <div className="min-h-screen grid-bg relative">
      <FloatingEmojis />

      {/* Radial glow background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(57,255,20,0.06) 0%, transparent 70%), radial-gradient(ellipse 50% 30% at 80% 100%, rgba(255,45,120,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Nav bar */}
        <nav className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(57,255,20,0.1)' }}>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold font-mono glow-green" style={{ color: '#39ff14' }}>DC</span>
            <span className="text-xs font-mono" style={{ color: 'rgba(226,232,240,0.3)' }}>.ai</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono" style={{ color: 'rgba(226,232,240,0.3)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#39ff14', boxShadow: '0 0 6px #39ff14' }} />
            SYSTEM ONLINE
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="w-full max-w-2xl">
            <Header />

            <AnimatePresence mode="wait">
              {phase === 'input' && (
                <InputForm key="input" onSubmit={handleSubmit} />
              )}
              {phase === 'result' && result && (
                <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <RoastCard
                    result={result}
                    dream={inputData.dream}
                    reality={inputData.reality}
                    onReset={handleReset}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-4 text-xs font-mono border-t" style={{ borderColor: 'rgba(57,255,20,0.08)', color: 'rgba(226,232,240,0.2)' }}>
          DelusionCheck.ai — Built with ❤️ and brutal honesty in Hyderabad
        </footer>
      </div>

      {/* Scanning overlay */}
      <AnimatePresence>
        {phase === 'scanning' && <ScanningOverlay key="scan" />}
      </AnimatePresence>
    </div>
  )
}
