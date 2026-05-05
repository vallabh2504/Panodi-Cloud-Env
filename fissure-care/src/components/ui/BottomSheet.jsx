import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function BottomSheet({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(26, 74, 66, 0.45)',
              zIndex: 100,
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
          />
          <motion.div
            key="sheet"
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.4 }}
            onDragEnd={(_, info) => { if (info.offset.y > 100) onClose() }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35, mass: 0.9 }}
            style={{
              position: 'fixed', bottom: 0,
              left: '50%', transform: 'translateX(-50%)',
              width: '100%', maxWidth: 430,
              background: 'var(--color-surface-solid)',
              borderRadius: '28px 28px 0 0',
              padding: '0 20px 48px',
              zIndex: 101,
              maxHeight: '88vh',
              overflowY: 'auto',
              boxShadow: '0 -8px 40px rgba(44,49,64,0.14)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12 }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--color-border-strong)' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0 20px' }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>{title}</h3>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  background: 'var(--color-surface-soft)', border: 'none',
                  borderRadius: 10, padding: 8, color: 'var(--color-text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X size={18} />
              </motion.button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
