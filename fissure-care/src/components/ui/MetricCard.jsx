export default function MetricCard({ label, value, unit, change, icon, accent = 'var(--color-indigo)', style: extra = {} }) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-md)',
      padding: '16px',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--color-border)',
      ...extra,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        {icon && (
          <div style={{ width: 32, height: 32, borderRadius: 10, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent }}>{icon}</div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontSize: 26, fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{unit}</span>}
      </div>
      {change && <div style={{ marginTop: 6, fontSize: 12, color: accent, fontWeight: 500 }}>{change}</div>}
    </div>
  )
}
