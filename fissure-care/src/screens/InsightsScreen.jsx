import { useState, useEffect, useMemo, useRef } from 'react'
import { getAllLogs } from '../lib/storage'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { analyzeFoodOutcomes } from '../lib/correlations'

const TABS = ['Week', 'Month', '3 Months']

// ─── Native SVG Charts ────────────────────────────────────────────────────────

function AnimatedLineChart({ data, color, min = 0, max = 10, height = 120, fillOpacity = 0.18, showDots = true }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-20px' })
  const pathRef = useRef(null)
  const [length, setLength] = useState(1000)

  useEffect(() => {
    if (pathRef.current) setLength(pathRef.current.getTotalLength() || 1000)
  }, [data])

  if (!data.length) return null

  const W = 320, H = height, PAD = { t: 8, r: 8, b: 28, l: 28 }
  const iW = W - PAD.l - PAD.r
  const iH = H - PAD.t - PAD.b
  const range = max - min || 1

  const pts = data.map((d, i) => ({
    x: PAD.l + (i / Math.max(data.length - 1, 1)) * iW,
    y: PAD.t + iH - ((d.value - min) / range) * iH,
  }))

  // cubic bezier path
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1], cur = pts[i]
    const cpx = (prev.x + cur.x) / 2
    d += ` C ${cpx} ${prev.y} ${cpx} ${cur.y} ${cur.x} ${cur.y}`
  }
  const fillPath = d + ` L ${pts[pts.length - 1].x} ${PAD.t + iH} L ${pts[0].x} ${PAD.t + iH} Z`
  const gradId = `lg_${color.replace(/[^a-z0-9]/gi, '_')}`

  // y-axis labels (3 ticks)
  const yTicks = [min, Math.round((min + max) / 2), max]

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height, overflow: 'visible' }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={fillOpacity * 1.6} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* y-axis ticks */}
        {yTicks.map(v => {
          const y = PAD.t + iH - ((v - min) / range) * iH
          return (
            <g key={v}>
              <line x1={PAD.l - 4} y1={y} x2={PAD.l + iW} y2={y}
                stroke="currentColor" strokeOpacity={0.06} strokeWidth={1} />
              <text x={PAD.l - 6} y={y + 4} textAnchor="end" fontSize={9} fill="currentColor" opacity={0.4}>{v}</text>
            </g>
          )
        })}

        {/* x-axis labels */}
        {data.map((d, i) => {
          const every = data.length > 14 ? Math.ceil(data.length / 7) : 1
          if (i % every !== 0 && i !== data.length - 1) return null
          return (
            <text key={i} x={pts[i].x} y={H - 4} textAnchor="middle" fontSize={9}
              fill="currentColor" opacity={0.45}>{d.label}</text>
          )
        })}

        {/* fill */}
        <motion.path
          d={fillPath} fill={`url(#${gradId})`}
          initial={{ opacity: 0 }} animate={{ opacity: inView ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        />

        {/* line */}
        <path ref={pathRef} d={d} fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
        <motion.path
          d={d} fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round"
          strokeDasharray={length} strokeDashoffset={length}
          animate={{ strokeDashoffset: inView ? 0 : length }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />

        {/* dots */}
        {showDots && pts.map((p, i) => (
          <motion.circle key={i} cx={p.x} cy={p.y} r={3} fill={color}
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0 }}
            transition={{ delay: 1.0 + i * 0.06, duration: 0.2 }}
          />
        ))}
      </svg>
    </div>
  )
}

function AnimatedDualLineChart({ data, color1, color2, min1 = 0, max1 = 8, min2 = 1, max2 = 7, height = 130, label1, label2 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-20px' })
  const pathRef1 = useRef(null)
  const pathRef2 = useRef(null)
  const [len1, setLen1] = useState(1000)
  const [len2, setLen2] = useState(1000)

  useEffect(() => {
    if (pathRef1.current) setLen1(pathRef1.current.getTotalLength() || 1000)
    if (pathRef2.current) setLen2(pathRef2.current.getTotalLength() || 1000)
  }, [data])

  if (!data.length) return null

  const W = 320, H = height, PAD = { t: 8, r: 8, b: 28, l: 8 }
  const iW = W - PAD.l - PAD.r
  const iH = H - PAD.t - PAD.b

  const makePts = (key, min, max) => data.map((d, i) => ({
    x: PAD.l + (i / Math.max(data.length - 1, 1)) * iW,
    y: PAD.t + iH - ((d[key] - min) / (max - min || 1)) * iH,
  }))

  const makePath = (pts) => {
    let path = `M ${pts[0].x} ${pts[0].y}`
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1], cur = pts[i]
      const cpx = (prev.x + cur.x) / 2
      path += ` C ${cpx} ${prev.y} ${cpx} ${cur.y} ${cur.x} ${cur.y}`
    }
    return path
  }

  const pts1 = makePts('v1', min1, max1)
  const pts2 = makePts('v2', min2, max2)
  const d1 = makePath(pts1)
  const d2 = makePath(pts2)

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height, overflow: 'visible' }}>
        {/* x labels */}
        {data.map((d, i) => {
          const every = data.length > 14 ? Math.ceil(data.length / 7) : 1
          if (i % every !== 0 && i !== data.length - 1) return null
          return <text key={i} x={pts1[i].x} y={H - 4} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.45}>{d.label}</text>
        })}

        {/* ghost paths for length measurement */}
        <path ref={pathRef1} d={d1} fill="none" stroke="none" />
        <path ref={pathRef2} d={d2} fill="none" stroke="none" />

        {[{ d: d1, color: color1, len: len1 }, { d: d2, color: color2, len: len2 }].map(({ d, color, len }, idx) => (
          <motion.path key={idx} d={d} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"
            strokeDasharray={len} strokeDashoffset={len}
            animate={{ strokeDashoffset: inView ? 0 : len }}
            transition={{ duration: 1.2, ease: 'easeInOut', delay: idx * 0.2 }}
          />
        ))}
      </svg>
      <p style={{ fontSize: 11, color: 'currentColor', opacity: 0.55, marginTop: 2 }}>
        <span style={{ color: color1 }}>— {label1}</span>
        &nbsp;&nbsp;
        <span style={{ color: color2 }}>— {label2}</span>
      </p>
    </div>
  )
}

function AnimatedBarChart({ data, color, height = 90 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-20px' })
  if (!data.length) return null

  const W = 320, H = height, PAD = { t: 4, r: 8, b: 24, l: 8 }
  const iW = W - PAD.l - PAD.r
  const iH = H - PAD.t - PAD.b
  const barW = Math.max(4, (iW / data.length) * 0.6)
  const gap = iW / data.length
  const maxVal = Math.max(...data.map(d => d.value), 1)

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height, overflow: 'visible' }}>
        {data.map((d, i) => {
          const barH = (d.value / maxVal) * iH
          const x = PAD.l + gap * i + (gap - barW) / 2
          const y = PAD.t + iH - barH
          return (
            <g key={i}>
              <motion.rect
                x={x} y={PAD.t + iH} width={barW} height={0} rx={3} fill={color}
                animate={{ y: inView ? y : PAD.t + iH, height: inView ? barH : 0 }}
                transition={{ duration: 0.6, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              />
              {data.length <= 14 && (
                <text x={x + barW / 2} y={H - 4} textAnchor="middle" fontSize={9}
                  fill="currentColor" opacity={0.45}>{d.label}</text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function AnimatedDonutChart({ data, colors, size = 140 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-20px' })
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  const cx = size / 2, cy = size / 2, R = size * 0.36, r = size * 0.22

  let angle = -Math.PI / 2
  const arcs = data.map((d, i) => {
    const sweep = (d.value / total) * Math.PI * 2
    const x1 = cx + R * Math.cos(angle), y1 = cy + R * Math.sin(angle)
    angle += sweep
    const x2 = cx + R * Math.cos(angle), y2 = cy + R * Math.sin(angle)
    const ix1 = cx + r * Math.cos(angle - sweep), iy1 = cy + r * Math.sin(angle - sweep)
    const ix2 = cx + r * Math.cos(angle), iy2 = cy + r * Math.sin(angle)
    const large = sweep > Math.PI ? 1 : 0
    return {
      path: `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${r} ${r} 0 ${large} 0 ${ix1} ${iy1} Z`,
      color: colors[i % colors.length],
      pct: Math.round((d.value / total) * 100),
      name: d.name,
    }
  })

  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <svg width={size} height={size}>
        {arcs.map((arc, i) => (
          <motion.path key={i} d={arc.path} fill={arc.color}
            initial={{ opacity: 0, scale: 0.8 }} style={{ transformOrigin: `${cx}px ${cy}px` }}
            animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.8 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          />
        ))}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {arcs.map((arc, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: arc.color, flexShrink: 0 }} />
            <span style={{ fontSize: 11 }}>{arc.name} ({arc.pct}%)</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Other components ─────────────────────────────────────────────────────────

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
  const firstDayOfWeek = new Date(year, month, 1).getDay()

  const logMap = useMemo(() => {
    const map = {}
    for (const log of logs) { map[log.date] = log }
    return map
  }, [logs])

  const cells = []
  for (let i = 0; i < 35; i++) {
    const dayNum = i - firstDayOfWeek + 1
    if (dayNum < 1 || dayNum > daysInMonth) {
      cells.push({ dayNum: null, dateStr: null })
    } else {
      const mm = String(month + 1).padStart(2, '0')
      const dd = String(dayNum).padStart(2, '0')
      cells.push({ dayNum, dateStr: `${year}-${mm}-${dd}` })
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 36px)', gap: 4, marginBottom: 4 }}>
        {DAYS_OF_WEEK.map(d => (
          <div key={d} style={{ width: 36, textAlign: 'center', fontSize: 10, fontWeight: 600, color: muted }}>{d}</div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 36px)', gap: 4 }}>
        {cells.map((cell, idx) => {
          const color = getCellColor(cell.dateStr)
          const isSelected = selectedDay === cell.dateStr
          const hasData = cell.dateStr && logMap[cell.dateStr]
          return (
            <div key={idx}
              onClick={() => { if (!hasData) return; setSelectedDay(isSelected ? null : cell.dateStr) }}
              style={{
                width: 36, height: 36, borderRadius: 8, background: color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: hasData ? 'pointer' : 'default',
                border: isSelected ? `2px solid ${text}` : '2px solid transparent',
                boxSizing: 'border-box', opacity: cell.dayNum === null ? 0 : 1,
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

      {selectedDay && selectedLog && (
        <div style={{ marginTop: 10, background: border, borderRadius: 12, padding: '10px 14px' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: text, marginBottom: 2 }}>{selectedDay}</p>
          <p style={{ fontSize: 12, color: muted }}>
            Pain: {selectedPain !== null ? `${selectedPain}/10` : 'Not recorded'} &nbsp;&middot;&nbsp;
            Blood: {selectedBlood ? 'Yes' : 'No'}
          </p>
        </div>
      )}

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

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function InsightsScreen({ theme }) {
  const [tab, setTab] = useState('Week')
  const [logs, setLogs] = useState([])

  useEffect(() => { getAllLogs().then(setLogs) }, [])

  const days = tab === 'Week' ? 7 : tab === 'Month' ? 30 : 90
  const filtered = logs.slice(0, days).reverse()

  const isEmergency = useMemo(() => checkEmergencyCondition(logs), [logs])

  const painData = filtered.map(l => ({
    label: new Date(l.date).toLocaleDateString('en', { day: 'numeric', month: 'short' }),
    value: l.bowelMovements?.[0]?.painLevel ?? l.dailySymptoms?.restingPain ?? 0,
  }))

  const bloodData = filtered.map(l => ({
    label: new Date(l.date).toLocaleDateString('en', { day: 'numeric', month: 'short' }),
    value: l.bowelMovements?.some(bm => bm.bloodPresent) ? 1 : 0,
  }))

  const waterBristolData = filtered.map(l => ({
    label: new Date(l.date).toLocaleDateString('en', { day: 'numeric', month: 'short' }),
    v1: l.hydration?.waterGlasses || 0,
    v2: l.bowelMovements?.[0]?.bristolType || 0,
  }))

  const scoreData = filtered.map(l => ({
    label: new Date(l.date).toLocaleDateString('en', { day: 'numeric', month: 'short' }),
    value: l.wellnessScore || 0,
  }))

  const bristolCounts = {}
  filtered.forEach(l => l.bowelMovements?.forEach(bm => {
    if (bm.bristolType) bristolCounts[bm.bristolType] = (bristolCounts[bm.bristolType] || 0) + 1
  }))
  const bristolData = Object.entries(bristolCounts).map(([type, count]) => ({ name: `Type ${type}`, value: count }))
  const DONUT_COLORS = ['#F48585', '#F5A68A', '#F5C67A', '#A8D5A2', '#C9A8F5', '#60A0F0', '#F48585']

  let bloodFreeDays = 0
  for (const l of logs.slice(0, 90)) {
    if (l.bowelMovements?.some(bm => bm.bloodPresent)) break
    bloodFreeDays++
  }
  const bloodFreeCapped = bloodFreeDays >= 90

  const avgScore = scoreData.length ? Math.round(scoreData.reduce((s, d) => s + d.value, 0) / scoreData.length) : 0

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
    <div style={{ color: text }}>
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
          <div style={{ margin: '0 16px 16px', background: card, borderRadius: 20, padding: '16px', border: `1px solid ${border}` }}>
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
            <AnimatedLineChart data={painData} color={p} min={0} max={10} height={130} />
            <p style={{ fontSize: 12, color: muted, marginTop: 8 }}>
              {painData.length >= 2 && painData[painData.length - 1].value < painData[0].value
                ? 'Trending down — great progress!'
                : painData.length >= 2 && painData[painData.length - 1].value > painData[0].value
                ? 'Pain seems elevated. Consider calling your doctor if it continues.'
                : 'Keep logging to see trends.'}
            </p>
          </ChartCard>

          {/* Blood Incidents */}
          <ChartCard theme={theme} title="Bleeding Incidents" subtitle="Days with vs. without bleeding">
            <AnimatedBarChart data={bloodData} color="#F48585" height={90} />
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
            <AnimatedDualLineChart
              data={waterBristolData} color1="#A8D5A2" color2="#C9A8F5"
              min1={0} max1={8} min2={1} max2={7} height={130}
              label1="Water (glasses)" label2="Stool type"
            />
          </ChartCard>

          {/* Bristol Distribution */}
          {bristolData.length > 0 && (
            <ChartCard theme={theme} title="Stool Type Distribution" subtitle="Your most common type — aim for Type 4">
              <AnimatedDonutChart data={bristolData} colors={DONUT_COLORS} size={130} />
            </ChartCard>
          )}

          {/* Wellness Score Trend */}
          <ChartCard theme={theme} title="Wellness Score Trend" subtitle="Your daily score over time">
            <AnimatedLineChart
              data={scoreData} color={theme?.wellnessHigh || '#A8D5A2'}
              min={0} max={100} height={120}
            />
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
