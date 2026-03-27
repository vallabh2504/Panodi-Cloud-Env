import { motion, AnimatePresence } from 'framer-motion'
import type { Theme } from '../App'

interface OrbBackgroundProps {
  theme: Theme
}

const themeColors = {
  dark: {
    orb1: 'from-blue-600/20 to-indigo-900/20',
    orb2: 'from-purple-800/20 to-fuchsia-950/20',
    orb3: 'from-slate-900/20 to-black/20',
    bg: 'bg-[#030305]',
  },
  light: {
    orb1: 'from-indigo-200/50 to-blue-300/50',
    orb2: 'from-purple-200/50 to-fuchsia-300/50',
    orb3: 'from-slate-200/50 to-white/50',
    bg: 'bg-[#f4f6fb]',
  },
  forest: {
    orb1: 'from-emerald-800/30 to-teal-950/30',
    orb2: 'from-green-600/20 to-emerald-900/20',
    orb3: 'from-teal-900/25 to-black/25',
    bg: 'bg-[#040e0a]',
  },
  cyber: {
    orb1: 'from-fuchsia-600/25 to-purple-900/25',
    orb2: 'from-cyan-400/20 to-blue-800/20',
    orb3: 'from-violet-900/20 to-black/20',
    bg: 'bg-[#06001a]',
  },
}

export default function OrbBackground({ theme }: OrbBackgroundProps) {
  const colors = themeColors[theme]

  return (
    <div className={`fixed inset-0 overflow-hidden -z-10 transition-colors duration-1000 ${colors.bg} transform-gpu`}>
      {/* Hardware-accelerated orb container */}
      <div className="absolute inset-0 transform-gpu" style={{ transform: 'translateZ(0)' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-0 transform-gpu"
          >
            {/* Primary Orb */}
            <motion.div
              animate={{
                x: [0, 120, -60, 0],
                y: [0, 60, 120, 0],
                scale: [1, 1.2, 0.9, 1],
              }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
              className={`absolute -top-1/4 -left-1/4 w-[80vw] h-[80vw] bg-gradient-to-br ${colors.orb1} rounded-full blur-[120px] will-change-transform transform-gpu`}
            />

            {/* Secondary Orb */}
            <motion.div
              animate={{
                x: [0, -100, 80, 0],
                y: [0, 140, -50, 0],
                scale: [1, 1.15, 1.3, 1],
              }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear', delay: 1 }}
              className={`absolute top-1/4 -right-1/4 w-[70vw] h-[70vw] bg-gradient-to-br ${colors.orb2} rounded-full blur-[110px] will-change-transform transform-gpu`}
            />

            {/* Tertiary Orb */}
            <motion.div
              animate={{
                x: [0, 60, -120, 0],
                y: [0, -70, 50, 0],
                scale: [1, 1.3, 0.9, 1],
              }}
              transition={{ duration: 34, repeat: Infinity, ease: 'linear', delay: 2 }}
              className={`absolute -bottom-1/4 left-1/4 w-[90vw] h-[90vw] bg-gradient-to-br ${colors.orb3} rounded-full blur-[130px] will-change-transform transform-gpu`}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 pointer-events-none" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        }}
      />

      {/* Forest vignette overlay */}
      {theme === 'forest' && (
        <div className="absolute inset-0 forest-vignette" />
      )}

      {/* Cyber scanline overlay */}
      {theme === 'cyber' && (
        <div className="absolute inset-0 cyber-scanlines" />
      )}
    </div>
  )
}
