import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BloomFlower, StarField } from './AnimatedSVGs'
import Confetti3D from './Confetti3D'

function ConfettiCanvas({ colors }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    const pieces = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: 6 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: (Math.random() - 0.5) * 3,
      speedY: 2 + Math.random() * 4,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 8,
    }))

    let raf
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of pieces) {
        p.y += p.speedY; p.x += p.speedX; p.rotation += p.rotSpeed
        if (p.y > canvas.height + 20) p.y = -20
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation * Math.PI / 180)
        ctx.fillStyle = p.color; ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
        ctx.restore()
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [colors])

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
}

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

  useEffect(() => {
    if (!celebration) return
    // Give milestone moments more time to be savoured / screenshotted
    const ms = ['fireworks', 'mega'].includes(celebration.type) ? 6500 : 3500
    const timer = setTimeout(onDismiss, ms)
    return () => clearTimeout(timer)
  }, [celebration, onDismiss])

  return (
    <AnimatePresence>
      {celebration && (
        <motion.div
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
          <Confetti3D colors={celebration?.confettiColors || config.colors} />
          <ConfettiCanvas colors={config.colors} />
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
