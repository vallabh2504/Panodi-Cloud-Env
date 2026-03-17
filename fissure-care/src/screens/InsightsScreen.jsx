import { useState, useEffect } from 'react'
import { getAllLogs } from '../lib/storage'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

const TABS = ['Week', 'Month', '3 Months']

function ChartCard({ title, subtitle, children }) {
  return (
    <div style={{ margin: '0 16px 16px', background: '#fff', borderRadius: 20, padding: '16px', border: '1px solid #F0E0DA' }}>
      <p style={{ fontSize: 15, fontWeight: 700, color: '#3D2B2B', marginBottom: 2 }}>{title}</p>
      {subtitle && <p style={{ fontSize: 12, color: '#8C7070', marginBottom: 12 }}>{subtitle}</p>}
      {children}
    </div>
  )
}

function generateReport(logs) {
  if (!logs.length) return 'No data available yet.'
  const avgPain = logs.reduce((s, l) => s + (l.bowelMovements?.[0]?.painLevel || l.dailySymptoms?.restingPain || 0), 0) / logs.length
  const bloodDays = logs.filter(l => l.bowelMovements?.some(bm => bm.bloodPresent)).length
  const avgScore = logs.reduce((s, l) => s + (l.wellnessScore || 0), 0) / logs.length
  const avgWater = logs.reduce((s, l) => s + (l.hydration?.waterGlasses || 0), 0) / logs.length
  return `FissureCare Recovery Report — Last ${logs.length} days\n` +
    `Generated: ${new Date().toLocaleDateString()}\n\n` +
    `SUMMARY\n` +
    `Average wellness score: ${Math.round(avgScore)}/100\n` +
    `Average pain level: ${avgPain.toFixed(1)}/10\n` +
    `Days with bleeding: ${bloodDays} of ${logs.length} (${Math.round(bloodDays/logs.length*100)}%)\n` +
    `Average daily water: ${avgWater.toFixed(1)} glasses\n\n` +
    `DAILY LOG\n` +
    logs.map(l => `${l.date}: Pain ${l.bowelMovements?.[0]?.painLevel ?? '–'}, Water ${l.hydration?.waterGlasses || 0}/8 glasses, Sitz baths: ${l.sitzBaths?.length || 0}, Score: ${l.wellnessScore || '–'}`).join('\n')
}

export default function InsightsScreen() {
  const [tab, setTab] = useState('Week')
  const [logs, setLogs] = useState([])

  useEffect(() => { getAllLogs().then(setLogs) }, [])

  const days = tab === 'Week' ? 7 : tab === 'Month' ? 30 : 90

  const filtered = logs.slice(0, days).reverse()

  const painData = filtered.map(l => ({
    date: new Date(l.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    pain: l.bowelMovements?.[0]?.painLevel ?? l.dailySymptoms?.restingPain ?? 0
  }))

  const bloodData = filtered.map(l => ({
    date: new Date(l.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    blood: l.bowelMovements?.some(bm => bm.bloodPresent) ? 1 : 0
  }))

  const waterData = filtered.map(l => ({
    date: new Date(l.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    water: l.hydration?.waterGlasses || 0,
    bristol: l.bowelMovements?.[0]?.bristolType || 0
  }))

  const scoreData = filtered.map(l => ({
    date: new Date(l.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    score: l.wellnessScore || 0
  }))

  // Bristol distribution
  const bristolCounts = {}
  filtered.forEach(l => l.bowelMovements?.forEach(bm => {
    if (bm.bristolType) bristolCounts[bm.bristolType] = (bristolCounts[bm.bristolType] || 0) + 1
  }))
  const bristolData = Object.entries(bristolCounts).map(([type, count]) => ({
    name: `Type ${type}`, value: count
  }))
  const COLORS = ['#F48585', '#F5A68A', '#F5C67A', '#A8D5A2', '#C9A8F5', '#F5C67A', '#F48585']

  // Last blood-free days
  let bloodFreeDays = 0
  for (const l of [...logs]) {
    if (l.bowelMovements?.some(bm => bm.bloodPresent)) break
    bloodFreeDays++
  }

  const avgScore = scoreData.length ? Math.round(scoreData.reduce((s, d) => s + d.score, 0) / scoreData.length) : 0

  return (
    <div>
      <div style={{ padding: '20px 20px 16px', background: 'linear-gradient(135deg, #FFF0EB, #FFF8F5)', borderBottom: '1px solid #F0E0DA' }}>
        <p style={{ fontSize: 20, fontWeight: 700, color: '#E8705A' }}>📊 Your Insights</p>
        <p style={{ fontSize: 13, color: '#8C7070' }}>See your healing journey over time</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', padding: '12px 16px', gap: 8 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '8px', borderRadius: 12, border: 'none', cursor: 'pointer',
            background: tab === t ? '#E8705A' : '#F0E0DA',
            color: tab === t ? '#fff' : '#8C7070',
            fontWeight: tab === t ? 700 : 400, fontSize: 13, transition: 'all 0.2s'
          }}>{t}</button>
        ))}
      </div>

      {!logs.length ? (
        <div style={{ textAlign: 'center', padding: '60px 32px' }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>🌱</p>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#3D2B2B', marginBottom: 8 }}>No logs yet!</p>
          <p style={{ fontSize: 14, color: '#8C7070' }}>Start logging your daily entries to see insights and trends here.</p>
        </div>
      ) : (
        <>
          {/* Weekly Score */}
          <div style={{ margin: '0 16px 16px', background: 'linear-gradient(135deg, #FFF0EB, #FFF8F5)', borderRadius: 20, padding: '16px', border: '1px solid #F0E0DA' }}>
            <p style={{ fontSize: 13, color: '#8C7070' }}>{tab} average score</p>
            <p style={{ fontSize: 42, fontWeight: 800, fontFamily: 'Nunito', color: '#E8705A' }}>{avgScore}</p>
            <p style={{ fontSize: 13, color: '#8C7070' }}>
              {avgScore >= 70 ? 'You\'re doing great! 🌟' : avgScore >= 40 ? 'Making progress 🌱' : 'Keep going, every day counts 💛'}
            </p>
            {bloodFreeDays > 0 && (
              <div style={{ marginTop: 10, background: '#F0FFF5', borderRadius: 12, padding: '8px 12px' }}>
                <p style={{ fontSize: 13, color: '#5A9E5A', fontWeight: 600 }}>
                  🎉 {bloodFreeDays} days without bleeding! {bloodFreeDays >= 7 ? 'Incredible healing!' : 'Great progress!'}
                </p>
              </div>
            )}
          </div>

          {/* Pain Chart */}
          <ChartCard title="Pain Levels" subtitle={`Your discomfort score over the last ${tab.toLowerCase()}`}>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={painData}>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} width={20} />
                <Tooltip formatter={v => [`${v}/10`, 'Pain']} />
                <Line type="monotone" dataKey="pain" stroke="#E8705A" strokeWidth={2.5}
                  dot={{ fill: '#E8705A', r: 3 }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
            <p style={{ fontSize: 12, color: '#8C7070', marginTop: 8 }}>
              {painData.length >= 2 && painData[painData.length-1].pain < painData[0].pain
                ? '📉 Trending down — great progress!'
                : painData.length >= 2 && painData[painData.length-1].pain > painData[0].pain
                ? '💛 Pain seems elevated. Consider calling your doctor if it continues.'
                : 'Keep logging to see trends!'}
            </p>
          </ChartCard>

          {/* Blood Incidents */}
          <ChartCard title="Bleeding Incidents" subtitle="Days with vs. without bleeding">
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={bloodData}>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis domain={[0, 1]} tick={{ fontSize: 10 }} width={15} hide />
                <Tooltip formatter={v => [v ? 'Yes' : 'None', 'Bleeding']} />
                <Bar dataKey="blood" fill="#F48585" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
            <p style={{ fontSize: 12, color: '#8C7070', marginTop: 8 }}>
              {bloodFreeDays > 0 ? `Last bleeding: ${bloodFreeDays} days ago 🎉` : 'Log daily to track bleeding patterns'}
            </p>
          </ChartCard>

          {/* Hydration vs Bristol */}
          <ChartCard title="Water Intake & Stool Quality" subtitle="How hydration affects consistency">
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={waterData}>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis yAxisId="water" orientation="left" domain={[0, 8]} tick={{ fontSize: 10 }} width={20} />
                <YAxis yAxisId="bristol" orientation="right" domain={[1, 7]} tick={{ fontSize: 10 }} width={20} />
                <Tooltip />
                <Line yAxisId="water" type="monotone" dataKey="water" stroke="#A8D5A2" strokeWidth={2} name="Water (glasses)" dot={false} connectNulls />
                <Line yAxisId="bristol" type="monotone" dataKey="bristol" stroke="#C9A8F5" strokeWidth={2} name="Bristol type" dot={false} connectNulls />
              </LineChart>
            </ResponsiveContainer>
            <p style={{ fontSize: 12, color: '#8C7070', marginTop: 4 }}>
              <span style={{ color: '#A8D5A2' }}>— Water</span> &nbsp; <span style={{ color: '#C9A8F5' }}>— Stool type</span>
            </p>
          </ChartCard>

          {/* Bristol Distribution */}
          {bristolData.length > 0 && (
            <ChartCard title="Stool Type Distribution" subtitle="Your most common type — aim for Type 4!">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={bristolData} cx="50%" cy="50%" outerRadius={60} dataKey="value" label={({ name, percent }) => `${name} (${Math.round(percent*100)}%)`} labelLine={false}>
                    {bristolData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          {/* Wellness Score Trend */}
          <ChartCard title="Wellness Score Trend" subtitle="Your daily score over time">
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={scoreData}>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} width={25} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#A8D5A2" strokeWidth={2.5} dot={{ fill: '#A8D5A2', r: 3 }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Doctor's Report */}
          <div style={{ padding: '0 16px 32px' }}>
            <button onClick={() => {
              const report = generateReport(filtered)
              const blob = new Blob([report], { type: 'text/plain' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url; a.download = `fissurecare-report-${new Date().toISOString().split('T')[0]}.txt`; a.click()
            }} style={{
              width: '100%', padding: '16px', background: 'linear-gradient(135deg, #C9A8F5, #B08AE8)',
              border: 'none', borderRadius: 20, color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 4px 16px rgba(201,168,245,0.35)'
            }}>
              📄 Generate Doctor's Report
            </button>
          </div>
        </>
      )}
    </div>
  )
}
