import { motion } from 'framer-motion'

export default function FadeUp({ children, delay = 0, distance = 24, style, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ type: 'spring', stiffness: 220, damping: 26, delay }}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  )
}
