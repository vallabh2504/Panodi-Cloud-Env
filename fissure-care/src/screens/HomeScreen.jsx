import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Droplets, Pill, Bath, Zap, Droplet, Activity, PlusCircle, Flame } from 'lucide-react'
import { getLog, getStreak, calcWellnessScore } from '../lib/storage'
import ProgressRing from '../components/ui/ProgressRing'
import CareTask from '../components/ui/CareTask'
import TextReveal from '../components/animations/TextReveal'
import FadeUp from '../components/animations/FadeUp'
import { haptic } from '../lib/haptics'

function HealingIllustration() {
  return (
    <svg viewBox="0 0 160 130" fill="none" style={{ width: 120, height: 98, flexShrink: 0 }}>
      <circle cx="80" cy="70" r="44" fill="rgba(255,255,255,0.05)" />
      <circle cx="80" cy="70" r="30" fill="rgba(255,255,255,0.07)" />
      <ellipse cx="52" cy="66" rx="18" ry="34" fill="rgba(76,169,154,0.5)" transform="rotate(-30 52 66)" />
      <ellipse cx="52" cy="66" rx="10" ry="27" fill="rgba(110,196,184,0.38)" transform="rotate(-30 52 66)" />
      <ellipse cx="108" cy="66" rx="18" ry="34" fill="rgba(76,169,154,0.5)" transform="rotate(30 108 66)" />
      <ellipse cx="108" cy="66" rx="10" ry="27" fill="rgba(110,196,184,0.38)" transform="rotate(30 108 66)" />
      <ellipse cx="62" cy="56" rx="14" ry="28" fill="rgba(196,212,210,0.55)" transform="rotate(-14 62 56)" />
      <ellipse cx="98" cy="56" rx="14" ry="28" fill="rgba(196,212,210,0.55)" transform="rotate(14 98 56)" />
      <ellipse cx="80" cy="52" rx="16" ry="38" fill="rgba(240,248,246,0.7)" />
      <circle cx="80" cy="60" r="18" fill="rgba(255,255,255,0.2)" />
      <circle cx="80" cy="60" r="11" fill="rgba(255,255,255,0.28)" />
      <circle cx="80" cy="60" r="6.5" fill="rgba(196,149,106,0.88)" />
      <circle cx="80" cy="60" r="3" fill="rgba(255,225,190,1)" />
      <path d="M80 80 Q77 98 80 116" stroke="rgba(76,169,154,0.55)" strokeWidth="3.2" strokeLinecap="round" />
      <ellipse cx="60" cy="108" rx="24" ry="8" fill="rgba(74,158,110,0.16)" transform="rotate(-12 60 108)" />
      <ellipse cx="100" cy="106" rx="20" ry="7" fill="rgba(74,158,110,0.14)" transform="rotate(10 100 106)" />
      <ellipse cx="32" cy="44" rx="4.5" ry="6.5" fill="rgba(255,255,255,0.32)" />
      <ellipse cx="128" cy="48" rx="3.5" ry="5.5" fill="rgba(255,255,255,0.26)" />
      <circle cx="114" cy="30" r="2.5" fill="rgba(255,220,170,0.95)" />
      <circle cx="46" cy="26" r="2" fill="rgba(255,220,170,0.85)" />
      <circle cx="132" cy="70" r="1.8" fill="rgba(255,255,255,0.75)" />
      <circle cx="28" cy="78" r="1.5" fill="rgba(255,255,255,0.6)" />
    </svg>
  )
}

export default function HomeScreen({ onNavigate }) {
  const [log, setLog]       = useState(null)
  const [streak, setStreak] = useState(0)
  const [tasks, setTasks]   = useState({ water: false, medication: false, sitz: false })

  const today    = new Date().toISOString().split('T')[0]
  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const settings = (() => { try { return JSON.parse(localStorage.getItem('fissurecare_settings') || '{}') } catch { return {} } })()
  const name     = settings.userName || ''

  useEffect(() => {
    getLog(today).then(l => {
      setLog(l)
      if (l) {
        setTasks(t => ({
          ...t,
          water:      (l.hydration?.waterGlasses || 0) >= (settings.waterGoal || 8),
          medication: !!(l.medications?.length || l.topicalOintment?.timesApplied),
          sitz:       (l.sitzBaths?.length || 0) > 0,
        }))
      }
    })
    setStreak(getStreak())

    // Load manually toggled tasks from localStorage
    const savedTasks = localStorage.getItem('carenest_tasks_' + today)
    if (savedTasks) setTasks(t => ({ ...t, ...JSON.parse(savedTasks) }))
  }, [today])

  const toggleTask = (key) => {
    setTasks(prev => {
      const next = { ...prev, [key]: !prev[key] }
      localStorage.setItem('carenest_tasks_' + today, JSON.stringify(next))
      return next
    })
    haptic.tap()
  }

  const score      = log ? calcWellnessScore(log) : 0
  const pain       = log?.bowelMovements?.[0]?.painLevel ?? log?.dailySymptoms?.restingPain
  const bleeding   = log?.bowelMovements?.some(bm => bm.bloodPresent) ? 'Yes' : log ? 'None' : '–'
  const stoolType  = log?.bowelMovements?.[0]?.bristolType
  const stoolLabel = t => !t ? '–' : t <= 2 ? 'Hard' : t <= 4 ? 'Normal' : t <= 5 ? 'Soft' : 'Loose'
  const scoreLabel = score >= 80 ? 'Excellent day' : score >= 60 ? 'Good progress' : score >= 40 ? 'Getting there' : log ? 'Keep going' : 'Stable day'
  const doneCount  = Object.values(tasks).filter(Boolean).length

  const painColor = pain == null
    ? 'var(--color-text-muted)'
    : pain <= 2
    ? 'var(--color-success)'
    : pain <= 5
    ? 'var(--color-warning)'
    : 'var(--color-danger)'

  return (
    <div style={{ position: 'relative', paddingBottom: 0, minHeight: '100dvh', background: 'var(--color-bg)', overflow: 'hidden' }}>

      {/* Ambient background particles */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div className="particle particle-3 particle--page" style={{ opacity: 0.5 }} />
        <div className="particle particle-7 particle--page" style={{ opacity: 0.4 }} />
        <div className="particle particle-8 particle--page" style={{ opacity: 0.35 }} />
      </div>

      {/* All content, above particles */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Hero ── */}
        <div style={{
          background: 'var(--gradient-hero)',
          position: 'relative', overflow: 'hidden',
          minHeight: 160, paddingBottom: 32,
        }}>
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
          <div style={{ padding: '44px 22px 12px', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <TextReveal
                text={greeting}
                tag="p"
                onMount={true}
                delay={0.05}
                style={{
                  fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)',
                  marginBottom: 4, letterSpacing: '0.06em', textTransform: 'uppercase',
                }}
              />
              <TextReveal
                text={name ? `Hi, ${name} 👋` : "Let's be gentle today."}
                tag="h1"
                onMount={true}
                delay={0.18}
                style={{
                  fontSize: 24, fontWeight: 800, color: '#fff',
                  margin: 0, letterSpacing: '-0.3px', lineHeight: 1.22,
                }}
              />
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}
              >
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 160, damping: 20, delay: 0.3 }}
            >
              <HealingIllustration />
            </motion.div>
          </div>
        </div>

        {/* ── Content ── */}
        <div style={{
          borderRadius: '28px 28px 0 0',
          background: 'transparent',
          marginTop: -20, position: 'relative', zIndex: 2,
          padding: '16px 16px 80px',
        }}>

          {/* Score card */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 180, damping: 22, delay: 0.2 }}
          >
            <motion.div
              animate={{ scale: [1, 1.008, 1] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                background: 'var(--gradient-hero)',
                borderRadius: 24, padding: '14px 16px',
                boxShadow: 'var(--shadow-teal)',
                display: 'flex', alignItems: 'center', gap: 16,
                position: 'relative', overflow: 'hidden',
                marginBottom: 12,
              }}
            >
              <div style={{ position: 'absolute', top: -32, right: -32, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: -16, right: 56, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
              <ProgressRing score={score} size={80} strokeWidth={5} dark />
              <div style={{ flex: 1, zIndex: 1 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 3 }}>
                  Recovery Score
                </p>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.2px' }}>
                  {scoreLabel}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  {streak > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.6 }}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        background: 'rgba(255,255,255,0.14)', borderRadius: 20, padding: '3px 9px',
                      }}
                    >
                      <Flame size={11} color="#FFD166" />
                      <span style={{ fontSize: 11, color: '#fff', fontWeight: 700 }}>{streak} day streak</span>
                    </motion.div>
                  )}
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.42)', margin: 0 }}>
                    {doneCount}/3 tasks done
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Today's priorities */}
          <FadeUp delay={0.15}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
                  Today&#39;s priorities
                </h3>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{doneCount} / 3 done</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  {
                    key:      'water',
                    icon:     <Droplets size={17} />,
                    title:    'Drink 8 glasses of water',
                    subtitle: `${log?.hydration?.waterGlasses || 0}/8 glasses logged`,
                    done:     tasks.water,
                  },
                  {
                    key:      'medication',
                    icon:     <Pill size={17} />,
                    title:    'Take medication',
                    subtitle: 'Log in Care Plan tab',
                    done:     tasks.medication,
                  },
                  {
                    key:      'sitz',
                    icon:     <Bath size={17} />,
                    title:    'Sitz bath',
                    subtitle: `${log?.sitzBaths?.length || 0} completed today`,
                    done:     tasks.sitz,
                  },
                ].map((task) => (
                  <motion.div
                    key={task.key}
                    animate={task.done ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                  >
                    <CareTask
                      icon={task.icon}
                      title={task.title}
                      subtitle={task.subtitle}
                      done={task.done}
                      onToggle={() => toggleTask(task.key)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Symptom snapshot */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{ marginBottom: 12 }}
          >
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 8 }}>
              Symptom snapshot
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {[
                {
                  label: 'Pain',
                  icon:  <Zap size={14} />,
                  value: pain != null ? `${pain}/10` : '–',
                  color: painColor,
                },
                {
                  label: 'Bleeding',
                  icon:  <Droplet size={14} />,
                  value: bleeding,
                  color: bleeding === 'Yes' ? 'var(--color-danger)' : 'var(--color-success)',
                },
                {
                  label: 'Stool',
                  icon:  <Activity size={14} />,
                  value: stoolLabel(stoolType),
                  color: 'var(--color-primary)',
                },
              ].map(card => (
                <motion.div
                  key={card.label}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'rgba(255,255,255,0.7)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 8px', border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-sm)', textAlign: 'center',
                  }}
                >
                  <div style={{ color: card.color, display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
                    {card.icon}
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 800, color: card.color, margin: 0 }}>{card.value}</p>
                  <p style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>{card.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Log CTA */}
          <FadeUp delay={0.08}>
            <motion.button
              onClick={() => onNavigate('log')}
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -2, boxShadow: '0 16px 40px rgba(45,125,111,0.45)' }}
              transition={{ type: 'spring', stiffness: 340, damping: 26 }}
              style={{
                width: '100%', padding: '16px',
                background: 'var(--gradient-primary)', border: 'none',
                borderRadius: 'var(--radius-lg)', color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                boxShadow: 'var(--shadow-teal)', fontFamily: 'var(--font-main)',
              }}
            >
              <PlusCircle size={19} />Log today
            </motion.button>
          </FadeUp>
        </div>
      </div>
    </div>
  )
}
