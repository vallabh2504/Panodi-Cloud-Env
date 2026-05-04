import { useState, useEffect } from 'react'
import { getAllLogs } from '../lib/storage'
import { TrendingDown, Droplet, CheckSquare, Brain, Download, BarChart2 } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer,
  Tooltip, CartesianGrid, BarChart, Bar, Cell
} from 'recharts'
import SegmentedControl from '../components/ui/SegmentedControl'
import MetricCard from '../components/ui/MetricCard'
import InsightCard from '../components/ui/InsightCard'
import PageHeader from '../components/layout/PageHeader'

const RANGE_OPTS = [{ value: 30, label: '30 Days' }, { value: 60, label: '60 Days' }, { value: 90, label: '90 Days' }]

const CUSTOM_TOOLTIP = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--color-surface)', border: '1px solid var(--color-border)',
      borderRadius: 10, padding: '8px 12px', fontSize: 12, fontFamily: 'var(--font-main)',
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

export default function InsightsScreen() {
  const [range, setRange] = useState(30)
  const [logs, setLogs] = useState([])
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    getAllLogs().then(all => {
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - range)
      const filtered = all.filter(l => l.date && new Date(l.date) >= cutoff)
      setLogs(filtered)
      const days = []
      for (let i = range - 1; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i)
        const dateStr = d.toISOString().split('T')[0]
        const log = all.find(l => l.date === dateStr)
        const pain = log?.bowelMovements?.[0]?.painLevel ?? log?.dailySymptoms?.restingPain ?? null
        const bleeding = log?.bowelMovements?.some(b => b.bloodPresent) ? 1 : log ? 0 : null
        const water = log?.hydration?.waterGlasses ?? null
        days.push({
          label: new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          pain, bleeding, water,
        })
      }
      setChartData(days)
    })
  }, [range])

  if (!logs.length) {
    return (
      <div style={{ paddingBottom: 100 }}>
        <PageHeader title="Insights" subtitle="Your recovery at a glance" />
        <div style={{ padding: '0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <SegmentedControl options={RANGE_OPTS} value={range} onChange={setRange} />
          </div>
          <div style={{
            background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
            padding: '48px 24px', textAlign: 'center',
            border: '1px solid var(--color-border)',
          }}>
            <BarChart2 size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 8 }}>No logs yet</p>
            <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              Start logging your daily symptoms to see meaningful insights here.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const pains = logs.map(l => l.bowelMovements?.[0]?.painLevel ?? l.dailySymptoms?.restingPain).filter(v => v != null)
  const avgPain = pains.length ? (pains.reduce((a, b) => a + b, 0) / pains.length).toFixed(1) : null
  const firstHalf = pains.slice(0, Math.floor(pains.length / 2))
  const secondHalf = pains.slice(Math.floor(pains.length / 2))
  const firstAvg = firstHalf.length ? firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length : null
  const secondAvg = secondHalf.length ? secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length : null
  const painImproved = firstAvg && secondAvg ? Math.round(((firstAvg - secondAvg) / firstAvg) * 100) : null
  const bleedingDays = logs.filter(l => l.bowelMovements?.some(b => b.bloodPresent)).length
  const completedDays = logs.filter(l => (l.hydration?.waterGlasses || 0) >= 6 || (l.sitzBaths?.length || 0) > 0).length
  const routineRate = logs.length ? Math.round((completedDays / logs.length) * 100) : 0
  const hardStoolWithHighPain = logs.filter(l => { const bm = l.bowelMovements?.[0]; return bm?.bristolType && bm.bristolType <= 2 && bm.painLevel >= 5 }).length
  const patternDetected = hardStoolWithHighPain >= 2

  const exportSummary = () => {
    const lines = [
      'CareNest — Doctor Summary Report',
      `Generated: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`,
      `Period: Last ${range} days (${logs.length} days logged)`,
      '', '--- SYMPTOM SUMMARY ---',
      `Average pain level: ${avgPain ?? 'N/A'} / 10`,
      `Pain trend: ${painImproved != null ? (painImproved > 0 ? `Improved ${painImproved}%` : `Worsened ${Math.abs(painImproved)}%`) : 'Not enough data'}`,
      `Days with bleeding: ${bleedingDays}`,
      `Routine completion: ${routineRate}%`,
      '', '--- NOTES ---',
      ...logs.filter(l => l.selfCare?.notes).map(l => `${l.date}: ${l.selfCare.notes}`),
      '', 'Not a substitute for professional medical advice.',
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `carenest-summary-${new Date().toISOString().split('T')[0]}.txt`
    a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div style={{ paddingBottom: 100 }}>
      <PageHeader title="Insights" subtitle="Your recovery at a glance" />
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SegmentedControl options={RANGE_OPTS} value={range} onChange={setRange} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <MetricCard label="Avg Pain" value={avgPain ?? '–'} unit="/10"
            change={painImproved != null ? (painImproved > 0 ? `↓ ${painImproved}% improved` : `↑ ${Math.abs(painImproved)}% higher`) : null}
            icon={<TrendingDown size={16} />}
            accent={painImproved > 0 ? 'var(--color-success)' : 'var(--color-indigo)'} />
          <MetricCard label="Bleeding" value={bleedingDays} unit="days"
            change={bleedingDays === 0 ? 'Blood-free period' : `In ${logs.length} days`}
            icon={<Droplet size={16} />}
            accent={bleedingDays === 0 ? 'var(--color-success)' : 'var(--color-danger)'} />
          <MetricCard label="Routine" value={`${routineRate}%`}
            change={`${completedDays} / ${logs.length} days`}
            icon={<CheckSquare size={16} />} accent="var(--color-lavender)"
            style={{ gridColumn: '1 / -1' }} />
        </div>

        {chartData.some(d => d.pain !== null) && (
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '18px 16px 14px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 16 }}>Pain trend</p>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--color-text-muted)', fontFamily: 'var(--font-main)' }}
                  interval="preserveStartEnd" tickLine={false} axisLine={false} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: 'var(--color-text-muted)', fontFamily: 'var(--font-main)' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CUSTOM_TOOLTIP />} />
                <Line type="monotone" name="Pain" dataKey="pain" stroke="var(--color-indigo)" strokeWidth={2.5}
                  dot={{ fill: 'var(--color-indigo)', r: 3, strokeWidth: 0 }} connectNulls activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {chartData.some(d => d.bleeding !== null) && (
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '18px 16px 14px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 16 }}>Bleeding incidents</p>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--color-text-muted)', fontFamily: 'var(--font-main)' }}
                  interval="preserveStartEnd" tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip content={<CUSTOM_TOOLTIP />} />
                <Bar name="Bleeding" dataKey="bleeding" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => <Cell key={i} fill={chartData[i].bleeding ? 'var(--color-danger)' : 'var(--color-surface-soft)'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {patternDetected && (
          <InsightCard icon={<Brain size={20} />} title="Pattern detected"
            description="Higher pain logged on days with hard stool. Try increasing fibre and water intake."
            accent="var(--color-lavender)" />
        )}

        <div style={{ background: 'var(--gradient-soft)', borderRadius: 'var(--radius-lg)', padding: '18px', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>Doctor summary</p>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
            Download a plain-text summary of your symptoms to share at your next appointment.
          </p>
          <button onClick={exportSummary} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '11px 18px',
            background: 'var(--color-surface)', border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-md)', color: 'var(--color-indigo)', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'var(--font-main)', boxShadow: 'var(--shadow-sm)',
          }}>
            <Download size={16} /> Export summary
          </button>
        </div>

        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
          Insights are based on your logs. Not a substitute for medical advice.
        </p>
      </div>
    </div>
  )
}
