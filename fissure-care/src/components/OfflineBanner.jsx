import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WifiOff, Wifi } from 'lucide-react'

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [justCameBack, setJustCameBack] = useState(false)

  useEffect(() => {
    const goOffline = () => setIsOffline(true)
    const goOnline = () => {
      setIsOffline(false)
      setJustCameBack(true)
      setTimeout(() => setJustCameBack(false), 3000)
    }
    window.addEventListener('offline', goOffline)
    window.addEventListener('online', goOnline)
    return () => { window.removeEventListener('offline', goOffline); window.removeEventListener('online', goOnline) }
  }, [])

  return (
    <AnimatePresence>
      {(isOffline || justCameBack) && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 430, zIndex: 999,
            background: justCameBack ? 'linear-gradient(135deg, #A8D5A2, #7BC97B)' : 'linear-gradient(135deg, #E8705A, #F5A68A)',
            padding: '12px 20px',
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}
        >
          {justCameBack
            ? <Wifi size={16} color="#fff" />
            : <WifiOff size={16} color="#fff" />
          }
          <p style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>
            {justCameBack
              ? 'Back online! Your logs are syncing 💛'
              : "You're offline, Bujji — logs are saved locally and will sync when you're back 💛"
            }
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
