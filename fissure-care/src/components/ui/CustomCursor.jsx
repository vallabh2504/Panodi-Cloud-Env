import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0)

export default function CustomCursor() {
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const springConfig = { stiffness: 180, damping: 22, mass: 0.6 }
  const ringX = useSpring(mouseX, springConfig)
  const ringY = useSpring(mouseY, springConfig)

  useEffect(() => {
    if (isTouchDevice()) return

    const onMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!visible) setVisible(true)
    }

    const onOver = (e) => {
      const el = e.target
      if (el.closest('button, a, input, [role="button"], textarea, select')) {
        setHovering(true)
      } else {
        setHovering(false)
      }
    }

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
    }
  }, [mouseX, mouseY, visible])

  if (isTouchDevice()) return null

  return (
    <>
      {/* Dot — follows exactly */}
      <motion.div
        className={`cursor-dot${hovering ? ' hover' : ''}`}
        style={{ x: mouseX, y: mouseY, opacity: visible ? 1 : 0 }}
      />
      {/* Ring — spring lag */}
      <motion.div
        className={`cursor-ring${hovering ? ' hover' : ''}`}
        style={{ x: ringX, y: ringY, opacity: visible ? 0.6 : 0 }}
        animate={{ scale: hovering ? 1.15 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      />
    </>
  )
}
