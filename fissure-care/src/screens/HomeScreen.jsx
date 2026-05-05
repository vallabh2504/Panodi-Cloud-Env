import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Droplets, Pill, Bath, Zap, Droplet, Activity, PlusCircle, Flame, TrendingUp } from 'lucide-react'
import { getLog, getStreak, calcWellnessScore } from '../lib/storage'
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'
import ProgressRing from '../components/ui/ProgressRing'
import CareTask from '../components/ui/CareTask'
import TextReveal from '../components/animations/TextReveal'
import FadeUp from '../components/animations/FadeUp'

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } },
}
const staggerItem = {
  hidden:   { opacity: 0, y: 16 },
  visible:  { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 220, damping: 26 } },
}

export default function HomeScreen({ onNavigate }) {
  const [log, setLog]           = useState(null)
  const [streak, setStreak]     = useState(0)
  const [weekData, setWeekData] = useState([])
  const [tasks, setTasks]       = useState({ water: false, medication: false, sitz: false })

  const today    = new Date().toISOString().split('T')[0]
  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const settings = (() => { try { return JSON.parse(localStorage.getItem('fissurecare_settings') || '{}') } catch { return {} } })()
  const name     = settings.userName || ''

  useEffect(() => {
    getLog(today).then(l => {
      setLog(l)
      if (l) setTasks({
        water:      (l.hydration?.waterGlasses || 0) >= (settings.waterGoal || 8),
        medication: !!(l.medications?.length || l.topicalOintment?.timesApplied),
        sitz:       (l.sitzBaths?.length || 0) > 0,
      })
    })
    setStreak(getStreak())
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const stored  = localStorage.getItem('fissurecare_log_' + dateStr)
      const l       = stored ? JSON.parse(stored) : null
      const pain    = l?.bowelMovements?.[0]?.painLevel ?? l?.dailySymptoms?.restingPain ?? null
      days.push({ day: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][d.getDay()], pain })
    }
    setWeekData(days)
  }, [today])

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
    <div style={{ paddingBottom: 0 }}>
      {/* ── Hero ── */}
      <div style={{
        background: 'var(--gradient-hero)',
        position: 'relative', overflow: 'hidden',
        minHeight: 220, paddingBottom: 48,
      }}>
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div style={{ padding: '56px 22px 0', position: 'relative', zIndex: 1 }}>
          <TextReveal
            text={greeting}
            tag="p"
            onMount={true}
            delay={0.05}
            style={{
              fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.65)',
              marginBottom: 6, letterSpacing: '0.04em',
            }}
          />
          <TextReveal
            text={name ? `Hi, ${name} 👋` : "Let's be gentle today."}
            tag="h1"
            onMount={true}
            delay={0.18}
            style={{
              fontSize: 28, fontWeight: 800, color: '#fff',
              margin: 0, letterSpacing: '-0.4px', lineHeight: 1.2,
            }}
          />
          {name && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.4 }}
              style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 5 }}
            >
              Let&#39;s make today gentle.
            </motion.p>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{
        borderRadius: '28px 28px 0 0',
        background: 'var(--color-bg)',
        marginTop: -24, position: 'relative', zIndex: 2,
        padding: '20px 16px 100px',
      }}>

        {/* Score card */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 22, delay: 0.2 }}
          style={{
            background: 'var(--gradient-hero)',
            borderRadius: 24, padding: '22px 20px',
            boxShadow: 'var(--shadow-teal)',
            display: 'flex', alignItems: 'center', gap: 20,
            position: 'relative', overflow: 'hidden',
            marginBottom: 16,
          }}
        >
          <div style={{ position: 'absolute', top: -32, right: -32, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -16, right: 56, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
          <ProgressRing score={score} size={108} strokeWidth={7} dark />
          <div style={{ flex: 1, zIndex: 1 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 5 }}>
              Recovery Score
            </p>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.2px' }}>
              {scoreLabel}
            </h2>
            {streak > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.6 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: 'rgba(255,255,255,0.14)', borderRadius: 20, padding: '4px 10px',
                }}
              >
                <Flame size={12} color="#FFD166" />
                <span style={{ fontSize: 12, color: '#fff', fontWeight: 700 }}>{streak} day streak</span>
              </motion.div>
            )}
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.42)', marginTop: 8 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </motion.div>

        {/* Today's priorities */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{ marginBottom: 16 }}
        >
          <motion.div
            variants={staggerItem}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
              Today&#39;s priorities
            </h3>
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{doneCount} / 3 done</span>
          </motion.div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              {
                icon:     <Droplets size={17} />,
                title:    'Drink 8 glasses of water',
                subtitle: `${log?.hydration?.waterGlasses || 0}/8 glasses logged`,
                done:     tasks.water,
              },
              {
                icon:     <Pill size={17} />,
                title:    'Take medication',
                subtitle: 'Log in Care Plan tab',
                done:     tasks.medication,
              },
              {
                icon:     <Bath size={17} />,
                title:    'Sitz bath',
                subtitle: `${log?.sitzBaths?.length || 0} completed today`,
                done:     tasks.sitz,
              },
            ].map((task) => (
              <motion.div key={task.title} variants={staggerItem}>
                <CareTask {...task} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Symptom snapshot */}
        <FadeUp delay={0}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 10 }}>
            Symptom snapshot
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
            {[
              {
                label: 'Pain',
                icon:  <Zap size={15} />,
                value: pain != null ? `${pain}/10` : '–',
                color: painColor,
              },
              {
                label: 'Bleeding',
                icon:  <Droplet size={15} />,
                value: bleeding,
                color: bleeding === 'Yes' ? 'var(--color-danger)' : 'var(--color-success)',
              },
              {
                label: 'Stool',
                icon:  <Activity size={15} />,
                value: stoolLabel(stoolType),
                color: 'var(--color-primary)',
              },
            ].map(card => (
              <motion.div
                key={card.label}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'var(--color-surface-solid)', borderRadius: 'var(--radius-md)',
                  padding: '14px 10px', border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-sm)', textAlign: 'center',
                }}
              >
                <div style={{ color: card.color, display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                  {card.icon}
                </div>
                <p style={{ fontSize: 17, fontWeight: 800, color: card.color, margin: 0 }}>{card.value}</p>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 3 }}>{card.label}</p>
              </motion.div>
            ))}
          </div>
        </FadeUp>

        {/* 7-day pain trend */}
        {weekData.some(d => d.pain !== null) && (
          <FadeUp delay={0.05} style={{ marginBottom: 16 }}>
            <div style={{
              background: 'var(--color-surface-solid)', borderRadius: 'var(--radius-lg)',
              padding: '16px 16px 12px', border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <TrendingUp size={15} color="var(--color-primary)" />
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
                  7-day pain trend
                </p>
              </div>
              <ResponsiveContainer width="100%" height={56}>
                <LineChart data={weekData}>
                  <Line
                    type="monotone"
                    dataKey="pain"
                    stroke="var(--color-primary)"
                    strokeWidth={2.5}
                    dot={{ fill: 'var(--color-primary)', r: 3 }}
                    connectNulls
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--color-surface-solid)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 8, fontSize: 12,
                    }}
                    formatter={v => [v, 'Pain']}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                {weekData.map((d, i) => (
                  <span key={i} style={{ fontSize: 10, color: 'var(--color-text-muted)', flex: 1, textAlign: 'center' }}>
                    {d.day}
                  </span>
                ))}
              </div>
            </div>
          </FadeUp>
        )}

        {/* Log CTA */}
        <FadeUp delay={0.08}>
          <motion.button
            onClick={() => onNavigate('log')}
            whileTap={{ scale: 0.97 }}
            whileHover={{ y: -2, boxShadow: '0 16px 40px rgba(45,125,111,0.45)' }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
            style={{
              width: '100%', padding: '18px',
              background: 'var(--gradient-primary)', border: 'none',
              borderRadius: 'var(--radius-lg)', color: '#fff', fontSize: 16, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: 'var(--shadow-teal)', fontFamily: 'var(--font-main)',
            }}
          >
            <PlusCircle size={20} />Log today
          </motion.button>
        </FadeUp>
      </div>
    </div>
  )
}
