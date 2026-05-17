import { useState, useEffect, useRef, useCallback, useMemo, lazy, Suspense } from 'react'
const HealingGarden3D = lazy(() => import('../components/HealingGarden3D'))
const NoiseShaderHero = lazy(() => import('../components/NoiseShaderHero'))
const FlipNumber = lazy(() => import('../components/FlipNumber'))
import { PlusCircle, Sparkles, Timer, X, Music, Lightbulb, Bell, ChevronDown } from 'lucide-react'
import { getLog, getAllLogs, getStreak, calcWellnessScore, getSettings, getHealingDayFreezes, useHealingDayFreeze, getWatchData, saveWatchData } from '../lib/storage'
import { getDailyInsight } from '../lib/correlations'
import { FlameIcon, SunIcon, MoonIcon, WaveBar } from '../components/AnimatedSVGs'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { motion, AnimatePresence, useInView } from 'framer-motion'

/* ── RevealCard: IntersectionObserver-based entrance ── */
function RevealCard({ children, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

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
  const [showScoreInfo, setShowScoreInfo] = useState(false)
  const radius = 52, stroke = 8
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 70 ? theme.wellnessHigh : score >= 40 ? theme.wellnessLow : '#F48585'
  return (
    <div>
      <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto' }}>
        {/* Inner glow */}
        <div style={{
          position: 'absolute', inset: 16, borderRadius: '50%',
          background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
          animation: score >= 70 ? 'ringGlow 2.5s ease-in-out infinite' : 'none',
        }} />
        <svg width={140} height={140} style={{ transform: 'rotate(-90deg)' }}
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Wellness score: ${score} out of 100`}
        >
          <circle cx={70} cy={70} r={radius} fill="none" stroke={theme.cardBorder} strokeWidth={stroke} />
          {/* Comet ghost trail */}
          <circle
            cx={70} cy={70} r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke * 0.6}
            strokeDasharray={circumference}
            strokeDashoffset={offset + circumference * 0.04}
            strokeLinecap="round"
            opacity={0.35}
            style={{ transition: 'stroke-dashoffset 1s ease', filter: `blur(2px)` }}
            className="ring-glow-trail"
          />
          <circle cx={70} cy={70} r={radius} fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Suspense fallback={<span style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Nunito', color: theme.text }}>{score}</span>}>
            <FlipNumber value={score} color={theme.text} fontSize={32} suffix="" />
          </Suspense>
          <span style={{ fontSize: 11, color: theme.textMuted }}>of 100</span>
        </div>
      </div>
      <button
        onClick={() => setShowScoreInfo(s => !s)}
        style={{
          display: 'block', margin: '8px auto 0', background: 'none', border: 'none',
          fontSize: 12, color: theme.textMuted, cursor: 'pointer', textDecoration: 'underline dotted',
        }}
      >
        ℹ️ How is this calculated?
      </button>
      <AnimatePresence>
        {showScoreInfo && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            style={{
              marginTop: 10, background: theme.tipBg, border: `1px solid ${theme.tipBorder}`,
              borderRadius: 14, padding: '12px 14px', position: 'relative',
            }}
          >
            <button
              onClick={() => setShowScoreInfo(false)}
              style={{
                position: 'absolute', top: 8, right: 10, background: 'none', border: 'none',
                fontSize: 14, color: theme.textMuted, cursor: 'pointer', lineHeight: 1,
              }}
            >
              ✕
            </button>
            <p style={{ fontSize: 12, fontWeight: 700, color: theme.text, marginBottom: 8 }}>Score Breakdown</p>
            {[
              ['💧 Water', '20 pts'],
              ['🍌 Fruits', '15 pts'],
              ['🌾 Fiber', '15 pts'],
              ['🛁 Sitz Baths', '15 pts'],
              ['😌 Low Pain', '25 pts'],
              ['💩 Good Bristol', '10 pts'],
              ['🚶 Steps (boAt bonus)', '+ up to 10 pts'],
              ['😴 Sleep 7h+ (bonus)', '+ up to 5 pts'],
            ].map(([label, pts]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: theme.text }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: theme.primary }}>{pts}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Healing Garden Flowers ── */
function HealingGardenFlowers({ bloodFreeDays, theme }) {
  const [freezeToast, setFreezeToast] = useState(null)
  const freezeData = getHealingDayFreezes()
  const freezesLeft = 2 - freezeData.used
  const showFreezeBtn = bloodFreeDays > 0 && freezesLeft > 0

  const handleFreeze = () => {
    const ok = useHealingDayFreeze()
    if (ok) {
      setFreezeToast('Streak protected! 🧊')
      setTimeout(() => setFreezeToast(null), 2500)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        margin: '16px 16px 0', background: theme.tipBg,
        borderRadius: 22, padding: '14px 16px',
        border: `1px solid ${theme.tipBorder}`,
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>
          🌿 Your Healing Garden
        </p>
        {showFreezeBtn && (
          <button
            onClick={handleFreeze}
            style={{
              fontSize: 11, padding: '4px 10px', borderRadius: 10,
              background: 'transparent', border: `1px solid ${theme.cardBorder}`,
              color: theme.textMuted, cursor: 'pointer', fontWeight: 600,
            }}
          >
            🧊 Freeze streak
          </button>
        )}
      </div>
      {freezeToast && (
        <p style={{ fontSize: 12, color: '#5BAFD6', fontWeight: 600, marginBottom: 6 }}>{freezeToast}</p>
      )}
      <p style={{ fontSize: 12, color: theme.textMuted, marginBottom: 8 }}>
        {bloodFreeDays === 0
          ? 'Log a blood-free day to grow your first flower 🌸'
          : `${bloodFreeDays} blood-free ${bloodFreeDays === 1 ? 'day' : 'days'} — each flower is a victory`}
      </p>
      <Suspense fallback={<div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>🌱</div>}>
        <HealingGarden3D bloodFreeDays={bloodFreeDays} theme={theme} />
      </Suspense>
    </motion.div>
  )
}

/* ── Fitness Teaser Card (compact, navigates to Fitness tab) ── */
function FitnessTeaserCard({ today, theme, onNavigate }) {
  const [watchData, setWatchData] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem('fissurecare_watch_' + today)
    if (raw) { try { setWatchData(JSON.parse(raw)) } catch {} }
  }, [today])

  const steps    = watchData?.steps || 0
  const hr       = watchData?.heartRate
  const sleep    = watchData?.sleepHours
  const calories = watchData?.calories || 0
  const hasData  = steps > 0 || hr || sleep

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        margin: '0 16px 16px', background: theme.card, borderRadius: 22,
        border: `1px solid ${theme.cardBorder}`,
        boxShadow: `0 2px 14px ${theme.cardShadow}`, overflow: 'hidden',
      }}
    >
      <div style={{ padding: '14px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ fontSize: 20 }}>⌚</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: theme.text, lineHeight: 1.2 }}>boAt Fitness</p>
            <p style={{ fontSize: 10, color: theme.textMuted }}>Wave Magma</p>
          </div>
        </div>
        {hasData && watchData?.syncedAt && (
          <span style={{ fontSize: 10, color: theme.textMuted }}>
            Synced {new Date(watchData.syncedAt).toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' })}
          </span>
        )}
      </div>

      {hasData ? (
        <div style={{ display: 'flex', gap: 8, padding: '0 16px 12px', overflowX: 'auto' }}>
          {[
            { icon: '🚶', label: 'Steps',    value: steps.toLocaleString(),    color: theme.primary },
            { icon: '❤️', label: 'HR',       value: hr    ? `${hr} bpm`  : '—', color: '#F48585' },
            { icon: '😴', label: 'Sleep',    value: sleep ? `${sleep}h`  : '—', color: '#C9A8F5' },
            { icon: '🔥', label: 'Calories', value: calories || '—',           color: '#F5C67A' },
          ].map(stat => (
            <div key={stat.label} style={{
              flex: '0 0 auto', minWidth: 66, background: theme.tipBg,
              borderRadius: 14, padding: '8px 8px', textAlign: 'center',
              border: `1px solid ${theme.tipBorder}`,
            }}>
              <div style={{ fontSize: 15, marginBottom: 2 }}>{stat.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 800, fontFamily: 'Nunito', color: stat.color, lineHeight: 1.1 }}>{stat.value}</div>
              <div style={{ fontSize: 9, color: theme.textMuted, marginTop: 1 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: 12, color: theme.textMuted, padding: '0 16px 12px', lineHeight: 1.5 }}>
          No data synced today — open Fitness tab to connect your watch.
        </p>
      )}

      <div style={{ padding: '0 16px 14px' }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate('fitness')}
          style={{
            width: '100%', padding: '11px',
            background: `linear-gradient(135deg, ${theme.primary}18, ${theme.primary}08)`,
            border: `1.5px solid ${theme.primary}50`,
            borderRadius: 14, cursor: 'pointer',
            color: theme.primary, fontSize: 13, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          }}
        >
          {hasData ? '📊 Full Fitness Dashboard →' : '⌚ Open Fitness Tracker →'}
        </motion.button>
      </div>
    </motion.div>
  )
}

/* ── BLE connect helper (Web Bluetooth) ── */
async function connectBoatBLE({ onConnected, onHeartRate, onDisconnect }) {
  if (!navigator?.bluetooth) throw Object.assign(new Error('NO_BLE'), { code: 'NO_BLE' })
  const device = await navigator.bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: [
      'battery_service',
      'heart_rate',
      '0000fee0-0000-1000-8000-00805f9b34fb', // Dafit / boAt Connect main service
    ],
  })
  if (onDisconnect) device.addEventListener('gattserverdisconnected', onDisconnect)
  const server = await device.gatt.connect()
  const info = { name: device.name || 'boAt Watch', battery: null }
  // Battery level (standard GATT — most BLE watches support this)
  try {
    const svc = await server.getPrimaryService('battery_service')
    const ch = await svc.getCharacteristic('battery_level')
    info.battery = (await ch.readValue()).getUint8(0)
  } catch {}
  // Heart rate live stream (standard GATT 0x180D)
  try {
    const hrSvc = await server.getPrimaryService('heart_rate')
    const hrCh = await hrSvc.getCharacteristic('heart_rate_measurement')
    await hrCh.startNotifications()
    hrCh.addEventListener('characteristicvaluechanged', e => {
      const flags = e.target.value.getUint8(0)
      const hr = (flags & 0x1) ? e.target.value.getUint16(1, true) : e.target.value.getUint8(1)
      if (onHeartRate) onHeartRate(hr)
    })
  } catch {}
  onConnected(info)
  return device
}

/* ── Concentric Activity Rings ── */
function ActivityRings({ steps, activeMinutes, calories, theme }) {
  const rings = [
    { r: 52, goal: 8000, value: steps, color: theme.primary },
    { r: 40, goal: 30, value: activeMinutes, color: theme.wellnessHigh || '#A8D5A2' },
    { r: 28, goal: 300, value: calories, color: '#C9A8F5' },
  ]
  const cx = 64, cy = 64, sw = 7, tf = `rotate(-90 ${cx} ${cy})`
  return (
    <svg width={128} height={128} aria-label="Activity rings: steps, active minutes, calories">
      {rings.map(({ r, color }) => (
        <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke={theme.cardBorder} strokeWidth={sw} />
      ))}
      {rings.map(({ r, goal, value, color }) => {
        const c = 2 * Math.PI * r
        const off = c - Math.min(value / goal, 1) * c
        return (
          <circle key={r + 'p'} cx={cx} cy={cy} r={r} fill="none"
            stroke={color} strokeWidth={sw} strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={off} transform={tf}
            style={{ transition: 'stroke-dashoffset 1.1s ease' }} />
        )
      })}
    </svg>
  )
}

/* ── boAt Fitness Card ── */
function BoatWatchCard({ log, today, theme, onUpdate }) {
  const [watchData, setWatchData] = useState(null)
  const [bleState, setBleState] = useState('idle') // idle | connecting | connected | error
  const [bleInfo, setBleInfo] = useState(null)
  const [liveHR, setLiveHR] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ steps: '', activeMinutes: '', heartRate: '', spO2: '', sleepHours: '', calories: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const bleDeviceRef = useRef(null)
  const bleSupported = typeof navigator !== 'undefined' && !!navigator.bluetooth

  useEffect(() => {
    const stored = getWatchData(today)
    if (stored) setWatchData(stored)
    else if (log?.activity?.steps || log?.activity?.heartRate) {
      setWatchData({
        steps: log.activity.steps || 0,
        activeMinutes: log.activity.walkingMinutes || 0,
        heartRate: log.activity.heartRate || null,
        spO2: log.activity.spO2 || null,
        sleepHours: log.activity.sleepHours || null,
        calories: log.activity.calories || 0,
      })
    }
  }, [today, log])

  const handleConnect = async () => {
    if (!bleSupported) { setShowModal(true); return }
    setBleState('connecting')
    try {
      const device = await connectBoatBLE({
        onConnected: info => { setBleInfo(info); setBleState('connected') },
        onHeartRate: hr => setLiveHR(hr),
        onDisconnect: () => { setBleState('disconnected'); setLiveHR(null) },
      })
      bleDeviceRef.current = device
    } catch (e) {
      if (e.name === 'NotFoundError') setBleState('idle')
      else { setBleState('error'); setTimeout(() => setBleState('idle'), 3000) }
    }
  }

  const openManual = () => {
    const d = watchData
    setForm({
      steps: d?.steps ? String(d.steps) : '',
      activeMinutes: d?.activeMinutes ? String(d.activeMinutes) : '',
      heartRate: d?.heartRate ? String(d.heartRate) : '',
      spO2: d?.spO2 ? String(d.spO2) : '',
      sleepHours: d?.sleepHours ? String(d.sleepHours) : '',
      calories: d?.calories ? String(d.calories) : '',
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    const data = {
      steps: parseInt(form.steps) || 0,
      activeMinutes: parseInt(form.activeMinutes) || 0,
      heartRate: parseInt(form.heartRate) || null,
      spO2: parseFloat(form.spO2) || null,
      sleepHours: parseFloat(form.sleepHours) || null,
      calories: parseInt(form.calories) || 0,
      syncedAt: new Date().toISOString(),
    }
    setSaving(true)
    await saveWatchData(today, data)
    setWatchData(data)
    setSaved(true)
    setSaving(false)
    onUpdate()
    setTimeout(() => { setSaved(false); setShowModal(false) }, 900)
  }

  const steps = watchData?.steps || 0
  const activeMins = watchData?.activeMinutes || 0
  const calories = watchData?.calories || 0
  const hr = liveHR || watchData?.heartRate
  const spO2 = watchData?.spO2
  const sleep = watchData?.sleepHours

  const LEGEND = [
    { color: theme.primary, label: 'Steps', value: `${steps.toLocaleString()} / 8,000` },
    { color: theme.wellnessHigh || '#A8D5A2', label: 'Active', value: `${activeMins} / 30 min` },
    { color: '#C9A8F5', label: 'Calories', value: `${calories} / 300 cal` },
  ]

  const FIELDS = [
    { key: 'steps', label: '🚶 Steps', placeholder: 'e.g. 6000', type: 'numeric', quick: [1000, 2000] },
    { key: 'activeMinutes', label: '⏱️ Active Minutes', placeholder: 'e.g. 30', type: 'numeric' },
    { key: 'heartRate', label: '❤️ Avg Heart Rate (bpm)', placeholder: 'e.g. 72', type: 'numeric' },
    { key: 'spO2', label: '🩸 SpO2 (%)', placeholder: 'e.g. 98', note: 'Normal: 95–100%', type: 'decimal' },
    { key: 'sleepHours', label: '😴 Sleep Last Night (hrs)', placeholder: 'e.g. 7.5', note: '+5 pts if ≥7h', type: 'decimal' },
    { key: 'calories', label: '🔥 Calories Burned', placeholder: 'e.g. 280', type: 'numeric' },
  ]

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          margin: '0 16px 16px', background: theme.card, borderRadius: 22,
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: `0 2px 14px ${theme.cardShadow}`, overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ fontSize: 20 }}>⌚</span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: theme.text, lineHeight: 1.2 }}>boAt Fitness</p>
              <p style={{ fontSize: 10, color: theme.textMuted }}>Wave Magma</p>
            </div>
          </div>
          {bleState === 'connected'
            ? <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#F0FFF5', borderRadius: 20, padding: '4px 10px', border: '1px solid #C8E6C9' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4CAF50' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#2E7D32' }}>{bleInfo?.name || 'Connected'}</span>
                {bleInfo?.battery != null && <span style={{ fontSize: 11, color: '#4CAF50' }}>🔋{bleInfo.battery}%</span>}
              </div>
            : bleState === 'connecting'
            ? <span style={{ fontSize: 11, color: theme.textMuted }}>Searching…</span>
            : bleState === 'error'
            ? <span style={{ fontSize: 11, color: '#F48585' }}>Connect failed</span>
            : watchData?.syncedAt
            ? <span style={{ fontSize: 10, color: theme.textMuted }}>
                Synced {new Date(watchData.syncedAt).toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' })}
              </span>
            : <span style={{ fontSize: 10, color: theme.textMuted }}>Not synced</span>
          }
        </div>

        {/* Activity rings + legend */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px 10px', gap: 14 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <ActivityRings steps={steps} activeMinutes={activeMins} calories={calories} theme={theme} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              {liveHR
                ? <>
                    <span style={{ fontSize: 8, color: '#F48585', fontWeight: 700 }}>LIVE</span>
                    <span style={{ fontSize: 16, fontWeight: 800, fontFamily: 'Nunito', color: '#F48585', lineHeight: 1 }}>{liveHR}</span>
                    <span style={{ fontSize: 8, color: theme.textMuted }}>bpm</span>
                  </>
                : <span style={{ fontSize: 22 }}>{steps >= 8000 ? '🏆' : steps >= 4000 ? '🚶' : '🏃'}</span>
              }
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {LEGEND.map(({ color, label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: theme.textMuted, width: 46, flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: theme.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Health stats pills */}
        <div style={{ display: 'flex', gap: 8, padding: '0 16px 14px', overflowX: 'auto' }}>
          {[
            { icon: '❤️', label: 'Heart Rate', value: hr ? `${hr} bpm` : '—', color: '#F48585' },
            { icon: '🩸', label: 'SpO2', value: spO2 ? `${spO2}%` : '—', color: '#74B8E8' },
            { icon: '😴', label: 'Sleep', value: sleep ? `${sleep}h` : '—', color: '#C9A8F5' },
            { icon: '🔥', label: 'Calories', value: calories || '—', color: '#F5C67A' },
          ].map(stat => (
            <div key={stat.label} style={{
              flex: '0 0 auto', minWidth: 70, background: theme.tipBg,
              borderRadius: 14, padding: '8px 10px', textAlign: 'center',
              border: `1px solid ${theme.tipBorder}`,
            }}>
              <div style={{ fontSize: 16, marginBottom: 2 }}>{stat.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 800, fontFamily: 'Nunito', color: stat.color, lineHeight: 1.1 }}>{stat.value}</div>
              <div style={{ fontSize: 9, color: theme.textMuted, marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, padding: '0 16px 14px' }}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleConnect}
            disabled={bleState === 'connecting'}
            style={{
              flex: 1, padding: '11px 0',
              background: bleState === 'connected' ? '#F0FFF5' : `linear-gradient(135deg, ${theme.primary}18, ${theme.primary}08)`,
              border: `1.5px solid ${bleState === 'connected' ? '#C8E6C9' : theme.primary + '50'}`,
              borderRadius: 14, cursor: bleState === 'connecting' ? 'default' : 'pointer',
              color: bleState === 'connected' ? '#2E7D32' : theme.primary,
              fontSize: 12, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            {bleState === 'connecting' ? '⏳ Connecting…'
              : bleState === 'connected' ? '● Connected'
              : '⌚ Connect Watch (BLE)'}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={openManual}
            style={{
              flex: 1, padding: '11px 0',
              background: theme.tipBg, border: `1.5px solid ${theme.cardBorder}`,
              borderRadius: 14, cursor: 'pointer',
              color: theme.textMuted, fontSize: 12, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >✏️ Enter Data</motion.button>
        </div>

        {!bleSupported && (
          <p style={{ fontSize: 10, color: theme.textMuted, textAlign: 'center', padding: '0 16px 12px', lineHeight: 1.5 }}>
            ⚠️ BLE requires Chrome on Android/desktop. On iPhone: open <b>boAt Connect</b> app → check stats → <b>Enter Data</b>.
          </p>
        )}
      </motion.div>

      {/* Manual entry bottom sheet */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
            onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              style={{
                background: theme.card, borderRadius: '28px 28px 0 0',
                width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto',
                boxShadow: '0 -8px 40px rgba(0,0,0,0.22)',
              }}
            >
              <div style={{ padding: '18px 20px 40px' }}>
                <div style={{ width: 36, height: 4, background: theme.cardBorder, borderRadius: 2, margin: '0 auto 18px' }} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <p style={{ fontSize: 17, fontWeight: 700, color: theme.text }}>⌚ boAt Watch Data</p>
                  <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: 22, color: theme.textMuted, cursor: 'pointer', lineHeight: 1 }}>×</button>
                </div>

                {/* How-to tip */}
                <div style={{ background: theme.tipBg, borderRadius: 14, padding: '11px 14px', marginBottom: 18, border: `1px solid ${theme.tipBorder}` }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: theme.primary, marginBottom: 5 }}>How to read from boAt Wave Magma</p>
                  <p style={{ fontSize: 12, color: theme.text, lineHeight: 1.7 }}>
                    📱 Open <b>boAt Connect</b> app on your phone<br />
                    → tap <b>Health</b> tab for SpO2 &amp; sleep<br />
                    → tap <b>Activity</b> for steps, calories, active time<br />
                    → tap the ❤️ icon for heart rate
                  </p>
                </div>

                {FIELDS.map(({ key, label, placeholder, note, type, quick }) => (
                  <div key={key} style={{ marginBottom: 14 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                      {label}
                      {note && <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, marginLeft: 6, color: theme.primary }}>· {note}</span>}
                    </p>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input
                        type="number"
                        inputMode={type === 'decimal' ? 'decimal' : 'numeric'}
                        value={form[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder}
                        style={{
                          flex: 1, padding: '11px 14px', borderRadius: 12,
                          border: `1.5px solid ${theme.cardBorder}`, background: theme.tipBg,
                          fontSize: 17, fontWeight: 700, fontFamily: key === 'steps' ? 'Nunito' : 'inherit',
                          color: theme.text, outline: 'none',
                        }}
                      />
                      {quick?.map(amt => (
                        <button key={amt}
                          onClick={() => setForm(f => ({ ...f, [key]: String((parseInt(f[key]) || 0) + amt) }))}
                          style={{
                            padding: '0 12px', background: theme.tipBg,
                            border: `1px solid ${theme.cardBorder}`, borderRadius: 12,
                            fontSize: 12, fontWeight: 700, color: theme.primary, cursor: 'pointer', whiteSpace: 'nowrap',
                          }}
                        >+{amt >= 1000 ? `${amt / 1000}k` : amt}</button>
                      ))}
                    </div>
                  </div>
                ))}

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    width: '100%', marginTop: 8, padding: '15px',
                    background: saved ? (theme.wellnessHigh || '#A8D5A2') : (theme.ctaGradient || theme.primary),
                    border: 'none', borderRadius: 16, color: '#fff',
                    fontSize: 15, fontWeight: 700, cursor: saving ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'background 0.3s ease',
                  }}
                >
                  {saved ? '✓ Saved — Score Updated!' : saving ? 'Saving…' : '⌚ Save boAt Data'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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

/* ── Reminder Banner (unlogged by 8pm) ── */
function ReminderBanner({ name, onLog, theme }) {
  const [dismissed, setDismissed] = useState(() => {
    const d = localStorage.getItem('fissurecare_reminder_dismissed')
    return d === new Date().toISOString().split('T')[0]
  })

  if (dismissed) return null

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -60, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      style={{
        margin: '16px 16px 0', borderRadius: 18, padding: '14px 16px',
        background: `linear-gradient(135deg, ${theme.primary}18, ${theme.primary}08)`,
        border: `1.5px solid ${theme.primary}40`,
        display: 'flex', alignItems: 'flex-start', gap: 12,
      }}
    >
      <Bell size={20} color={theme.primary} style={{ flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 4 }}>
          Hey {name}, we haven't heard from you today 💛
        </p>
        <p style={{ fontSize: 12, color: theme.textMuted, marginBottom: 10 }}>How are you feeling? A quick log helps track your healing.</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <motion.button whileTap={{ scale: 0.95 }} onClick={onLog} style={{
            padding: '8px 16px', background: theme.ctaGradient, border: 'none',
            borderRadius: 12, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}>
            Log Now
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => {
            setDismissed(true)
            localStorage.setItem('fissurecare_reminder_dismissed', new Date().toISOString().split('T')[0])
          }} style={{
            padding: '8px 14px', background: 'transparent', border: `1px solid ${theme.cardBorder}`,
            borderRadius: 12, color: theme.textMuted, fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}>
            Later
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Insight Card ── */
function InsightCard({ insight, theme }) {
  if (!insight) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      style={{
        margin: '16px 16px 0', borderRadius: 18, padding: '14px 16px',
        background: theme.tipBg, border: `1px solid ${theme.tipBorder}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <Lightbulb size={16} color={theme.primary} />
        <p style={{ fontSize: 12, fontWeight: 700, color: theme.primary, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
          Pattern detected
        </p>
      </div>
      <p style={{ fontSize: 13, color: theme.text, lineHeight: 1.65 }}>{insight}</p>
    </motion.div>
  )
}

/* ── Main V2 HomeScreen ── */
export default function HomeScreen({ onNavigate, theme }) {
  const [log, setLog] = useState(null)
  const [streak, setStreak] = useState(0)
  const [weekData, setWeekData] = useState([])
  const [insight, setInsight] = useState(null)
  const [tip] = useState(tips[new Date().getDay() % tips.length])
  const [mounted, setMounted] = useState(false)
  const [showSitzTimer, setShowSitzTimer] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [collapsed, setCollapsed] = useState({ progress: false, insights: false })
  const [displayedGreeting, setDisplayedGreeting] = useState('')
  const greetingRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const toggleSection = (key) => setCollapsed(s => ({ ...s, [key]: !s[key] }))

  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const lowEndDevice = typeof navigator !== 'undefined' && (navigator.deviceMemory !== undefined) && navigator.deviceMemory < 4
  const useAnimations = !reducedMotion && !lowEndDevice

  const today = new Date().toISOString().split('T')[0]
  const hour = new Date().getHours()

  const greetingEmojis = { cherry: '🌸', ocean: '🌊', aurora: '✨' }
  const greetingEmoji = greetingEmojis[theme.id] || '🌸'
  const greeting = hour < 12 ? `Good morning ${greetingEmoji}` : hour < 17 ? `Good afternoon ${greetingEmoji}` : `Good evening ${greetingEmoji}`

  const settings = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('fissurecare_settings') || '{}') } catch { return {} }
  }, [])
  const name = settings.userName || 'Bujji'

  const fullGreeting = `${greeting}, ${name}!`

  useEffect(() => {
    setDisplayedGreeting('')
    let idx = 0
    const interval = setInterval(() => {
      idx++
      setDisplayedGreeting(fullGreeting.slice(0, idx))
      if (idx >= fullGreeting.length) clearInterval(interval)
    }, 40)
    return () => clearInterval(interval)
  }, [fullGreeting])

  useEffect(() => {
    getLog(today).then(setLog)
    setStreak(getStreak())
    getAllLogs().then(logs => {
      setInsight(getDailyInsight(logs))
    })
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

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 160)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const score = log ? calcWellnessScore(log) : 0
  const wellnessScore = score

  const timeClass = (() => {
    const h = new Date().getHours()
    if (h >= 5 && h < 12) return 'time-morning'
    if (h >= 12 && h < 17) return 'time-midday'
    if (h >= 17 && h < 21) return 'time-evening'
    return 'time-night'
  })()

  const wellnessClass = wellnessScore >= 70 ? 'wellness-high' : wellnessScore >= 40 ? 'wellness-mid' : 'wellness-low'

  const [bloodFreeDays, setBloodFreeDays] = useState(0)

  useEffect(() => {
    getAllLogs().then(logs => {
      let count = 0
      const todayDate = new Date()
      for (let i = 1; i <= 90; i++) {
        const d = new Date(todayDate)
        d.setDate(d.getDate() - i)
        const key = d.toISOString().split('T')[0]
        const entry = logs[key]
        if (!entry) break
        if (entry.symptoms?.bleeding) break
        count++
      }
      setBloodFreeDays(count)
    })
  }, [today, log])

  const lastBlood = bloodFreeDays

  const showReminder = hour >= 20 && !log

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    })
  }

  const handleTouchMove = (e) => {
    const touch = e.touches[0]
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((touch.clientY - rect.top) / rect.height - 0.5) * 12
    const y = ((touch.clientX - rect.left) / rect.width - 0.5) * -12
    setTilt({ x, y })
  }
  const handleTouchEnd = () => setTilt({ x: 0, y: 0 })

  return (
    <div className={`${timeClass} ${wellnessClass} ambient-overlay`} style={{ padding: '0 0 16px' }}>
      {/* ── Animated Hero Header ── */}
      <div className="parallax-container" style={{
        position: 'relative', overflow: 'hidden', minHeight: 180,
        borderRadius: '0 0 28px 28px',
        background: theme.headerGradient,
      }}>
        {useAnimations && <div className="parallax-back" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}><FallingParticles theme={theme} /></div>}
        {useAnimations && <div className="parallax-mid" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}><FlowingRiver theme={theme} /></div>}
        <motion.div
          className="parallax-front"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'relative', zIndex: 2, padding: '28px 20px 50px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <p ref={greetingRef} style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Nunito', color: theme.primary, margin: 0, letterSpacing: '-0.3px' }}>
              {displayedGreeting}
            </p>
            {hour < 17 ? <SunIcon size={22} color={theme.primary} /> : <MoonIcon size={22} color={theme.accent || '#C9A8F5'} />}
          </div>
          <p style={{ fontSize: 15, color: theme.textMuted, lineHeight: 1.5 }}>
            {log
              ? <span>You logged today — <span style={{ fontWeight: 600, color: theme.text }}>you're doing great 💛</span></span>
              : 'How are you feeling today? Take it gently.'
            }
          </p>
        </motion.div>
      </div>

      {/* ── Evening reminder banner ── */}
      <AnimatePresence>
        {showReminder && (
          <ReminderBanner name={name} onLog={() => onNavigate('log')} theme={theme} />
        )}
      </AnimatePresence>

      {/* ── Correlation insight ── */}
      {insight && <InsightCard insight={insight} theme={theme} />}

      {/* ── Wellness Score Card ── */}
      <RevealCard delay={0}>
        <div
          className="glass-card tilt-card"
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            position: 'relative', overflow: 'hidden',
            margin: '20px 16px 16px', borderRadius: 22,
            padding: '22px 16px', boxShadow: `0 4px 20px ${theme.cardShadow}`,
            border: `1px solid ${theme.cardBorder}`,
            transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: tilt.x === 0 ? 'transform 0.5s ease' : 'transform 0.1s ease',
          }}
        >
          {/* Specular highlight overlay */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 22,
            background: `radial-gradient(circle at ${50 + tilt.y * 3}% ${50 + tilt.x * 3}%, rgba(255,255,255,0.25), transparent 60%)`,
          }} />
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
        </div>
      </RevealCard>

      {/* ── Quick Summary Cards (Bento Grid) ── */}
      <RevealCard delay={0.1}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          margin: '0 16px 16px',
        }}>
          {[
            { icon: '💧', label: 'Water', value: `${log?.hydration?.waterGlasses || 0}/8`, sub: 'glasses' },
            { icon: '🍌', label: 'Fruits', value: log?.fruitsEaten?.length || 0, sub: 'eaten' },
            { icon: '🛁', label: 'Sitz baths', value: log?.sitzBaths?.length || 0, sub: 'today' },
            { icon: '💛', label: 'Pain', value: log?.bowelMovements?.[0]?.painLevel ?? '–', sub: '/10' },
            { icon: '🩸', label: 'Blood-free', value: lastBlood >= 90 ? '90+' : lastBlood, sub: 'days', flipNum: typeof lastBlood === 'number' && lastBlood < 90 },
          ].map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: theme.card, borderRadius: 18, padding: '14px 10px',
                textAlign: 'center', border: `1px solid ${theme.cardBorder}`,
                boxShadow: `0 2px 8px ${theme.cardShadow}`,
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 2 }}>{card.icon}</div>
              {card.flipNum ? (
                <Suspense fallback={<div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Nunito', color: theme.primary, lineHeight: 1.2 }}>{card.value}</div>}>
                  <FlipNumber value={lastBlood} color={theme.primary} fontSize={20} />
                </Suspense>
              ) : (
                <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Nunito', color: theme.text, lineHeight: 1.2 }}>{card.value}</div>
              )}
              <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 2 }}>{card.sub}</div>
            </motion.div>
          ))}
        </div>
      </RevealCard>

      {/* ── boAt Fitness Teaser Card ── */}
      <RevealCard delay={0.12}>
        <FitnessTeaserCard today={today} theme={theme} onNavigate={onNavigate} />
      </RevealCard>

      {/* ── Healing Garden — always visible ── */}
      <RevealCard delay={0.15}>
        <HealingGardenFlowers bloodFreeDays={lastBlood} theme={theme} />
      </RevealCard>

      {/* ── YOUR PROGRESS section (collapsible) ── */}
      <div style={{ marginTop: 8 }}>
        <button
          onClick={() => toggleSection('progress')}
          aria-expanded={!collapsed.progress}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', padding: '12px 20px 4px', background: 'none', border: 'none', cursor: 'pointer',
          }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.8px', margin: 0 }}>
            Your Progress
          </p>
          <motion.div animate={{ rotate: collapsed.progress ? -90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} color={theme.textMuted} />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {!collapsed.progress && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              {/* Healing Day Grace */}
              {lastBlood === 0 && log && (() => {
                const freezeData = getHealingDayFreezes()
                const freezesLeft = 2 - freezeData.used
                return (
                  <RevealCard delay={0.05}>
                    <div style={{ margin: '16px 16px 0', background: theme.tipBg, borderRadius: 18, padding: '14px 16px', border: `1px solid ${theme.tipBorder}` }}>
                      <p style={{ fontSize: 13, color: theme.text, lineHeight: 1.6 }}>
                        Every setback is part of healing 💛 — you have <strong>{freezesLeft}</strong> streak {freezesLeft === 1 ? 'freeze' : 'freezes'} left this month
                      </p>
                    </div>
                  </RevealCard>
                )
              })()}

              {/* Streak */}
              <AnimatePresence>
                {streak > 0 && (
                  <RevealCard delay={0.1}>
                    <div style={{ margin: '16px 16px 0', background: theme.tipBg, borderRadius: 18, padding: '14px 16px', border: `1px solid ${theme.tipBorder}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <FlameIcon size={24} color={theme.primary} />
                      <div>
                        <p style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>Day {streak} of your healing journey</p>
                        <p style={{ fontSize: 12, color: theme.textMuted }}>
                          {streak >= 90 ? '90 days — you are incredible' :
                           streak >= 30 ? '30 days — a full month of self-care' :
                           streak >= 14 ? '2 weeks — that takes real strength' :
                           streak >= 7 ? 'One week — you showed up for yourself' : 'Every day counts. Keep going!'}
                        </p>
                      </div>
                    </div>
                  </RevealCard>
                )}
              </AnimatePresence>

              {/* Fiber Goal */}
              <RevealCard delay={0.15}>
                <FiberGoalWidget log={log} theme={theme} />
              </RevealCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── CTA Buttons ── */}
      <motion.div
        custom={5} variants={fadeUp} initial="hidden" animate={mounted ? 'visible' : 'hidden'}
        style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: `0 8px 30px ${theme.ctaShadow}` }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate('log')}
          aria-label="Log today's health data"
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
          aria-label="Open sitz bath timer"
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

      {/* ── INSIGHTS & TIPS section (collapsible) ── */}
      <div style={{ marginTop: 8 }}>
        <button
          onClick={() => toggleSection('insights')}
          aria-expanded={!collapsed.insights}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', padding: '12px 20px 4px', background: 'none', border: 'none', cursor: 'pointer',
          }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.8px', margin: 0 }}>
            Insights & Tips
          </p>
          <motion.div animate={{ rotate: collapsed.insights ? -90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} color={theme.textMuted} />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {!collapsed.insights && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              {weekData.some(d => d.pain !== null) && (
                <motion.div
                  custom={6} variants={fadeUp} initial="hidden" animate={mounted ? 'visible' : 'hidden'}
                  style={{ margin: '16px 16px 0', background: theme.card, borderRadius: 20, padding: '16px', border: `1px solid ${theme.cardBorder}`, boxShadow: `0 2px 10px ${theme.cardShadow}` }}
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

              <WaveBar color={theme.primary} opacity={0.15} style={{ margin: '12px 0' }} />

              <motion.div
                custom={7} variants={fadeUp} initial="hidden" animate={mounted ? 'visible' : 'hidden'}
                style={{ margin: '16px 16px 0', background: theme.tipBg, borderRadius: 18, padding: '16px', border: `1px solid ${theme.tipBorder}` }}
              >
                <p style={{ fontSize: 12, fontWeight: 600, color: theme.primary, marginBottom: 6 }}>Tip of the day</p>
                <p style={{ fontSize: 13, color: theme.text, lineHeight: 1.6 }}>{tip}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Sticky Log Pill (appears when scrolled) ── */}
      <AnimatePresence>
        {scrolled && !log && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              position: 'fixed',
              bottom: 'calc(80px + env(safe-area-inset-bottom))',
              left: '50%', transform: 'translateX(-50%)',
              zIndex: 50, width: 'calc(100% - 32px)', maxWidth: 398,
            }}
          >
            <button
              onClick={() => onNavigate('log')}
              aria-label="Log today's health data"
              style={{
                width: '100%', padding: '14px 20px',
                background: theme.ctaGradient, border: 'none', borderRadius: 20,
                color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                boxShadow: `0 6px 24px ${theme.ctaShadow}`,
              }}
            >
              📋 Log today's check-in
              {streak > 0 && (
                <span style={{ background: 'rgba(255,255,255,0.22)', borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>
                  🔥 {streak}
                </span>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sitz Timer Modal ── */}
      <AnimatePresence>
        {showSitzTimer && (
          <SitzTimerModal onClose={() => setShowSitzTimer(false)} theme={theme} />
        )}
      </AnimatePresence>
    </div>
  )
}
