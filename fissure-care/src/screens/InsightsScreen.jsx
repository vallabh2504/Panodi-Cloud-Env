import { useState, useEffect, useMemo } from 'react'
import { getAllLogs } from '../lib/storage'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { analyzeFoodOutcomes } from '../lib/correlations'

const TABS = ['Week', 'Month', '3 Months']

function ChartCard({ title, subtitle, children, theme }) {
  return (
    <div style={{
      margin: '0 16px 16px',
      background: theme.card,
      borderRadius: 20, padding: '16px',
      border: `1px solid ${theme.cardBorder}`,
    }}>
      <p style={{ fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 2 }}>{title}</p>
      {subtitle && <p style={{ fontSize: 12, color: theme.textMuted, marginBottom: 12 }}>{subtitle}</p>}
      {children}
    </div>
  )
}

function generateReport(logs, isEmergency) {
  if (!logs.length) return 'No data available yet.'
  const last14 = logs.slice(0, 14)
  const avgPain = last14.reduce((s, l) => s + (l.bowelMovements?.[0]?.painLevel || l.dailySymptoms?.restingPain || 0), 0) / last14.length
  const bloodDays = last14.filter(l => l.bowelMovements?.some(bm => bm.bloodPresent)).length
  const avgScore = last14.reduce((s, l) => s + (l.wellnessScore || 0), 0) / last14.length
  const avgWater = last14.reduce((s, l) => s + (l.hydration?.waterGlasses || 0), 0) / last14.length
  const avgSitz = last14.reduce((s, l) => s + (l.sitzBaths?.length || 0), 0) / last14.length
  const highPainDays = last14.filter(l => (l.bowelMovements?.[0]?.painLevel || l.dailySymptoms?.restingPain || 0) >= 7).length

  const header = isEmergency
    ? `URGENT PATIENT REPORT — Healing Garden\nGenerated: ${new Date().toLocaleDateString()}\n\n` +
      `⚠️ NOTE TO DOCTOR: Patient has recorded high pain (≥7/10) or bleeding for 2 or more consecutive days.\n` +
      `This report covers the last 14 days of tracked data.\n`
    : `Healing Garden Wellness Report\nGenerated: ${new Date().toLocaleDateString()}\nData period: Last ${last14.length} days\n`

  return header +
    `\n═══════════════════════════════\n` +
    `SUMMARY (Last ${last14.length} Days)\n` +
    `═══════════════════════════════\n` +
    `Average wellness score: ${Math.round(avgScore)}/100\n` +
    `Average pain level: ${avgPain.toFixed(1)}/10\n` +
    `High pain days (≥7/10): ${highPainDays} of ${last14.length}\n` +
    `Days with bleeding: ${bloodDays} of ${last14.length} (${Math.round(bloodDays / last14.length * 100)}%)\n` +
    `Average daily water: ${avgWater.toFixed(1)} glasses\n` +
    `Average sitz baths/day: ${avgSitz.toFixed(1)}\n` +
    `\n═══════════════════════════════\n` +
    `DAILY LOG\n` +
    `═══════════════════════════════\n` +
    last14.map(l => {
      const pain = l.bowelMovements?.[0]?.painLevel ?? l.dailySymptoms?.restingPain ?? '–'
      const blood = l.bowelMovements?.some(bm => bm.bloodPresent) ? 'YES' : 'No'
      const water = l.hydration?.waterGlasses || 0
      const sitz = l.sitzBaths?.length || 0
      const score = l.wellnessScore || '–'
      const bristol = l.bowelMovements?.[0]?.bristolType ? `Bristol ${l.bowelMovements[0].bristolType}` : '–'
      return `${l.date}  |  Pain: ${pain}/10  |  Bleeding: ${blood}  |  ${bristol}  |  Water: ${water}/8  |  Sitz: ${sitz}  |  Score: ${score}/100`
    }).join('\n')
}

function checkEmergencyCondition(logs) {
  const sorted = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date))
  let consecutive = 0
  for (const l of sorted) {
    const pain = l.bowelMovements?.[0]?.painLevel || l.dailySymptoms?.restingPain || 0
    const hasBlood = l.bowelMovements?.some(bm => bm.bloodPresent)
    if (pain >= 7 || hasBlood) {
      consecutive++
      if (consecutive >= 2) return true
    } else {
      break
    }
  }
  return false
}

const CONFIDENCE_STYLE = {
  high: { background: '#D1FAE5', color: '#065F46', label: 'High evidence' },
  medium: { background: '#DBEAFE', color: '#1E40AF', label: 'Medium evidence' },
  low: { background: '#FEF3C7', color: '#92400E', label: 'Low evidence' },
}

function FoodCorrelationSection({ logs, theme }) {
  const p = theme?.primary || '#E8705A'
  const card = theme?.card || '#fff'
  const border = theme?.cardBorder || '#F0E0DA'
  const text = theme?.text || '#3D2B2B'
  const muted = theme?.textMuted || '#8C7070'

  const results = useMemo(() => analyzeFoodOutcomes(logs), [logs])
  const entries = Object.entries(results)

  return (
    <div style={{ margin: '0 16px 16px', background: card, borderRadius: 20, padding: '16px', border: `1px solid ${border}` }}>
      <p style={{ fontSize: 15, fontWeight: 700, color: text, marginBottom: 2 }}>Food Outcome Correlations</p>
      <p style={{ fontSize: 12, color: muted, marginBottom: 12 }}>24h–72h lag window analysis</p>
      {entries.length === 0 ? (
        <p style={{ fontSize: 13, color: muted, fontStyle: 'italic', textAlign: 'center', padding: '8px 0' }}>
          Log at least 5 days with the same food to see personalized insights.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {entries.map(([key, data]) => {
            const cs = CONFIDENCE_STYLE[data.confidence] || CONFIDENCE_STYLE.low
            return (
              <div key={key} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: data.isTrigger ? '#FFF5F5' : '#F0FFF5',
                borderRadius: 12, padding: '10px 12px',
                border: `1px solid ${data.isTrigger ? '#FFCDD2' : '#C8E6C9'}`,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: text, marginBottom: 2 }}>{data.name}</p>
                  <p style={{ fontSize: 12, color: muted }}>
                    Avg pain: {data.avgPain}/10 &middot; {data.count} observations
                    {data.avgBristol ? ` · Bristol ${data.avgBristol}` : ''}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0, marginLeft: 8 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20,
                    background: cs.background, color: cs.color,
                  }}>{cs.label}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20,
                    background: data.isTrigger ? '#FFCDD2' : '#C8E6C9',
                    color: data.isTrigger ? '#B71C1C' : '#1B5E20',
                  }}>{data.isTrigger ? 'Trigger' : 'Helper'}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function CalendarHeatmap({ logs, theme }) {
  const [selectedDay, setSelectedDay] = useState(null)

  const card = theme?.card || '#fff'
  const border = theme?.cardBorder || '#F0E0DA'
  const text = theme?.text || '#3D2B2B'
  const muted = theme?.textMuted || '#8C7070'
  const wellnessHigh = theme?.wellnessHigh || '#A8D5A2'

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const monthName = now.toLocaleString('en', { month: 'long' })
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay() // 0=Sun

  // Build a map from YYYY-MM-DD -> log data
  const logMap = useMemo(() => {
    const map = {}
    for (const log of logs) {
      map[log.date] = log
    }
    return map
  }, [logs])

  // Build 35-cell grid (5 weeks * 7 days)
  const cells = []
  for (let i = 0; i < 35; i++) {
    const dayNum = i - firstDayOfWeek + 1
    if (dayNum < 1 || dayNum > daysInMonth) {
      cells.push({ dayNum: null, dateStr: null })
    } else {
      const mm = String(month + 1).padStart(2, '0')
      const dd = String(dayNum).padStart(2, '0')
      const dateStr = `${year}-${mm}-${dd}`
      cells.push({ dayNum, dateStr })
    }
  }

  function getCellColor(dateStr) {
    if (!dateStr) return 'transparent'
    const log = logMap[dateStr]
    if (!log) return border
    const pain = log.bowelMovements?.[0]?.painLevel ?? log.dailySymptoms?.restingPain ?? null
    const hasBlood = log.bowelMovements?.some(bm => bm.bloodPresent) || false
    if (hasBlood || (pain !== null && pain >= 7)) return '#F48585'
    if (pain !== null && pain >= 4) return '#F5C67A'
    if (pain !== null && pain <= 3) return wellnessHigh
    return border
  }

  const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  const selectedLog = selectedDay ? logMap[selectedDay] : null
  const selectedPain = selectedLog
    ? (selectedLog.bowelMovements?.[0]?.painLevel ?? selectedLog.dailySymptoms?.restingPain ?? null)
    : null
  const selectedBlood = selectedLog
    ? (selectedLog.bowelMovements?.some(bm => bm.bloodPresent) || false)
    : false

  return (
    <div style={{ margin: '0 16px 16px', background: card, borderRadius: 20, padding: '16px', border: `1px solid ${border}` }}>
      <p style={{ fontSize: 15, fontWeight: 700, color: text, marginBottom: 2 }}>Symptom Calendar</p>
      <p style={{ fontSize: 12, color: muted, marginBottom: 12 }}>{monthName} {year}</p>

      {/* Day of week headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 36px)', gap: 4, marginBottom: 4 }}>
        {DAYS_OF_WEEK.map(d => (
          <div key={d} style={{ width: 36, textAlign: 'center', fontSize: 10, fontWeight: 600, color: muted }}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 36px)', gap: 4 }}>
        {cells.map((cell, idx) => {
          const color = getCellColor(cell.dateStr)
          const isSelected = selectedDay === cell.dateStr
          const hasData = cell.dateStr && logMap[cell.dateStr]
          return (
            <div
              key={idx}
              onClick={() => {
                if (!hasData) return
                setSelectedDay(isSelected ? null : cell.dateStr)
              }}
              style={{
                width: 36, height: 36, borderRadius: 8,
                background: color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: hasData ? 'pointer' : 'default',
                border: isSelected ? `2px solid ${text}` : '2px solid transparent',
                boxSizing: 'border-box',
                opacity: cell.dayNum === null ? 0 : 1,
              }}
            >
              {cell.dayNum !== null && (
                <span style={{ fontSize: 11, fontWeight: 600, color: color === border ? muted : '#fff' }}>
                  {cell.dayNum}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Tooltip / selected day info */}
      {selectedDay && selectedLog && (
        <div style={{
          marginTop: 10, background: border, borderRadius: 12, padding: '10px 14px',
        }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: text, marginBottom: 2 }}>{selectedDay}</p>
          <p style={{ fontSize: 12, color: muted }}>
            Pain: {selectedPain !== null ? `${selectedPain}/10` : 'Not recorded'} &nbsp;&middot;&nbsp;
            Blood: {selectedBlood ? 'Yes' : 'No'}
          </p>
        </div>
      )}

      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
        {[
          { color: wellnessHigh, label: 'Pain ≤3, no blood' },
          { color: '#F5C67A', label: 'Pain 4–6' },
          { color: '#F48585', label: 'Blood or pain ≥7' },
          { color: border, label: 'No data' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: color, border: `1px solid ${border}` }} />
            <span style={{ fontSize: 10, color: muted }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function InsightsScreen({ theme }) {
  const [tab, setTab] = useState('Week')
  const [logs, setLogs] = useState([])

  useEffect(() => { getAllLogs().then(setLogs) }, [])

  const days = tab === 'Week' ? 7 : tab === 'Month' ? 30 : 90
  const filtered = logs.slice(0, days).reverse()

  const isEmergency = useMemo(() => checkEmergencyCondition(logs), [logs])

  const painData = filtered.map(l => ({
    date: new Date(l.date).toLocaleDateString('en', { day: 'numeric', month: 'short' }),
    pain: l.bowelMovements?.[0]?.painLevel ?? l.dailySymptoms?.restingPain ?? 0
  }))

  const bloodData = filtered.map(l => ({
    date: new Date(l.date).toLocaleDateString('en', { day: 'numeric', month: 'short' }),
    blood: l.bowelMovements?.some(bm => bm.bloodPresent) ? 1 : 0
  }))

  const waterData = filtered.map(l => ({
    date: new Date(l.date).toLocaleDateString('en', { day: 'numeric', month: 'short' }),
    water: l.hydration?.waterGlasses || 0,
    bristol: l.bowelMovements?.[0]?.bristolType || 0
  }))

  const scoreData = filtered.map(l => ({
    date: new Date(l.date).toLocaleDateString('en', { day: 'numeric', month: 'short' }),
    score: l.wellnessScore || 0
  }))

  const bristolCounts = {}
  filtered.forEach(l => l.bowelMovements?.forEach(bm => {
    if (bm.bristolType) bristolCounts[bm.bristolType] = (bristolCounts[bm.bristolType] || 0) + 1
  }))
  const bristolData = Object.entries(bristolCounts).map(([type, count]) => ({ name: `Type ${type}`, value: count }))
  const COLORS = ['#F48585', '#F5A68A', '#F5C67A', '#A8D5A2', '#C9A8F5', '#F5C67A', '#F48585']

  // Blood-free streak — look back up to 90 days
  let bloodFreeDays = 0
  for (const l of logs.slice(0, 90)) {
    if (l.bowelMovements?.some(bm => bm.bloodPresent)) break
    bloodFreeDays++
  }
  const bloodFreeCapped = bloodFreeDays >= 90

  const avgScore = scoreData.length ? Math.round(scoreData.reduce((s, d) => s + d.score, 0) / scoreData.length) : 0

  const downloadReport = (emergency) => {
    const report = generateReport(logs, emergency)
    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `healing-garden-${emergency ? 'emergency-' : ''}report-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const p = theme?.primary || '#E8705A'
  const card = theme?.card || '#fff'
  const border = theme?.cardBorder || '#F0E0DA'
  const text = theme?.text || '#3D2B2B'
  const muted = theme?.textMuted || '#8C7070'
  const header = theme?.headerGradient || 'linear-gradient(135deg, #FFF0EB, #FFF8F5)'

  return (
    <div>
      <div style={{ padding: '20px 20px 16px', background: header, borderBottom: `1px solid ${border}` }}>
        <p style={{ fontSize: 20, fontWeight: 700, color: p }}>Your Insights</p>
        <p style={{ fontSize: 13, color: muted }}>Track your healing journey over time</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', padding: '12px 16px', gap: 8 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '8px', borderRadius: 12, border: 'none', cursor: 'pointer',
            background: tab === t ? p : border,
            color: tab === t ? '#fff' : muted,
            fontWeight: tab === t ? 700 : 400, fontSize: 13, transition: 'all 0.2s'
          }}>{t}</button>
        ))}
      </div>

      {!logs.length ? (
        <div style={{ textAlign: 'center', padding: '60px 32px' }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>🌱</p>
          <p style={{ fontSize: 16, fontWeight: 600, color: text, marginBottom: 8 }}>No logs yet</p>
          <p style={{ fontSize: 14, color: muted }}>Start logging your daily entries to see insights and trends here.</p>
        </div>
      ) : (
        <>
          {/* Emergency Doctor Alert */}
          <AnimatePresence>
            {isEmergency && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  margin: '0 16px 16px',
                  background: 'linear-gradient(135deg, #FFF0F0, #FFE8E8)',
                  borderRadius: 20, padding: '16px',
                  border: '2px solid #F48585',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <AlertTriangle size={18} color="#E85A5A" />
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#E85A5A' }}>
                    Doctor Consultation Recommended
                  </p>
                </div>
                <p style={{ fontSize: 13, color: '#8C5050', lineHeight: 1.6, marginBottom: 12 }}>
                  Your logs show high pain (7+/10) or bleeding for 2 or more consecutive days.
                  Consider sharing a report with your doctor.
                </p>
                <button
                  onClick={() => downloadReport(true)}
                  style={{
                    width: '100%', padding: '13px',
                    background: 'linear-gradient(135deg, #E85A5A, #F48585)',
                    border: 'none', borderRadius: 14, color: '#fff',
                    fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  <AlertTriangle size={16} /> Generate Emergency Doctor Summary
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Score Summary */}
          <div style={{ margin: '0 16px 16px', background: header, borderRadius: 20, padding: '16px', border: `1px solid ${border}` }}>
            <p style={{ fontSize: 13, color: muted }}>{tab} average score</p>
            <p style={{ fontSize: 42, fontWeight: 800, fontFamily: 'Nunito', color: p }}>{avgScore}</p>
            <p style={{ fontSize: 13, color: muted }}>
              {avgScore >= 70 ? "You're doing great! Keep it up." : avgScore >= 40 ? 'Making progress — every day counts.' : 'Keep going, healing takes time.'}
            </p>
            {bloodFreeDays > 0 && (
              <div style={{ marginTop: 10, background: theme?.wellnessHigh ? theme.wellnessHigh + '20' : '#F0FFF5', borderRadius: 12, padding: '8px 12px' }}>
                <p style={{ fontSize: 13, color: theme?.wellnessHigh || '#5A9E5A', fontWeight: 600 }}>
                  {bloodFreeCapped ? '90+ days' : `${bloodFreeDays} ${bloodFreeDays === 1 ? 'day' : 'days'}`} without bleeding!{' '}
                  {bloodFreeDays >= 30 ? '🎉 Incredible healing!' : bloodFreeDays >= 7 ? 'Great progress!' : 'Keep it going!'}
                </p>
              </div>
            )}
          </div>

          {/* Pain Chart */}
          <ChartCard theme={theme} title="Pain Levels" subtitle={`Your discomfort score over the last ${tab.toLowerCase()}`}>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={painData}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: muted }} interval="preserveStartEnd" />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: muted }} width={20} />
                <Tooltip formatter={v => [`${v}/10`, 'Pain']} />
                <Line type="monotone" dataKey="pain" stroke={p} strokeWidth={2.5}
                  dot={{ fill: p, r: 3 }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
            <p style={{ fontSize: 12, color: muted, marginTop: 8 }}>
              {painData.length >= 2 && painData[painData.length - 1].pain < painData[0].pain
                ? 'Trending down — great progress!'
                : painData.length >= 2 && painData[painData.length - 1].pain > painData[0].pain
                ? 'Pain seems elevated. Consider calling your doctor if it continues.'
                : 'Keep logging to see trends.'}
            </p>
          </ChartCard>

          {/* Blood Incidents */}
          <ChartCard theme={theme} title="Bleeding Incidents" subtitle="Days with vs. without bleeding">
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={bloodData}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: muted }} interval="preserveStartEnd" />
                <YAxis domain={[0, 1]} tick={{ fontSize: 10 }} width={15} hide />
                <Tooltip formatter={v => [v ? 'Yes' : 'None', 'Bleeding']} />
                <Bar dataKey="blood" fill="#F48585" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p style={{ fontSize: 12, color: muted, marginTop: 8 }}>
              {bloodFreeDays > 0
                ? bloodFreeCapped
                  ? 'No bleeding recorded in the last 90 days! 🌟'
                  : `Last bleeding: ${bloodFreeDays} day${bloodFreeDays !== 1 ? 's' : ''} ago`
                : 'Log daily to track bleeding patterns.'}
            </p>
          </ChartCard>

          {/* Hydration vs Bristol */}
          <ChartCard theme={theme} title="Water Intake & Stool Quality" subtitle="How hydration affects consistency">
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={waterData}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: muted }} interval="preserveStartEnd" />
                <YAxis yAxisId="water" orientation="left" domain={[0, 8]} tick={{ fontSize: 10, fill: muted }} width={20} />
                <YAxis yAxisId="bristol" orientation="right" domain={[1, 7]} tick={{ fontSize: 10, fill: muted }} width={20} />
                <Tooltip />
                <Line yAxisId="water" type="monotone" dataKey="water" stroke="#A8D5A2" strokeWidth={2} name="Water (glasses)" dot={false} connectNulls />
                <Line yAxisId="bristol" type="monotone" dataKey="bristol" stroke="#C9A8F5" strokeWidth={2} name="Bristol type" dot={false} connectNulls />
              </LineChart>
            </ResponsiveContainer>
            <p style={{ fontSize: 12, color: muted, marginTop: 4 }}>
              <span style={{ color: '#A8D5A2' }}>— Water</span> &nbsp; <span style={{ color: '#C9A8F5' }}>— Stool type</span>
            </p>
          </ChartCard>

          {/* Bristol Distribution */}
          {bristolData.length > 0 && (
            <ChartCard theme={theme} title="Stool Type Distribution" subtitle="Your most common type — aim for Type 4">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={bristolData} cx="50%" cy="50%" outerRadius={60} dataKey="value"
                    label={({ name, percent }) => `${name} (${Math.round(percent * 100)}%)`} labelLine={false}>
                    {bristolData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          {/* Wellness Score Trend */}
          <ChartCard theme={theme} title="Wellness Score Trend" subtitle="Your daily score over time">
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={scoreData}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: muted }} interval="preserveStartEnd" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: muted }} width={25} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke={theme?.wellnessHigh || '#A8D5A2'} strokeWidth={2.5} dot={{ fill: theme?.wellnessHigh || '#A8D5A2', r: 3 }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Symptom Calendar */}
          <CalendarHeatmap logs={logs} theme={theme} />

          {/* Food Outcome Correlations */}
          <FoodCorrelationSection logs={logs} theme={theme} />

          {/* Doctor's Report */}
          <div style={{ padding: '0 16px 32px' }}>
            <button
              onClick={() => downloadReport(false)}
              style={{
                width: '100%', padding: '16px',
                background: theme?.ctaGradient || 'linear-gradient(135deg, #C9A8F5, #B08AE8)',
                border: 'none', borderRadius: 20, color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', boxShadow: `0 4px 16px ${theme?.ctaShadow || 'rgba(201,168,245,0.35)'}`,
              }}
            >
              Generate Doctor's Report (14 days)
            </button>
          </div>
        </>
      )}
    </div>
  )
}
