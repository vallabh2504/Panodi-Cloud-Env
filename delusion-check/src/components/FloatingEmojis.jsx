import { motion } from 'framer-motion'
import { useMemo } from 'react'

const EMOJIS = ['🤡', '💸', '📉', '🎭', '💀', '🔥', '😂', '📈', '🎪', '💫']

export default function FloatingEmojis() {
  const emojis = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: EMOJIS[i % EMOJIS.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 16 + Math.random() * 24,
      duration: 5 + Math.random() * 8,
      delay: Math.random() * 4,
      xOffset: (Math.random() - 0.5) * 60,
      yOffset: -(40 + Math.random() * 80),
      rotate: (Math.random() - 0.5) * 60,
    }))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {emojis.map((item) => (
        <motion.div
          key={item.id}
          className="absolute select-none"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: `${item.size}px`,
            opacity: 0.15,
          }}
          animate={{
            x: [0, item.xOffset, 0],
            y: [0, item.yOffset, 0],
            rotate: [0, item.rotate, 0],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  )
}
