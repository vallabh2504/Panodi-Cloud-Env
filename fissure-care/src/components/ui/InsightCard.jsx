export default function InsightCard({ icon, title, description, accent = 'var(--color-indigo)', style: extra = {} }) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-md)',
      padding: '16px',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--color-border)',
      display: 'flex', gap: 14, alignItems: 'flex-start',
      ...extra,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12, flexShrink: 0,
        background: `${accent}15`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: accent,
      }}>{icon}</div>
      <div>
        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>{title}</p>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>{description}</p>
      </div>
    </div>
  )
}
