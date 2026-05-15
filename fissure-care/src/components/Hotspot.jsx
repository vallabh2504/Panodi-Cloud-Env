import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LS_KEY = 'fissurecare_hotspot_dismissed'

function getDismissed() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}') } catch { return {} }
}

export function useHotspot(id) {
  const dismissed = getDismissed()
  const [visible, setVisible] = useState(!dismissed[id])

  const dismiss = () => {
    const d = getDismissed()
    d[id] = true
    localStorage.setItem(LS_KEY, JSON.stringify(d))
    setVisible(false)
  }

  return { visible, dismiss }
}

export default function Hotspot({ id, label, position = 'bottom', children, theme }) {
  const { visible, dismiss } = useHotspot(id)
  const primary = theme?.primary || '#E8705A'

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              position: 'absolute',
              ...(position === 'bottom' ? { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 8 } :
                  position === 'top' ? { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8 } :
                  position === 'right' ? { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: 8 } :
                  { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 8 }),
              zIndex: 100, whiteSpace: 'nowrap',
            }}
          >
            {/* Pulsing dot */}
            <motion.div
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                width: 10, height: 10, borderRadius: '50%',
                background: primary, margin: '0 auto 6px',
                boxShadow: `0 0 0 4px ${primary}33`,
              }}
            />
            <div
              onClick={dismiss}
              style={{
                background: primary, color: '#fff',
                borderRadius: 12, padding: '6px 12px',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              {label} ×
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
