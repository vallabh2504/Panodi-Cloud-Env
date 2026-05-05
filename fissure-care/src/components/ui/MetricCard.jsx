import { motion } from 'framer-motion'

export default function MetricCard({ label, value, unit, change, icon, accent = 'var(--color-primary)', style: extra = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ type: 'spring', stiffness: 180, damping: 22 }}
      style={{
        background: 'var(--color-surface-solid)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--color-border)',
        ...extra,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        {icon && (
          <div style={{ width: 32, height: 32, borderRadius: 10, background: `color-mix(in srgb, ${accent} 14%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent }}>{icon}</div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{unit}</span>}
      </div>
      {change && <div style={{ marginTop: 6, fontSize: 12, color: accent, fontWeight: 500 }}>{change}</div>}
    </motion.div>
  )
}
