import { useState, useEffect } from 'react'
import { Droplets, Pill, Bath, Zap, Droplet, Activity, PlusCircle, Flame, TrendingUp } from 'lucide-react'
import { getLog, getStreak, calcWellnessScore } from '../lib/storage'
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'
import ProgressRing from '../components/ui/ProgressRing'
import CareTask from '../components/ui/CareTask'

export default function HomeScreen({ onNavigate }) {
  const [log, setLog] = useState(null)
  const [streak, setStreak] = useState(0)
  const [weekData, setWeekData] = useState([])
  const [tasks, setTasks] = useState({ water: false, medication: false, sitz: false })

  const today = new Date().toISOString().split('T')[0]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const settings = (() => { try { return JSON.parse(localStorage.getItem('fissurecare_settings') || '{}') } catch { return {} } })()
  const name = settings.userName || ''

  useEffect(() => {
    getLog(today).then(l => {
      setLog(l)
      if (l) setTasks({ water: (l.hydration?.waterGlasses || 0) >= (settings.waterGoal || 8), medication: !!(l.medications?.length || l.topicalOintment?.timesApplied), sitz: (l.sitzBaths?.length || 0) > 0 })
    })
    setStreak(getStreak())
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const stored = localStorage.getItem('fissurecare_log_' + dateStr)
      const l = stored ? JSON.parse(stored) : null
      const pain = l?.bowelMovements?.[0]?.painLevel ?? l?.dailySymptoms?.restingPain ?? null
      days.push({ day: ['Su','Mo','Tu','We','Th','Fr','Sa'][d.getDay()], pain })
    }
    setWeekData(days)
  }, [today])

  const score = log ? calcWellnessScore(log) : 0
  const pain = log?.bowelMovements?.[0]?.painLevel ?? log?.dailySymptoms?.restingPain
  const bleeding = log?.bowelMovements?.some(bm => bm.bloodPresent) ? 'Yes' : log ? 'None' : '–'
  const stoolType = log?.bowelMovements?.[0]?.bristolType
  const stoolLabel = t => !t ? '–' : t <= 2 ? 'Hard' : t <= 4 ? 'Normal' : t <= 5 ? 'Soft' : 'Loose'
  const scoreLabel = score >= 80 ? 'Excellent day' : score >= 60 ? 'Good progress' : score >= 40 ? 'Getting there' : log ? 'Keep going' : 'Stable day'
  const doneCount = Object.values(tasks).filter(Boolean).length

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ padding: '52px 20px 20px', background: 'var(--gradient-soft)' }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: 3 }}>{greeting}</p>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>{name ? `Hi, ${name}` : 'Welcome back'}</h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 4 }}>Let's keep today gentle.</p>
      </div>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16, marginTop: -4 }}>
        <div style={{ background: 'var(--gradient-hero)', borderRadius: 'var(--radius-lg)', padding: '24px 20px', boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: 20, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 130, height: 130, borderRadius: '50%', background: 'rgba(124,108,255,0.2)', pointerEvents: 'none' }} />
          <ProgressRing score={score} size={110} strokeWidth={7} />
          <div style={{ flex: 1, zIndex: 1 }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 }}>Recovery Status</p>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>{scoreLabel}</h2>
            {streak > 0 && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.14)', borderRadius: 20, padding: '4px 10px' }}><Flame size={12} color="#FFD166" /><span style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>{streak} day streak</span></div>}
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>Today's priorities</h3>
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{doneCount} / 3 done</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <CareTask icon={<Droplets size={17} />} title="Drink 8 glasses of water" subtitle={`${log?.hydration?.waterGlasses || 0}/8 glasses logged`} done={tasks.water} />
            <CareTask icon={<Pill size={17} />} title="Take medication after breakfast" subtitle="Log in Care Plan tab" done={tasks.medication} />
            <CareTask icon={<Bath size={17} />} title="Sitz bath before bed" subtitle={`${log?.sitzBaths?.length || 0} completed today`} done={tasks.sitz} />
          </div>
        </div>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 10 }}>Symptom snapshot</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { label: 'Pain', icon: <Zap size={16} />, value: pain != null ? `${pain}/10` : '–', color: pain > 6 ? 'var(--color-danger)' : pain > 3 ? 'var(--color-warning)' : 'var(--color-lavender)' },
              { label: 'Bleeding', icon: <Droplet size={16} />, value: bleeding, color: bleeding === 'Yes' ? 'var(--color-danger)' : 'var(--color-success)' },
              { label: 'Stool', icon: <Activity size={16} />, value: stoolLabel(stoolType), color: 'var(--color-indigo)' },
            ].map(card => (
              <div key={card.label} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', padding: '14px 10px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
                <div style={{ color: card.color, display: 'flex', justifyContent: 'center', marginBottom: 6 }}>{card.icon}</div>
                <p style={{ fontSize: 17, fontWeight: 700, color: card.color, margin: 0 }}>{card.value}</p>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 3 }}>{card.label}</p>
              </div>
            ))}
          </div>
        </div>
        {weekData.some(d => d.pain !== null) && (
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '16px 16px 12px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}><TrendingUp size={15} color="var(--color-indigo)" /><p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>7-day pain trend</p></div>
            <ResponsiveContainer width="100%" height={56}><LineChart data={weekData}><Line type="monotone" dataKey="pain" stroke="var(--color-indigo)" strokeWidth={2.5} dot={{ fill: 'var(--color-indigo)', r: 3 }} connectNulls /><Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} formatter={v => [v, 'Pain']} /></LineChart></ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>{weekData.map((d, i) => <span key={i} style={{ fontSize: 10, color: 'var(--color-text-muted)', flex: 1, textAlign: 'center' }}>{d.day}</span>)}</div>
          </div>
        )}
        <button onClick={() => onNavigate('log')} style={{ width: '100%', padding: '18px', background: 'var(--gradient-primary)', border: 'none', borderRadius: 'var(--radius-md)', color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 8px 24px rgba(88,101,242,0.38)', fontFamily: 'var(--font-main)' }}><PlusCircle size={20} />Log today</button>
      </div>
    </div>
  )
}
