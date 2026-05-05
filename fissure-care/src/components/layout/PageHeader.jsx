import { motion } from 'framer-motion'

export default function PageHeader({ title, subtitle, action, gradient }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.04 }}
      style={{ padding: '22px 20px 12px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}
    >
      <div>
        <h2 style={{
          fontSize: 24, fontWeight: 800,
          color: gradient ? 'transparent' : 'var(--color-text-primary)',
          background: gradient ? 'var(--gradient-primary)' : undefined,
          WebkitBackgroundClip: gradient ? 'text' : undefined,
          WebkitTextFillColor: gradient ? 'transparent' : undefined,
          backgroundClip: gradient ? 'text' : undefined,
          margin: 0, letterSpacing: '-0.3px',
        }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 3 }}>{subtitle}</p>
        )}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 26, delay: 0.2 }}
          style={{ height: 2, width: 32, background: 'var(--gradient-primary)', borderRadius: 1, marginTop: 8, transformOrigin: 'left' }}
        />
      </div>
      {action && <div style={{ marginTop: 4 }}>{action}</div>}
    </motion.div>
  )
}
