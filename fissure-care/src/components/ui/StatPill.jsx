export default function StatPill({ label, value, color = 'var(--color-indigo)' }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      background: `${color}12`,
      borderRadius: 'var(--radius-md)',
      padding: '12px 16px', minWidth: 72,
    }}>
      <span style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4, textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
    </div>
  )
}
