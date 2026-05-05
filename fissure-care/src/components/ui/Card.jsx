import { motion } from 'framer-motion'

export default function Card({ children, style: extra = {}, padding = '20px', onClick, variant = 'default', animate = false }) {
  const variants = {
    default: {
      background: 'var(--color-surface-solid)',
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-sm)',
    },
    glass: {
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: 'var(--glass-border)',
      boxShadow: 'var(--shadow-glass)',
    },
    teal: {
      background: 'var(--gradient-primary)',
      border: 'none',
      boxShadow: 'var(--shadow-teal)',
    },
  }

  const base = {
    borderRadius: 'var(--radius-lg)',
    padding,
    cursor: onClick ? 'pointer' : 'default',
    ...variants[variant],
    ...extra,
  }

  if (onClick || animate) {
    return (
      <motion.div
        onClick={onClick}
        whileTap={onClick ? { scale: 0.98 } : undefined}
        whileHover={onClick ? { y: -2, boxShadow: 'var(--shadow-md)' } : undefined}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        style={base}
      >
        {children}
      </motion.div>
    )
  }

  return <div style={base}>{children}</div>
}
