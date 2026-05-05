import { motion } from 'framer-motion'

export default function Button({
  children, variant = 'primary', size = 'md',
  onClick, disabled, fullWidth, icon, style: extra = {}
}) {
  const sizes = {
    sm: { padding: '8px 16px',  fontSize: 13, borderRadius: 'var(--radius-sm)' },
    md: { padding: '14px 24px', fontSize: 15, borderRadius: 'var(--radius-md)' },
    lg: { padding: '18px 32px', fontSize: 16, borderRadius: 'var(--radius-md)' },
  }
  const variants = {
    primary:   { background: 'var(--gradient-primary)', color: '#fff', boxShadow: 'var(--shadow-teal)', border: 'none' },
    secondary: { background: 'var(--color-surface-solid)', color: 'var(--color-primary)', border: '1.5px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' },
    ghost:     { background: 'transparent', color: 'var(--color-text-secondary)', border: 'none' },
    danger:    { background: 'var(--color-danger-soft)', color: 'var(--color-danger)', border: '1px solid rgba(184,84,80,0.2)' },
  }
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      transition={{ type: 'spring', stiffness: 420, damping: 18 }}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontFamily: 'var(--font-main)', fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: fullWidth ? '100%' : 'auto',
        opacity: disabled ? 0.6 : 1,
        ...sizes[size], ...variants[variant], ...extra,
      }}
    >
      {icon && icon}
      {children}
    </motion.button>
  )
}
