import { useState, useEffect } from 'react'
import { PlusCircle, Flame } from 'lucide-react'
import { getLog, getStreak, calcWellnessScore } from '../lib/storage'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

const tips = [
  "💡 Warm sitz baths 3x a day can help relax the area and speed up healing! 🛁",
  "💡 Papaya contains papain, an enzyme that gently aids digestion. Try some today!",
  "💡 8 glasses of water a day keeps hard stools away — your healing best friend 💧",
  "💡 Gentle walking for 20 minutes helps improve blood flow to the healing area 🚶",
  "💡 Pear and kiwi have natural sorbitol that softens stools — great snack choices! 🍐",
  "💡 Stress can worsen discomfort. Even 5 minutes of deep breathing helps 🌸",
  "💡 A fiber-rich dal or oats breakfast sets you up for an easier day 🌾",
]

function WellnessRing({ score }) {
  const radius = 52, stroke = 8
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 70 ? '#A8D5A2' : score >= 40 ? '#F5C67A' : '#F48585'
  return (
    <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto' }}>
      <svg width={140} height={140} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={70} cy={70} r={radius} fill="none" stroke="#F0E0DA" strokeWidth={stroke} />
        <circle cx={70} cy={70} r={radius} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center'
      }}>
        <span style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Nunito', color: '#3D2B2B' }}>{score}</span>
        <span style={{ fontSize: 11, color: '#8C7070' }}>of 100</span>
      </div>
    </div>
  )
}

export default function HomeScreen({ onNavigate }) {
  const [log, setLog] = useState(null)
  const [streak, setStreak] = useState(0)
  const [weekData, setWeekData] = useState([])
  const [tip] = useState(tips[new Date().getDay() % tips.length])

  const today = new Date().toISOString().split('T')[0]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning 🌸' : hour < 17 ? 'Good afternoon ☀️' : 'Good evening 🌙'

  useEffect(() => {
    getLog(today).then(setLog)
    setStreak(getStreak())
    // Build 7-day sparkline
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
  }, [today])

  const score = log ? calcWellnessScore(log) : 0
  const settings = JSON.parse(localStorage.getItem('fissurecare_settings') || '{}')
  const name = settings.userName || ''
  const lastBlood = (() => {
    let days = 0
    for (let i = 1; i <= 30; i++) {
      const d = new Date(); d.setDate(d.getDate() - i)
      const stored = localStorage.getItem('fissurecare_log_' + d.toISOString().split('T')[0])
      const l = stored ? JSON.parse(stored) : null
      if (l?.bowelMovements?.some(bm => bm.bloodPresent)) return days
      days++
    }
    return days
  })()

  return (
    <div style={{ padding: '0 0 16px' }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 16px', background: 'linear-gradient(135deg, #FFF0EB 0%, #FFF8F5 100%)' }}>
        <p style={{ fontSize: 22, fontWeight: 700, color: '#E8705A', marginBottom: 2 }}>{greeting}</p>
        {name && <p style={{ fontSize: 14, color: '#8C7070' }}>Hi {name} — how are you feeling today?</p>}
        {!name && <p style={{ fontSize: 14, color: '#8C7070' }}>Take it gently today 💛</p>}
      </div>

      {/* Wellness Score */}
      <div style={{ margin: '16px', background: '#fff', borderRadius: 20, padding: '20px 16px', boxShadow: '0 2px 12px rgba(232,112,90,0.08)', border: '1px solid #F0E0DA' }}>
        <p style={{ textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#8C7070', marginBottom: 12 }}>Today's Wellness</p>
        <WellnessRing score={score} />
        <p style={{ textAlign: 'center', marginTop: 10, fontSize: 13, color: score >= 70 ? '#A8D5A2' : '#F5C67A' }}>
          {score >= 80 ? 'Amazing day! 🌟 Your body is healing.' :
           score >= 70 ? 'Great effort! 🌱 Keep going.' :
           score >= 40 ? "You're doing okay 💛 Small steps count." :
           log ? 'Today was hard. That\'s okay 🌱 Tomorrow is new.' :
           'Log your day to see your score 📝'}
        </p>
      </div>

      {/* Quick Summary Cards */}
      <div style={{ display: 'flex', gap: 10, padding: '0 16px', overflowX: 'auto' }} className="scrollbar-hide">
        {[
          { icon: '💧', label: 'Water', value: `${log?.hydration?.waterGlasses || 0}/8`, sub: 'glasses' },
          { icon: '🍌', label: 'Fruits', value: log?.fruitsEaten?.length || 0, sub: 'eaten' },
          { icon: '🛁', label: 'Sitz baths', value: log?.sitzBaths?.length || 0, sub: 'today' },
          { icon: '💛', label: 'Pain', value: log?.bowelMovements?.[0]?.painLevel ?? '–', sub: '/10' },
          { icon: '🩸', label: 'Blood-free', value: lastBlood, sub: 'days' },
        ].map((card, i) => (
          <div key={i} style={{
            minWidth: 80, background: '#fff', borderRadius: 16, padding: '12px 10px',
            textAlign: 'center', border: '1px solid #F0E0DA', flexShrink: 0
          }}>
            <div style={{ fontSize: 20 }}>{card.icon}</div>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Nunito', color: '#3D2B2B', lineHeight: 1.2 }}>{card.value}</div>
            <div style={{ fontSize: 10, color: '#8C7070' }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Streak */}
      {streak > 0 && (
        <div style={{ margin: '14px 16px', background: 'linear-gradient(135deg, #FFF0EB, #FFF8F5)', borderRadius: 16, padding: '12px 16px', border: '1px solid #F0E0DA', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Flame size={22} color="#E8705A" />
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#3D2B2B' }}>Day {streak} of your healing journey 🔥</p>
            <p style={{ fontSize: 12, color: '#8C7070' }}>
              {streak >= 90 ? '90 days! You are incredible 🌟' :
               streak >= 30 ? '30 days! A month of self-care 💪' :
               streak >= 14 ? '2 weeks! That takes strength 💛' :
               streak >= 7 ? 'One week! You showed up for yourself 🌸' : 'Every day counts. Keep going!'}
            </p>
          </div>
        </div>
      )}

      {/* CTA Button */}
      <div style={{ padding: '0 16px', margin: '16px 0' }}>
        <button onClick={() => onNavigate('log')} style={{
          width: '100%', padding: '18px', background: 'linear-gradient(135deg, #E8705A, #F5A68A)',
          border: 'none', borderRadius: 20, color: '#fff', fontSize: 17, fontWeight: 700,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 10, boxShadow: '0 6px 24px rgba(232,112,90,0.35)', letterSpacing: '-0.2px'
        }}>
          <PlusCircle size={22} /> Log Today's Entry
        </button>
      </div>

      {/* Sparkline */}
      {weekData.some(d => d.pain !== null) && (
        <div style={{ margin: '0 16px', background: '#fff', borderRadius: 20, padding: '16px', border: '1px solid #F0E0DA' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#8C7070', marginBottom: 10 }}>📈 Pain this week</p>
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={weekData}>
              <Line type="monotone" dataKey="pain" stroke="#E8705A" strokeWidth={2.5} dot={{ fill: '#E8705A', r: 3 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            {weekData.map((d, i) => (
              <span key={i} style={{ fontSize: 10, color: '#8C7070', flex: 1, textAlign: 'center' }}>{d.day}</span>
            ))}
          </div>
        </div>
      )}

      {/* Tip of the day */}
      <div style={{ margin: '14px 16px 0', background: 'linear-gradient(135deg, #F0EBFF, #FFF8F5)', borderRadius: 16, padding: '14px 16px', border: '1px solid #E8D8FF' }}>
        <p style={{ fontSize: 13, color: '#3D2B2B', lineHeight: 1.6 }}>{tip}</p>
      </div>
    </div>
  )
}
