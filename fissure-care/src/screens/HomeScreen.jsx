import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { PlusCircle, Flame, Sparkles, Timer, X, Music } from 'lucide-react'
import { getLog, getStreak, calcWellnessScore, getSettings } from '../lib/storage'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'

const tips = [
  'Warm sitz baths 3 times a day can help relax the area and speed up healing.',
  'Papaya contains papain, an enzyme that gently aids digestion. Try some today!',
  '8 glasses of water a day keeps hard stools away — your healing best friend.',
  'Gentle walking for 20 minutes helps improve blood flow to the healing area.',
  'Pear and kiwi have natural sorbitol that softens stools — great snack choices.',
  'Stress can worsen discomfort. Even 5 minutes of deep breathing helps.',
  'A fiber-rich breakfast of oats or lentils sets you up for an easier day.',
]

const FIBER_GRAMS = {
  psyllium: 7, oats: 4, flaxseeds: 3, lentils: 5, broccoli: 3, greens: 2,
  'whole grain': 3, banana: 3, apple: 4, pear: 5, papaya: 2, kiwi: 2,
  mango: 1, guava: 5, prune: 2, watermelon: 0.5,
}

function estimateFiber(log) {
  let total = 0
  const fibers = log?.fibersEaten || []
  const fruits = log?.fruitsEaten || []
  fibers.forEach(f => { total += FIBER_GRAMS[f?.toLowerCase()] || 3 })
  fruits.forEach(f => { total += FIBER_GRAMS[f?.toLowerCase()] || 2 })
  return Math.round(total)
}

/* ── Falling Particles ── */
function FallingParticles({ theme }) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width = canvas.offsetWidth
    const H = canvas.height = canvas.offsetHeight
    const COUNT = 18
    particlesRef.current = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W, y: Math.random() * H - H,
      size: 10 + Math.random() * 16, speed: 0.3 + Math.random() * 0.6,
      drift: (Math.random() - 0.5) * 0.4, wobbleAmp: 15 + Math.random() * 25,
      wobbleSpeed: 0.008 + Math.random() * 0.012, rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02, opacity: 0.35 + Math.random() * 0.45,
      char: theme.particleChar[Math.floor(Math.random() * theme.particleChar.length)],
      color: theme.particleColors[Math.floor(Math.random() * theme.particleColors.length)],
      phase: Math.random() * Math.PI * 2,
    }))
    let t = 0
    function draw() {
      ctx.clearRect(0, 0, W, H); t++
      for (const p of particlesRef.current) {
        p.y += p.speed; p.x += p.drift + Math.sin(t * p.wobbleSpeed + p.phase) * 0.5
        p.rotation += p.rotSpeed
        if (p.y > H + 30) { p.y = -30; p.x = Math.random() * W }
        if (p.x > W + 30) p.x = -30
        if (p.x < -30) p.x = W + 30
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation)
        ctx.globalAlpha = p.opacity; ctx.font = `${p.size}px serif`
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText(p.char, 0, 0); ctx.restore()
      }
      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [theme])

  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 1,
    }} />
  )
}

/* ── Flowing River SVG ── */
function FlowingRiver({ theme }) {
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 50, overflow: 'hidden', zIndex: 0 }}>
      <svg width="100%" height="50" viewBox="0 0 430 50" preserveAspectRatio="none" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="riverGrad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor={theme.riverHighlight} />
            <stop offset="50%" stopColor={theme.riverColor} />
            <stop offset="100%" stopColor={theme.riverHighlight} />
          </linearGradient>
        </defs>
        <path d="M0,20 Q60,5 110,18 T220,14 T330,20 T430,12 L430,50 L0,50 Z" fill="url(#riverGrad)">
          <animate attributeName="d"
            values="M0,20 Q60,5 110,18 T220,14 T330,20 T430,12 L430,50 L0,50 Z;
                    M0,15 Q70,25 120,12 T230,22 T340,14 T430,20 L430,50 L0,50 Z;
                    M0,20 Q60,5 110,18 T220,14 T330,20 T430,12 L430,50 L0,50 Z"
            dur="4s" repeatCount="indefinite" />
        </path>
        <path d="M0,28 Q80,20 150,30 T280,24 T430,28 L430,50 L0,50 Z" fill={theme.riverColor} opacity="0.5">
          <animate attributeName="d"
            values="M0,28 Q80,20 150,30 T280,24 T430,28 L430,50 L0,50 Z;
                    M0,32 Q70,28 140,22 T270,30 T430,24 L430,50 L0,50 Z;
                    M0,28 Q80,20 150,30 T280,24 T430,28 L430,50 L0,50 Z"
            dur="3.5s" repeatCount="indefinite" />
        </path>
      </svg>
    </div>
  )
}

/* ── Wellness Ring ── */
function WellnessRing({ score, theme }) {
  const radius = 52, stroke = 8
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 70 ? theme.wellnessHigh : score >= 40 ? theme.wellnessLow : '#F48585'
  return (
    <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto' }}>
      <svg width={140} height={140} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={70} cy={70} r={radius} fill="none" stroke={theme.cardBorder} strokeWidth={stroke} />
        <circle cx={70} cy={70} r={radius} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Nunito', color: theme.text }}>{score}</span>
        <span style={{ fontSize: 11, color: theme.textMuted }}>of 100</span>
      </div>
    </div>
  )
}

/* ── Healing Garden Flowers ── */
function HealingGardenFlowers({ bloodFreeDays, theme }) {
  if (bloodFreeDays < 1) return null
  const count = Math.min(bloodFreeDays, 14)
  const flowers = Array.from({ length: count }, (_, i) => ({
    emoji: i % 3 === 0 ? '🌺' : i % 3 === 1 ? '🌸' : '🌼',
    delay: i * 0.06,
  }))
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        margin: '16px 16px 0', background: theme.tipBg,
        borderRadius: 18, padding: '14px 16px',
        border: `1px solid ${theme.tipBorder}`,
      }}
    >
      <p style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 4 }}>
        Your Healing Garden
      </p>
      <p style={{ fontSize: 12, color: theme.textMuted, marginBottom: 10 }}>
        {bloodFreeDays} consecutive blood-free {bloodFreeDays === 1 ? 'day' : 'days'} — each flower is a victory
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {flowers.map((f, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: f.delay, type: 'spring', stiffness: 260, damping: 18 }}
            style={{ fontSize: 22 }}
          >
            {f.emoji}
          </motion.span>
        ))}
        {bloodFreeDays > 14 && (
          <span style={{ fontSize: 12, color: theme.textMuted, alignSelf: 'center', marginLeft: 4 }}>
            +{bloodFreeDays - 14} more
          </span>
        )}
      </div>
    </motion.div>
  )
}

/* ── Fiber Goal Widget ── */
function FiberGoalWidget({ log, theme }) {
  const settings = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('fissurecare_settings') || '{}') } catch { return {} }
  }, [])
  const goal = settings.fiberGoal || 25
  const current = estimateFiber(log)
  const pct = Math.min((current / goal) * 100, 100)
  const suggestions = current < goal
    ? ['Oats (4g)', 'Papaya (2g)', 'Psyllium husk (7g)', 'Pear (5g)', 'Lentils (5g)']
        .slice(0, 3)
    : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      style={{
        margin: '16px 16px 0', background: theme.card,
        borderRadius: 18, padding: '14px 16px',
        border: `1px solid ${theme.cardBorder}`,
        boxShadow: `0 2px 10px ${theme.cardShadow}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>Daily Fiber Goal</p>
        <span style={{ fontSize: 13, fontWeight: 700, color: pct >= 100 ? theme.wellnessHigh : theme.primary }}>
          ~{current}g / {goal}g
        </span>
      </div>
      {/* Progress bar */}
      <div style={{ height: 8, background: theme.cardBorder, borderRadius: 4, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            height: '100%', borderRadius: 4,
            background: pct >= 100 ? theme.wellnessHigh : theme.primary,
          }}
        />
      </div>
      {suggestions.length > 0 ? (
        <p style={{ fontSize: 11, color: theme.textMuted, marginTop: 8 }}>
          Try: {suggestions.join(' · ')}
        </p>
      ) : (
        <p style={{ fontSize: 11, color: theme.wellnessHigh, marginTop: 8, fontWeight: 600 }}>
          Fiber goal reached today!
        </p>
      )}
    </motion.div>
  )
}

/* ── Sitz Bath Pro Timer Modal ── */
const TOTAL_SECS = 15 * 60
const BREATHE_IN = 4, BREATHE_HOLD = 2, BREATHE_OUT = 6
const CYCLE = BREATHE_IN + BREATHE_HOLD + BREATHE_OUT // 12s

function SitzTimerModal({ onClose, theme }) {
  const [secsLeft, setSecsLeft] = useState(TOTAL_SECS)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (running && secsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecsLeft(s => {
          if (s <= 1) { setRunning(false); setDone(true); return 0 }
          return s - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, secsLeft])

  const mins = String(Math.floor(secsLeft / 60)).padStart(2, '0')
  const secs = String(secsLeft % 60).padStart(2, '0')
  const progress = 1 - secsLeft / TOTAL_SECS

  // Breathing phase
  const elapsed = (TOTAL_SECS - secsLeft) % CYCLE
  const breathePhase = elapsed < BREATHE_IN ? 'Breathe In'
    : elapsed < BREATHE_IN + BREATHE_HOLD ? 'Hold'
    : 'Breathe Out'
  const breatheScale = elapsed < BREATHE_IN ? 1 + 0.4 * (elapsed / BREATHE_IN)
    : elapsed < BREATHE_IN + BREATHE_HOLD ? 1.4
    : 1.4 - 0.4 * ((elapsed - BREATHE_IN - BREATHE_HOLD) / BREATHE_OUT)

  const circumference = 2 * Math.PI * 52
  const ringOffset = circumference - progress * circumference

  const openCalmSounds = () => {
    window.open('https://www.youtube.com/results?search_query=calm+nature+sounds+relaxation', '_blank', 'noopener,noreferrer')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
        zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        style={{
          background: theme.card, borderRadius: 28, padding: '28px 24px',
          width: '100%', maxWidth: 340, textAlign: 'center',
          boxShadow: `0 20px 60px rgba(0,0,0,0.25)`,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <p style={{ fontSize: 17, fontWeight: 700, color: theme.text, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Timer size={18} color={theme.primary} /> Sitz Bath Timer
          </p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <X size={20} color={theme.textMuted} />
          </button>
        </div>

        {done ? (
          <div>
            <p style={{ fontSize: 52, marginBottom: 8 }}>🛁</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: theme.primary, fontFamily: 'Nunito', marginBottom: 8 }}>
              Great soak!
            </p>
            <p style={{ fontSize: 14, color: theme.textMuted, marginBottom: 20 }}>
              15 minutes complete. Pat dry gently and apply your ointment.
            </p>
            <button
              onClick={onClose}
              style={{
                width: '100%', padding: '14px', background: theme.ctaGradient,
                border: 'none', borderRadius: 16, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
              }}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Breathing circle */}
            <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 16px' }}>
              <svg width={140} height={140} style={{ transform: 'rotate(-90deg)', position: 'absolute', inset: 0 }}>
                <circle cx={70} cy={70} r={52} fill="none" stroke={theme.cardBorder} strokeWidth={8} />
                <circle cx={70} cy={70} r={52} fill="none" stroke={theme.primary} strokeWidth={8}
                  strokeDasharray={circumference} strokeDashoffset={ringOffset}
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s linear' }} />
              </svg>
              {/* Breathing orb */}
              <motion.div
                animate={{ scale: running ? breatheScale : 1 }}
                transition={{ duration: elapsed < BREATHE_IN ? BREATHE_IN : elapsed < BREATHE_IN + BREATHE_HOLD ? 0.1 : BREATHE_OUT, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', inset: 0, display: 'flex',
                  flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  background: `radial-gradient(circle, ${theme.primaryLight}CC, ${theme.primary}44)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 24 }}>🛁</span>
                </div>
              </motion.div>
            </div>

            {/* Countdown */}
            <p style={{ fontSize: 44, fontWeight: 800, fontFamily: 'Nunito', color: theme.text, lineHeight: 1, marginBottom: 4 }}>
              {mins}:{secs}
            </p>

            {/* Breathing instruction */}
            <AnimatePresence mode="wait">
              <motion.p
                key={breathePhase}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                style={{ fontSize: 15, fontWeight: 600, color: theme.primary, marginBottom: 20, minHeight: 22 }}
              >
                {running ? breathePhase : 'Tap Start to begin'}
              </motion.p>
            </AnimatePresence>

            {/* Controls */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              <button
                onClick={() => setRunning(r => !r)}
                style={{
                  flex: 2, padding: '14px', background: theme.ctaGradient,
                  border: 'none', borderRadius: 16, color: '#fff',
                  fontSize: 15, fontWeight: 700, cursor: 'pointer',
                }}
              >
                {running ? 'Pause' : secsLeft < TOTAL_SECS ? 'Resume' : 'Start'}
              </button>
              <button
                onClick={() => { setSecsLeft(TOTAL_SECS); setRunning(false); setDone(false) }}
                style={{
                  flex: 1, padding: '14px', background: theme.cardBorder,
                  border: 'none', borderRadius: 16, color: theme.textMuted,
                  fontSize: 14, fontWeight: 600, cursor: 'pointer',
                }}
              >
                Reset
              </button>
            </div>

            {/* Calm sounds link */}
            <button
              onClick={openCalmSounds}
              style={{
                width: '100%', padding: '12px', background: 'transparent',
                border: `1.5px solid ${theme.cardBorder}`, borderRadius: 14,
                color: theme.textMuted, fontSize: 13, fontWeight: 500,
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 6,
              }}
            >
              <Music size={14} /> Calm Sounds (YouTube)
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}

/* ── Main V2 HomeScreen ── */
export default function HomeScreen({ onNavigate, theme }) {
  const [log, setLog] = useState(null)
  const [streak, setStreak] = useState(0)
  const [weekData, setWeekData] = useState([])
  const [tip] = useState(tips[new Date().getDay() % tips.length])
  const [mounted, setMounted] = useState(false)
  const [showSitzTimer, setShowSitzTimer] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const hour = new Date().getHours()

  const greetingEmojis = { cherry: '🌸', ocean: '🌊', aurora: '✨' }
  const greetingEmoji = greetingEmojis[theme.id] || '🌸'
  const greeting = hour < 12 ? `Good morning ${greetingEmoji}` : hour < 17 ? `Good afternoon ${greetingEmoji}` : `Good evening ${greetingEmoji}`

  useEffect(() => {
    getLog(today).then(setLog)
    setStreak(getStreak())
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const stored = localStorage.getItem('fissurecare_log_' + dateStr)
      const l = stored ? JSON.parse(stored) : null
      const pain = l?.bowelMovements?.[0]?.painLevel ?? l?.dailySymptoms?.restingPain ?? null
      days.push({ day: ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()], pain })
    }
    setWeekData(days)
    setTimeout(() => setMounted(true), 100)
  }, [today])

  const score = log ? calcWellnessScore(log) : 0
  const settings = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('fissurecare_settings') || '{}') } catch { return {} }
  }, [])
  const name = settings.userName || ''

  const lastBlood = useMemo(() => {
    let days = 0
    for (let i = 1; i <= 30; i++) {
      const d = new Date(); d.setDate(d.getDate() - i)
      const stored = localStorage.getItem('fissurecare_log_' + d.toISOString().split('T')[0])
      const l = stored ? JSON.parse(stored) : null
      if (l?.bowelMovements?.some(bm => bm.bloodPresent)) return days
      days++
    }
    return days
  }, [today])

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    })
  }

  return (
    <div style={{ padding: '0 0 16px' }}>
      {/* ── Animated Hero Header ── */}
      <div style={{
        position: 'relative', overflow: 'hidden', minHeight: 180,
        background: theme.headerGradient,
        borderRadius: '0 0 28px 28px',
      }}>
        <FallingParticles theme={theme} />
        <FlowingRiver theme={theme} />
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'relative', zIndex: 2, padding: '28px 20px 50px' }}
        >
          <p style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Nunito', color: theme.primary, marginBottom: 4, letterSpacing: '-0.3px' }}>
            {greeting}
          </p>
          {name
            ? <p style={{ fontSize: 15, color: theme.textMuted, lineHeight: 1.5 }}>
                Hi <span style={{ fontWeight: 600, color: theme.text }}>{name}</span> — how are you feeling today?
              </p>
            : <p style={{ fontSize: 15, color: theme.textMuted }}>Take it gently today</p>
          }
        </motion.div>
      </div>

      {/* ── Wellness Score Card ── */}
      <motion.div
        custom={0} variants={fadeUp} initial="hidden" animate={mounted ? 'visible' : 'hidden'}
        style={{
          margin: '20px 16px 16px', background: theme.card, borderRadius: 22,
          padding: '22px 16px', boxShadow: `0 4px 20px ${theme.cardShadow}`,
          border: `1px solid ${theme.cardBorder}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 14 }}>
          <Sparkles size={14} color={theme.primary} />
          <p style={{ fontSize: 13, fontWeight: 600, color: theme.textMuted }}>Today's Wellness</p>
        </div>
        <WellnessRing score={score} theme={theme} />
        <p style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: score >= 70 ? theme.wellnessHigh : theme.wellnessLow, fontWeight: 500 }}>
          {score >= 80 ? 'Amazing day! Your body is healing beautifully.' :
           score >= 70 ? 'Great effort! Keep this momentum going.' :
           score >= 40 ? "You're doing okay — small steps count." :
           log ? "Today was hard. That's okay — tomorrow is new." :
           'Log your day to see your wellness score'}
        </p>
      </motion.div>

      {/* ── Quick Summary Cards ── */}
      <motion.div
        custom={1} variants={fadeUp} initial="hidden" animate={mounted ? 'visible' : 'hidden'}
        style={{ display: 'flex', gap: 10, padding: '0 16px', overflowX: 'auto' }}
        className="scrollbar-hide"
      >
        {[
          { icon: '💧', label: 'Water', value: `${log?.hydration?.waterGlasses || 0}/8`, sub: 'glasses' },
          { icon: '🍌', label: 'Fruits', value: log?.fruitsEaten?.length || 0, sub: 'eaten' },
          { icon: '🛁', label: 'Sitz baths', value: log?.sitzBaths?.length || 0, sub: 'today' },
          { icon: '💛', label: 'Pain', value: log?.bowelMovements?.[0]?.painLevel ?? '–', sub: '/10' },
          { icon: '🩸', label: 'Blood-free', value: lastBlood, sub: 'days' },
        ].map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            style={{
              minWidth: 82, background: theme.card, borderRadius: 18, padding: '14px 10px',
              textAlign: 'center', border: `1px solid ${theme.cardBorder}`, flexShrink: 0,
              boxShadow: `0 2px 8px ${theme.cardShadow}`,
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 2 }}>{card.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Nunito', color: theme.text, lineHeight: 1.2 }}>{card.value}</div>
            <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 2 }}>{card.sub}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Healing Garden Flowers ── */}
      <AnimatePresence>
        {lastBlood > 0 && (
          <motion.div
            custom={2} variants={fadeUp} initial="hidden" animate={mounted ? 'visible' : 'hidden'}
          >
            <HealingGardenFlowers bloodFreeDays={lastBlood} theme={theme} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Streak ── */}
      <AnimatePresence>
        {streak > 0 && (
          <motion.div
            custom={3} variants={fadeUp} initial="hidden" animate={mounted ? 'visible' : 'hidden'}
            style={{
              margin: '16px 16px 0', background: theme.tipBg, borderRadius: 18,
              padding: '14px 16px', border: `1px solid ${theme.tipBorder}`,
              display: 'flex', alignItems: 'center', gap: 12,
            }}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
            >
              <Flame size={24} color={theme.primary} />
            </motion.div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>Day {streak} of your healing journey</p>
              <p style={{ fontSize: 12, color: theme.textMuted }}>
                {streak >= 90 ? '90 days — you are incredible' :
                 streak >= 30 ? '30 days — a full month of self-care' :
                 streak >= 14 ? '2 weeks — that takes real strength' :
                 streak >= 7 ? 'One week — you showed up for yourself' : 'Every day counts. Keep going!'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Fiber Goal Widget ── */}
      <motion.div
        custom={4} variants={fadeUp} initial="hidden" animate={mounted ? 'visible' : 'hidden'}
      >
        <FiberGoalWidget log={log} theme={theme} />
      </motion.div>

      {/* ── CTA Buttons ── */}
      <motion.div
        custom={5} variants={fadeUp} initial="hidden" animate={mounted ? 'visible' : 'hidden'}
        style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: `0 8px 30px ${theme.ctaShadow}` }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate('log')}
          style={{
            width: '100%', padding: '18px', background: theme.ctaGradient,
            border: 'none', borderRadius: 20, color: '#fff', fontSize: 17, fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 10, boxShadow: `0 6px 24px ${theme.ctaShadow}`, letterSpacing: '-0.2px',
          }}
        >
          <PlusCircle size={22} /> Log Today's Entry
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowSitzTimer(true)}
          style={{
            width: '100%', padding: '15px', background: theme.card,
            border: `2px solid ${theme.primary}40`, borderRadius: 20,
            color: theme.primary, fontSize: 15, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 10, boxShadow: `0 2px 10px ${theme.cardShadow}`,
          }}
        >
          <Timer size={20} /> Start 15-Min Sitz Bath
        </motion.button>
      </motion.div>

      {/* ── Sparkline ── */}
      {weekData.some(d => d.pain !== null) && (
        <motion.div
          custom={6} variants={fadeUp} initial="hidden" animate={mounted ? 'visible' : 'hidden'}
          style={{
            margin: '16px 16px 0', background: theme.card, borderRadius: 20, padding: '16px',
            border: `1px solid ${theme.cardBorder}`, boxShadow: `0 2px 10px ${theme.cardShadow}`,
          }}
        >
          <p style={{ fontSize: 13, fontWeight: 600, color: theme.textMuted, marginBottom: 10 }}>Pain this week</p>
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={weekData}>
              <Line type="monotone" dataKey="pain" stroke={theme.primary} strokeWidth={2.5}
                dot={{ fill: theme.primary, r: 3, strokeWidth: 0 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            {weekData.map((d, i) => (
              <span key={i} style={{ fontSize: 10, color: theme.textMuted, flex: 1, textAlign: 'center' }}>{d.day}</span>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Tip of the day ── */}
      <motion.div
        custom={7} variants={fadeUp} initial="hidden" animate={mounted ? 'visible' : 'hidden'}
        style={{
          margin: '16px 16px 0', background: theme.tipBg, borderRadius: 18,
          padding: '16px', border: `1px solid ${theme.tipBorder}`,
        }}
      >
        <p style={{ fontSize: 12, fontWeight: 600, color: theme.primary, marginBottom: 6 }}>Tip of the day</p>
        <p style={{ fontSize: 13, color: theme.text, lineHeight: 1.6 }}>{tip}</p>
      </motion.div>

      {/* ── Sitz Timer Modal ── */}
      <AnimatePresence>
        {showSitzTimer && (
          <SitzTimerModal onClose={() => setShowSitzTimer(false)} theme={theme} />
        )}
      </AnimatePresence>
    </div>
  )
}
