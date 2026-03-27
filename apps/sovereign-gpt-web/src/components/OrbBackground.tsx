import { motion } from 'framer-motion'

export default function OrbBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10 bg-white dark:bg-slate-950 transition-colors duration-500">
      {/* Ambient gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/5 dark:to-black/20 z-10 pointer-events-none" />
      
      {/* Premium radial gradient base */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0)_100%)] dark:bg-[radial-gradient(circle_at_center,rgba(15,23,42,0)_0%,rgba(2,6,23,1)_100%)] z-10 pointer-events-none" />
      
      {/* Primary Violet Orb (enhanced neon) */}
      <motion.div
        animate={{
          x: [0, 200, -80, 0],
          y: [0, 100, 180, 0],
          scale: [1, 1.5, 0.9, 1],
          opacity: [0.2, 0.35, 0.12, 0.2],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-48 -left-48 w-[700px] h-[700px] bg-gradient-to-br from-violet-500 via-purple-500 to-violet-600 rounded-full blur-[150px] will-change-transform dark:from-violet-600 dark:via-purple-600 dark:to-violet-700"
        style={{ backfaceVisibility: 'hidden' }}
      />
      
      {/* Secondary Electric Blue Orb */}
      <motion.div
        animate={{
          x: [0, -250, 120, 0],
          y: [0, 180, -120, 0],
          scale: [1, 1.3, 1.6, 1],
          opacity: [0.15, 0.28, 0.18, 0.15],
        }}
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-1/3 -right-64 w-[750px] h-[750px] bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-full blur-[160px] will-change-transform dark:from-blue-600 dark:via-cyan-600 dark:to-blue-700"
        style={{ backfaceVisibility: 'hidden' }}
      />
      
      {/* Tertiary Indigo Orb */}
      <motion.div
        animate={{
          x: [0, 100, -150, 0],
          y: [0, -180, 80, 0],
          scale: [1, 1.4, 0.95, 1],
          opacity: [0.12, 0.25, 0.1, 0.12],
        }}
        transition={{ duration: 36, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className="absolute -bottom-56 left-1/3 w-[800px] h-[800px] bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-full blur-[170px] will-change-transform dark:from-indigo-600 dark:via-purple-600 dark:to-indigo-700"
        style={{ backfaceVisibility: 'hidden' }}
      />

      {/* Premium Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', 
          backgroundSize: '70px 70px', 
          pointerEvents: 'none' 
        }} 
      />

      {/* Noise texture for depth */}
      <div 
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02]" 
        style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' result=\'noise\' /%3E%3C/filter%3E%3Crect width=\'400\' height=\'400\' fill=\'%23000\' filter=\'url(%23noiseFilter)\' opacity=\'0.5\'/%3E%3C/svg%3E")',
          backgroundSize: '200px 200px',
          pointerEvents: 'none'
        }}
      />
    </div>
  )
}
