import { Check } from 'lucide-react'

export default function CareTask({ icon, title, subtitle, time, done, onToggle }) {
  return (
    <div onClick={onToggle} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '13px 14px',
      borderRadius: 'var(--radius-md)',
      background: done ? 'var(--color-surface-soft)' : 'var(--color-surface)',
      border: `1.5px solid ${done ? 'var(--color-border)' : 'var(--color-border)'}`,
      cursor: onToggle ? 'pointer' : 'default',
      transition: 'all 0.18s ease',
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 12, flexShrink: 0,
        background: done ? 'var(--color-border)' : 'var(--color-surface-lavender)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: done ? 'var(--color-text-muted)' : 'var(--color-lavender)',
        transition: 'all 0.18s ease',
      }}>
        {done ? <Check size={17} /> : icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 14, fontWeight: 600, margin: 0,
          color: done ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
          textDecoration: done ? 'line-through' : 'none',
          transition: 'all 0.18s ease',
        }}>{title}</p>
        {subtitle && (
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 1 }}>{subtitle}</p>
        )}
      </div>
      {time && <span style={{ fontSize: 11, color: 'var(--color-text-muted)', flexShrink: 0 }}>{time}</span>}
      <div style={{
        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
        border: `2px solid ${done ? 'var(--color-indigo)' : 'var(--color-border-strong)'}`,
        background: done ? 'var(--color-indigo)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.18s ease',
      }}>
        {done && <Check size={11} color="#fff" strokeWidth={3} />}
      </div>
    </div>
  )
}
