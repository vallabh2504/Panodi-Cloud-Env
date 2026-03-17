import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { PlusCircle, Flame, Sparkles } from 'lucide-react'
import { getLog, getStreak, calcWellnessScore } from '../lib/storage'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'

const tips = [
  "Warm sitz baths 3x a day can help relax the area and speed up healing!",
  "Papaya contains papain, an enzyme that gently aids digestion. Try some today!",
  "8 glasses of water a day keeps hard stools away — your healing best friend",
  "Gentle walking for 20 minutes helps improve blood flow to the healing area",
  "Pear and kiwi have natural sorbitol that softens stools — great snack choices!",
  "Stress can worsen discomfort. Even 5 minutes of deep breathing helps",
  "A fiber-rich dal or oats breakfast sets you up for an easier day",
]

/* ── Falling Particles (cherry blossoms / bubbles / stars) ── */
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

    // Create particles
    const COUNT = 18
    particlesRef.current = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H - H,
      size: 10 + Math.random() * 16,
      speed: 0.3 + Math.random() * 0.6,
      drift: (Math.random() - 0.5) * 0.4,
      wobbleAmp: 15 + Math.random() * 25,
      wobbleSpeed: 0.008 + Math.random() * 0.012,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      opacity: 0.35 + Math.random() * 0.45,
      char: theme.particleChar[Math.floor(Math.random() * theme.particleChar.length)],
      color: theme.particleColors[Math.floor(Math.random() * theme.particleColors.length)],
      phase: Math.random() * Math.PI * 2,
    }))

    let t = 0
    function draw() {
      ctx.clearRect(0, 0, W, H)
      t++
      for (const p of particlesRef.current) {
        p.y += p.speed
        p.x += p.drift + Math.sin(t * p.wobbleSpeed + p.phase) * 0.5
        p.rotation += p.rotSpeed

        if (p.y > H + 30) {
          p.y = -30
          p.x = Math.random() * W
        }
        if (p.x > W + 30) p.x = -30
        if (p.x < -30) p.x = W + 30

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.globalAlpha = p.opacity
        ctx.font = `${p.size}px serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(p.char, 0, 0)
        ctx.restore()
      }
      animRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 1,
      }}
    />
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

/* ── Wellness Ring (theme-aware) ── */
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
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center'
      }}>
        <span style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Nunito', color: theme.text }}>{score}</span>
        <span style={{ fontSize: 11, color: theme.textMuted }}>of 100</span>
      </div>
    </div>
  )
}

/* ── Main V2 HomeScreen ── */
export default function HomeScreen({ onNavigate, theme }) {
  const [log, setLog] = useState(null)
  const [streak, setStreak] = useState(0)
  const [weekData, setWeekData] = useState([])
  const [tip] = useState(tips[new Date().getDay() % tips.length])
  const [mounted, setMounted] = useState(false)

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
      days.push({ day: ['S','M','T','W','T','F','S'][d.getDay()], pain })
    }
    setWeekData(days)
    setTimeout(() => setMounted(true), 100)
  }, [today])

  const score = log ? calcWellnessScore(log) : 0
  const settings = JSON.parse(localStorage.getItem('fissurecare_settings') || '{}')
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
      {/* ── Animated Hero Header with particles + river ── */}
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
          <p style={{
            fontSize: 26, fontWeight: 800, fontFamily: 'Nunito',
            color: theme.primary, marginBottom: 4, letterSpacing: '-0.3px'
          }}>
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
        custom={0} variants={fadeUp} initial="hidden" animate={mounted ? "visible" : "hidden"}
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
           'Log your day to see your score'}
        </p>
      </motion.div>

      {/* ── Quick Summary Cards ── */}
      <motion.div
        custom={1} variants={fadeUp} initial="hidden" animate={mounted ? "visible" : "hidden"}
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

      {/* ── Streak ── */}
      <AnimatePresence>
        {streak > 0 && (
          <motion.div
            custom={2} variants={fadeUp} initial="hidden" animate={mounted ? "visible" : "hidden"}
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
                {streak >= 90 ? '90 days! You are incredible' :
                 streak >= 30 ? '30 days! A month of self-care' :
                 streak >= 14 ? '2 weeks! That takes strength' :
                 streak >= 7 ? 'One week! You showed up for yourself' : 'Every day counts. Keep going!'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CTA Button ── */}
      <motion.div
        custom={3} variants={fadeUp} initial="hidden" animate={mounted ? "visible" : "hidden"}
        style={{ padding: '0 16px', margin: '18px 0' }}
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
      </motion.div>

      {/* ── Sparkline ── */}
      {weekData.some(d => d.pain !== null) && (
        <motion.div
          custom={4} variants={fadeUp} initial="hidden" animate={mounted ? "visible" : "hidden"}
          style={{
            margin: '0 16px', background: theme.card, borderRadius: 20, padding: '16px',
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
        custom={5} variants={fadeUp} initial="hidden" animate={mounted ? "visible" : "hidden"}
        style={{
          margin: '16px 16px 0', background: theme.tipBg, borderRadius: 18,
          padding: '16px', border: `1px solid ${theme.tipBorder}`,
        }}
      >
        <p style={{ fontSize: 12, fontWeight: 600, color: theme.primary, marginBottom: 6 }}>Tip of the day</p>
        <p style={{ fontSize: 13, color: theme.text, lineHeight: 1.6 }}>{tip}</p>
      </motion.div>
    </div>
  )
}
