import { motion } from 'framer-motion'

export default function InsightCard({ icon, title, description, accent = 'var(--color-primary)', style: extra = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ type: 'spring', stiffness: 180, damping: 22 }}
      whileTap={{ scale: 0.98 }}
      style={{
        background: 'var(--color-surface-solid)',
        borderRadius: 'var(--radius-md)', padding: 16,
        boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)',
        display: 'flex', gap: 14, alignItems: 'flex-start',
        ...extra,
      }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 13, flexShrink: 0,
        background: `color-mix(in srgb, ${accent} 14%, transparent)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent,
      }}>{icon}</div>
      <div>
        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>{title}</p>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>{description}</p>
      </div>
    </motion.div>
  )
}
