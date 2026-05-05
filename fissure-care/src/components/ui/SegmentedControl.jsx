import { motion } from 'framer-motion'

export default function SegmentedControl({ options, value, onChange }) {
  return (
    <div style={{
      display: 'flex', background: 'var(--color-surface-soft)',
      borderRadius: 'var(--radius-sm)', padding: 3, gap: 2,
      position: 'relative',
    }}>
      {options.map(opt => {
        const selected = opt.value === value
        return (
          <motion.button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            whileTap={{ scale: 0.95 }}
            style={{
              flex: 1, padding: '9px 4px', borderRadius: 8, border: 'none',
              background: 'transparent', position: 'relative',
              color: selected ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: selected ? 600 : 500, fontSize: 13,
              cursor: 'pointer', fontFamily: 'var(--font-main)',
              zIndex: 1, whiteSpace: 'nowrap',
            }}
          >
            {selected && (
              <motion.div
                layoutId="seg-pill"
                style={{
                  position: 'absolute', inset: 0, borderRadius: 8,
                  background: 'var(--color-surface-solid)',
                  boxShadow: 'var(--shadow-sm)',
                  zIndex: -1,
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            {opt.label}
          </motion.button>
        )
      })}
    </div>
  )
}
