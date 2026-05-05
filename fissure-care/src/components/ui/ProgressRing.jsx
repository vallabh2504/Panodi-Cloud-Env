import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function ProgressRing({ score = 0, size = 130, strokeWidth = 8, dark = true }) {
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setDisplayed(score), 200)
    return () => clearTimeout(timer)
  }, [score])

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(Math.max(displayed, 0), 100) / 100) * circumference

  const trackColor  = dark ? 'rgba(255,255,255,0.15)' : 'var(--color-primary-muted)'
  const ringColor   = dark ? 'rgba(255,255,255,0.92)' : 'var(--color-primary)'
  const textColor   = dark ? '#fff' : 'var(--color-text-primary)'
  const subColor    = dark ? 'rgba(255,255,255,0.55)' : 'var(--color-text-muted)'

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={ringColor} strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.span
          key={displayed}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          style={{ fontSize: size * 0.22, fontWeight: 800, color: textColor, lineHeight: 1, fontFamily: 'var(--font-main)' }}
        >
          {displayed}
        </motion.span>
        <span style={{ fontSize: size * 0.08, color: subColor, marginTop: 2 }}>of 100</span>
      </div>
    </div>
  )
}
