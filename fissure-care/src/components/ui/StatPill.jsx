import { motion } from 'framer-motion'

export default function StatPill({ label, value, color = 'var(--color-primary)' }) {
  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        background: `color-mix(in srgb, ${color} 10%, transparent)`,
        borderRadius: 'var(--radius-md)', padding: '13px 16px', minWidth: 78,
        border: `1px solid color-mix(in srgb, ${color} 18%, transparent)`,
      }}
    >
      <span style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1, fontFamily: 'var(--font-main)' }}>{value}</span>
      <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 5, textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
    </motion.div>
  )
}
