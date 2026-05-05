import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { getAllLogs } from '../lib/storage'
import { TrendingDown, Droplet, CheckSquare, Brain, Download, BarChart2 } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer,
  Tooltip, CartesianGrid, BarChart, Bar, Cell,
} from 'recharts'
import SegmentedControl from '../components/ui/SegmentedControl'
import MetricCard from '../components/ui/MetricCard'
import InsightCard from '../components/ui/InsightCard'
import PageHeader from '../components/layout/PageHeader'
import FadeUp from '../components/animations/FadeUp'

const RANGE_OPTS = [
  { value: 30, label: '30d' },
  { value: 60, label: '60d' },
  { value: 90, label: '90d' },
]

/* ─── Lazy chart wrapper ─── */
function LazyChart({ children }) {
  const ref = useRef()
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.15 },
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return <div ref={ref} style={{ minHeight: 80 }}>{visible && children}</div>
}

/* ─── Custom recharts tooltip ─── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--color-surface-solid)',
      border: '1px solid var(--color-border)',
      borderRadius: 10,
      padding: '8px 12px',
      fontSize: 12,
      fontFamily: 'var(--font-main)',
      boxShadow: 'var(--shadow-md)',
    }}>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 2 }}>{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {p.value !== null ? p.value : '–'}
        </p>
      ))}
    </div>
  )
}

/* ─── Calendar Heatmap ─── */
const PAIN_COLOR = pain => {
  if (pain == null) return 'rgba(44,49,64,0.06)'
  if (pain <= 2) return '#4A9E6E'
  if (pain <= 5) return '#C4845A'
  return '#B85450'
}

function CalendarHeatmap({ allLogs }) {
  const [tooltip, setTooltip] = useState(null)

  // Build 12 weeks × 7 days grid
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const totalDays = 84 // 12 * 7
  const startDay = new Date(today)
  startDay.setDate(today.getDate() - (totalDays - 1))

  // Map log data by date string
  const logMap = {}
  allLogs.forEach(l => {
    if (l.date) {
      const pain = l.bowelMovements?.[0]?.painLevel ?? l.dailySymptoms?.restingPain ?? null
      logMap[l.date] = pain
    }
  })

  // Build days array
  const days = []
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(startDay)
    d.setDate(startDay.getDate() + i)
    const dateStr = d.toISOString().split('T')[0]
    const pain = logMap[dateStr] ?? null
    const isFuture = d > today
    days.push({ date: d, dateStr, pain, isFuture })
  }

  // Month labels: find first day of each month in the range
  const monthLabels = []
  let lastMonth = -1
  days.forEach((day, i) => {
    const col = Math.floor(i / 7) // column index (week)
    const m = day.date.getMonth()
    if (m !== lastMonth) {
      monthLabels.push({
        col,
        label: day.date.toLocaleDateString('en-US', { month: 'short' }),
      })
      lastMonth = m
    }
  })

  const cellSize = 10
  const gap = 3
  const cols = 12
  const rows = 7
  const gridW = cols * (cellSize + gap) - gap
  const gridH = rows * (cellSize + gap) - gap

  return (
    <div style={{ position: 'relative', paddingBottom: 8 }}>
      {/* Month labels */}
      <div style={{ display: 'flex', marginBottom: 6, paddingLeft: 2, height: 16, position: 'relative' }}>
        {monthLabels.map(({ col, label }) => (
          <span
            key={label + col}
            style={{
              position: 'absolute',
              left: col * (cellSize + gap),
              fontSize: 10,
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-main)',
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          gap,
          width: gridW,
        }}
      >
        {days.map(({ date, dateStr, pain, isFuture }, i) => {
          const col = Math.floor(i / 7)
          const row = i % 7
          return (
            <div
              key={dateStr}
              onMouseEnter={e => setTooltip({ dateStr, pain, x: e.clientX, y: e.clientY })}
              onMouseLeave={() => setTooltip(null)}
              onTouchStart={e => {
                const t = e.touches[0]
                setTooltip({ dateStr, pain, x: t.clientX, y: t.clientY })
              }}
              onTouchEnd={() => setTimeout(() => setTooltip(null), 1400)}
              style={{
                width: cellSize,
                height: cellSize,
                borderRadius: 2,
                background: isFuture ? 'transparent' : PAIN_COLOR(pain),
                opacity: isFuture ? 0 : 1,
                cursor: 'default',
                transition: 'transform 0.12s',
                gridColumn: col + 1,
                gridRow: row + 1,
              }}
            />
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
        {[
          { color: 'rgba(44,49,64,0.06)', label: 'No data' },
          { color: '#4A9E6E', label: 'Low (0–2)' },
          { color: '#C4845A', label: 'Mild (3–5)' },
          { color: '#B85450', label: 'High (6–10)' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: color, border: '1px solid rgba(44,49,64,0.08)' }} />
            <span style={{ fontSize: 10, color: 'var(--color-text-muted)', fontFamily: 'var(--font-main)' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Hover tooltip */}
      {tooltip && (
        <div style={{
          position: 'fixed',
          left: tooltip.x + 8,
          top: tooltip.y - 36,
          background: 'var(--color-surface-solid)',
          border: '1px solid var(--color-border)',
          borderRadius: 8,
          padding: '5px 10px',
          fontSize: 11,
          fontFamily: 'var(--font-main)',
          boxShadow: 'var(--shadow-md)',
          zIndex: 9999,
          pointerEvents: 'none',
        }}>
          <span style={{ color: 'var(--color-text-muted)', marginRight: 6 }}>{tooltip.dateStr}</span>
          <span style={{ color: tooltip.pain != null ? PAIN_COLOR(tooltip.pain) : 'var(--color-text-muted)', fontWeight: 600 }}>
            {tooltip.pain != null ? `Pain: ${tooltip.pain}/10` : 'No data'}
          </span>
        </div>
      )}
    </div>
  )
}

/* ─── Main Screen ─── */
export default function InsightsScreen() {
  const [range, setRange] = useState(30)
  const [logs, setLogs] = useState([])
  const [chartData, setChartData] = useState([])
  const [allLogs, setAllLogs] = useState([])

  useEffect(() => {
    getAllLogs().then(all => {
      setAllLogs(all)
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - range)
      const filtered = all.filter(l => l.date && new Date(l.date) >= cutoff)
      setLogs(filtered)

      const days = []
      for (let i = range - 1; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const dateStr = d.toISOString().split('T')[0]
        const log = all.find(l => l.date === dateStr)
        const pain = log?.bowelMovements?.[0]?.painLevel ?? log?.dailySymptoms?.restingPain ?? null
        const bleeding = log?.bowelMovements?.some(b => b.bloodPresent) ? 1 : log ? 0 : null
        const water = log?.hydration?.waterGlasses ?? null
        days.push({
          label: new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          pain,
          bleeding,
          water,
        })
      }
      setChartData(days)
    })
  }, [range])

  /* ─── Empty state ─── */
  if (!logs.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        style={{ paddingBottom: 100, position: 'relative' }}
      >
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden', opacity: 0.35 }}>
          <div className="particle particle-2 particle--page" />
          <div className="particle particle-5 particle--page" />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
        <PageHeader title="Insights" subtitle="Your recovery at a glance" gradient />
        <div style={{ padding: '0 16px' }}>
          <FadeUp delay={0.05}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <SegmentedControl options={RANGE_OPTS} value={range} onChange={setRange} />
            </div>
          </FadeUp>
          <FadeUp delay={0.12}>
            <div style={{
              background: 'rgba(255,255,255,0.72)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: 'var(--radius-lg)',
              padding: '52px 24px',
              textAlign: 'center',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <BarChart2 size={52} color="var(--color-text-muted)" style={{ margin: '0 auto 18px' }} />
              <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 8 }}>No logs yet</p>
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.6, maxWidth: 260, margin: '0 auto' }}>
                Start logging your daily symptoms to unlock meaningful insights and trends.
              </p>
            </div>
          </FadeUp>
        </div>
        </div>
      </motion.div>
    )
  }

  /* ─── Stats computation ─── */
  const pains = logs
    .map(l => l.bowelMovements?.[0]?.painLevel ?? l.dailySymptoms?.restingPain)
    .filter(v => v != null)
  const avgPain = pains.length
    ? (pains.reduce((a, b) => a + b, 0) / pains.length).toFixed(1)
    : null
  const firstHalf = pains.slice(0, Math.floor(pains.length / 2))
  const secondHalf = pains.slice(Math.floor(pains.length / 2))
  const firstAvg = firstHalf.length ? firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length : null
  const secondAvg = secondHalf.length ? secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length : null
  const painImproved = firstAvg && secondAvg
    ? Math.round(((firstAvg - secondAvg) / firstAvg) * 100)
    : null
  const bleedingDays = logs.filter(l => l.bowelMovements?.some(b => b.bloodPresent)).length
  const completedDays = logs.filter(
    l => (l.hydration?.waterGlasses || 0) >= 6 || (l.sitzBaths?.length || 0) > 0,
  ).length
  const routineRate = logs.length ? Math.round((completedDays / logs.length) * 100) : 0
  const hardStoolWithHighPain = logs.filter(l => {
    const bm = l.bowelMovements?.[0]
    return bm?.bristolType && bm.bristolType <= 2 && bm.painLevel >= 5
  }).length
  const patternDetected = hardStoolWithHighPain >= 2

  /* ─── Export ─── */
  const exportSummary = () => {
    const lines = [
      'CareNest — Doctor Summary Report',
      `Generated: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`,
      `Period: Last ${range} days (${logs.length} days logged)`,
      '',
      '--- SYMPTOM SUMMARY ---',
      `Average pain level: ${avgPain ?? 'N/A'} / 10`,
      `Pain trend: ${painImproved != null
        ? (painImproved > 0 ? `Improved ${painImproved}%` : `Worsened ${Math.abs(painImproved)}%`)
        : 'Not enough data'}`,
      `Days with bleeding: ${bleedingDays}`,
      `Routine completion: ${routineRate}%`,
      '',
      '--- NOTES ---',
      ...logs.filter(l => l.selfCare?.notes).map(l => `${l.date}: ${l.selfCare.notes}`),
      '',
      'Not a substitute for professional medical advice.',
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `carenest-summary-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const hasPainData = chartData.some(d => d.pain !== null)
  const hasBleedingData = chartData.some(d => d.bleeding !== null)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      style={{ paddingBottom: 100, position: 'relative' }}
    >
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden', opacity: 0.35 }}>
        <div className="particle particle-2 particle--page" />
        <div className="particle particle-5 particle--page" />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
      <PageHeader title="Insights" subtitle="Your recovery at a glance" gradient />

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Range control */}
        <FadeUp delay={0.04}>
          <SegmentedControl options={RANGE_OPTS} value={range} onChange={setRange} />
        </FadeUp>

        {/* Stats grid */}
        <FadeUp delay={0.08}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <MetricCard
              label="Avg Pain"
              value={avgPain ?? '–'}
              unit="/10"
              change={
                painImproved != null
                  ? painImproved > 0
                    ? `↓ ${painImproved}% improved`
                    : `↑ ${Math.abs(painImproved)}% higher`
                  : null
              }
              icon={<TrendingDown size={16} />}
              accent={painImproved != null && painImproved > 0 ? 'var(--color-success)' : 'var(--color-primary)'}
            />
            <MetricCard
              label="Bleeding"
              value={bleedingDays}
              unit="days"
              change={bleedingDays === 0 ? 'Blood-free period' : `In ${logs.length} days`}
              icon={<Droplet size={16} />}
              accent={bleedingDays === 0 ? 'var(--color-success)' : 'var(--color-danger)'}
            />
            <MetricCard
              label="Routine"
              value={`${routineRate}%`}
              change={`${completedDays} / ${logs.length} days`}
              icon={<CheckSquare size={16} />}
              accent="var(--color-primary)"
              style={{ gridColumn: '1 / -1' }}
            />
          </div>
        </FadeUp>

        {/* Pain trend chart */}
        {hasPainData && (
          <FadeUp delay={0.1}>
            <div style={{
              background: 'rgba(255,255,255,0.72)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px 16px 14px',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 16 }}>
                Pain trend
              </p>
              <LazyChart>
                <ResponsiveContainer width="100%" height={140}>
                  <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 10, fill: 'var(--color-text-muted)', fontFamily: 'var(--font-main)' }}
                      interval="preserveStartEnd"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      domain={[0, 10]}
                      tick={{ fontSize: 10, fill: 'var(--color-text-muted)', fontFamily: 'var(--font-main)' }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      name="Pain"
                      dataKey="pain"
                      stroke="var(--color-primary)"
                      strokeWidth={2.5}
                      dot={{ fill: 'var(--color-primary)', r: 3, strokeWidth: 0 }}
                      connectNulls
                      activeDot={{ r: 5, fill: 'var(--color-primary-light)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </LazyChart>
            </div>
          </FadeUp>
        )}

        {/* Bleeding chart */}
        {hasBleedingData && (
          <FadeUp delay={0.12}>
            <div style={{
              background: 'rgba(255,255,255,0.72)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px 16px 14px',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 16 }}>
                Bleeding incidents
              </p>
              <LazyChart>
                <ResponsiveContainer width="100%" height={100}>
                  <BarChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 10, fill: 'var(--color-text-muted)', fontFamily: 'var(--font-main)' }}
                      interval="preserveStartEnd"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar name="Bleeding" dataKey="bleeding" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={entry.bleeding ? 'var(--color-danger)' : 'var(--color-surface-soft)'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </LazyChart>
            </div>
          </FadeUp>
        )}

        {/* Calendar heatmap */}
        <FadeUp delay={0.14}>
          <div style={{
            background: 'rgba(255,255,255,0.72)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: 'var(--radius-lg)',
            padding: '18px 16px 16px',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 14 }}>
              12-week pain heatmap
            </p>
            <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
              <CalendarHeatmap allLogs={allLogs} />
            </div>
          </div>
        </FadeUp>

        {/* Pattern insight */}
        {patternDetected && (
          <FadeUp delay={0.16}>
            <InsightCard
              icon={<Brain size={20} />}
              title="Pattern detected"
              description="Higher pain logged on days with hard stool. Try increasing fibre and water intake."
              accent="var(--color-primary)"
            />
          </FadeUp>
        )}

        {/* Doctor summary export */}
        <FadeUp delay={0.18}>
          <div style={{
            background: 'var(--color-surface-teal)',
            borderRadius: 'var(--radius-lg)',
            padding: '18px',
            border: '1px solid var(--color-border)',
          }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>
              Doctor summary
            </p>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.55, marginBottom: 14 }}>
              Download a plain-text summary of your symptoms to share at your next appointment.
            </p>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={exportSummary}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '11px 18px',
                background: 'var(--color-primary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-main)',
                boxShadow: 'var(--shadow-teal)',
              }}
            >
              <Download size={16} />
              Export summary
            </motion.button>
          </div>
        </FadeUp>

        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
          Insights are based on your logs. Not a substitute for medical advice.
        </p>
      </div>
      </div>
    </motion.div>
  )
}
