import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { haptic } from '../../lib/haptics'

export default function CareTask({ icon, title, subtitle, done, onToggle }) {
  const handleClick = () => {
    if (onToggle) { haptic.tap(); onToggle() }
  }

  return (
    <motion.div
      onClick={handleClick}
      whileTap={{ scale: 0.97 }}
      animate={{
        background: done ? 'var(--color-surface-teal)' : 'var(--color-surface-solid)',
      }}
      transition={{ duration: 0.2 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 13,
        padding: '14px 15px',
        borderRadius: 'var(--radius-md)',
        border: `1.5px solid ${done ? 'var(--color-primary-muted)' : 'var(--color-border)'}`,
        cursor: onToggle ? 'pointer' : 'default',
        transition: 'border-color 0.2s',
      }}
    >
      {/* Icon bubble */}
      <motion.div
        animate={done ? { scale: [1, 1.38, 1] } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 420, damping: 12 }}
        style={{
          width: 40, height: 40, borderRadius: 13, flexShrink: 0,
          background: done ? 'var(--color-primary)' : 'var(--color-primary-muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: done ? '#fff' : 'var(--color-primary)',
        }}
      >
        <AnimatePresence mode="wait">
          {done ? (
            <motion.span key="check" initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 22 }}>
              <Check size={16} strokeWidth={2.5} />
            </motion.span>
          ) : (
            <motion.span key="icon" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              {icon}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <motion.p
          animate={{ color: done ? 'var(--color-text-muted)' : 'var(--color-text-primary)' }}
          style={{ fontSize: 14, fontWeight: 600, margin: 0, textDecoration: done ? 'line-through' : 'none' }}
        >
          {title}
        </motion.p>
        {subtitle && <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{subtitle}</p>}
      </div>

      {/* Circle checkbox */}
      <motion.div
        animate={{
          background: done ? 'var(--color-primary)' : 'transparent',
          borderColor: done ? 'var(--color-primary)' : 'var(--color-border-strong)',
        }}
        style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <AnimatePresence>
          {done && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Check size={11} color="#fff" strokeWidth={3} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
