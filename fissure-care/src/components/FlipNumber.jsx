import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function Digit({ value, color, fontSize = 32, fontFamily = 'Nunito' }) {
  return (
    <div style={{ display: 'inline-block', overflow: 'hidden', height: fontSize * 1.2, verticalAlign: 'bottom' }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          style={{
            display: 'block',
            fontSize,
            fontWeight: 800,
            fontFamily,
            color: color || '#3D2B2B',
            lineHeight: 1.2,
          }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

export default function FlipNumber({ value = 0, color, fontSize = 32, fontFamily = 'Nunito', suffix = '' }) {
  const [digits, setDigits] = useState(String(Math.round(value)).split(''))

  useEffect(() => {
    setDigits(String(Math.round(value)).split(''))
  }, [value])

  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 1 }}>
      {digits.map((d, i) => (
        <Digit key={i} value={d} color={color} fontSize={fontSize} fontFamily={fontFamily} />
      ))}
      {suffix && (
        <span style={{ fontSize: fontSize * 0.4, color: color || '#8C7070', marginLeft: 2, fontWeight: 600 }}>
          {suffix}
        </span>
      )}
    </span>
  )
}
