import { useEffect, useRef, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BloomFlower, StarField } from './AnimatedSVGs'
const Confetti3D = lazy(() => import('./Confetti3D'))


const CONFIGS = {
  confetti: { colors: ['#E8705A', '#F5C67A', '#A8D5A2', '#C9A8F5', '#F5A68A'], emoji: '🎉' },
  stars: { colors: ['#F5C67A', '#FFD700', '#FBBF24', '#F59E0B', '#FDE68A'], emoji: '⭐' },
  fireworks: { colors: ['#E8705A', '#C9A8F5', '#A8D5A2', '#F5C67A', '#F5A68A'], emoji: '🎆' },
  mega: { colors: ['#E8705A', '#C9A8F5', '#A8D5A2', '#F5C67A', '#3B82F6', '#10B981'], emoji: '🏆' },
  bounce: { colors: ['#A8D5A2', '#F5C67A', '#7BC97B'], emoji: '🍌' },
  drops: { colors: ['#A8C4F5', '#7BB8E8', '#B4D8F0'], emoji: '💧' },
  bathtub: { colors: ['#A8D5A2', '#A8C4F5', '#C9A8F5'], emoji: '🛁' },
}

export default function CelebrationOverlay({ celebration, onDismiss }) {
  const config = CONFIGS[celebration?.type] || CONFIGS.confetti
  const overlayRef = useRef(null)

  useEffect(() => {
    if (!celebration) return
    // Give milestone moments more time to be savoured / screenshotted
    const ms = ['fireworks', 'mega'].includes(celebration.type) ? 6500 : 3500
    const timer = setTimeout(onDismiss, ms)
    return () => clearTimeout(timer)
  }, [celebration, onDismiss])

  useEffect(() => {
    if (!celebration) return
    // Focus the overlay when it opens
    const el = overlayRef.current
    if (!el) return
    const focusable = el.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])')
    if (focusable.length) focusable[0].focus()

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return
      const focusableArr = Array.from(el.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])'))
      if (!focusableArr.length) return
      const first = focusableArr[0]
      const last = focusableArr[focusableArr.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [celebration])

  return (
    <AnimatePresence>
      {celebration && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onDismiss}
          style={{
            position: 'fixed', inset: 0, zIndex: 500,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 32,
          }}
        >
          <Suspense fallback={null}>
            <Confetti3D colors={celebration?.confettiColors || config.colors} />
          </Suspense>
          <motion.div
            initial={{ scale: 0.5, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 20 }}
            role="dialog"
            aria-modal="true"
            aria-label={celebration?.title}
            style={{
              position: 'relative', zIndex: 2,
              background: '#fff', borderRadius: 28, padding: '36px 28px',
              textAlign: 'center', maxWidth: 320, width: '100%',
              boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              {['confetti', 'fireworks', 'mega'].includes(celebration.type) ? (
                <BloomFlower size={72} color="#E8705A" />
              ) : celebration.type === 'stars' ? (
                <StarField size={72} color="#F5C67A" />
              ) : (
                <motion.div
                  animate={celebration.type === 'bounce'
                    ? { y: [0, -20, 0, -10, 0] }
                    : { rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.2, 1] }
                  }
                  transition={{ duration: 1, repeat: 2 }}
                  style={{ fontSize: 64 }}
                >
                  {config.emoji}
                </motion.div>
              )}
            </div>
            <p
              aria-live="assertive"
              style={{
                fontSize: 20, fontWeight: 800, fontFamily: 'Nunito',
                color: '#3D2B2B', lineHeight: 1.4, marginBottom: 8,
              }}
            >
              {celebration.title}
            </p>
            <p style={{ fontSize: 13, color: '#8C7070', marginBottom: 24 }}>
              Tap anywhere to continue
            </p>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onDismiss}
              style={{
                padding: '12px 32px',
                background: 'linear-gradient(135deg, #E8705A, #F5A68A)',
                border: 'none', borderRadius: 14,
                color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
              }}
            >
              Thank you! 💛
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
