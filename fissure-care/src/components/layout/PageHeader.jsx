import { motion } from 'framer-motion'

export default function PageHeader({ title, subtitle, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.05 }}
      style={{
        padding: '20px 20px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}
    >
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0, letterSpacing: '-0.2px' }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 3 }}>{subtitle}</p>}
      </div>
      {action && action}
    </motion.div>
  )
}
