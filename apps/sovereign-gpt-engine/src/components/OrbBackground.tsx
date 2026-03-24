import { motion } from 'framer-motion'

export default function OrbBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10 bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0)_0%,rgba(2,6,23,1)_100%)] z-10" />
      
      {/* Sunset Orange Orb */}
      <motion.div
        animate={{
          x: [0, 150, -50, 0],
          y: [0, 80, 150, 0],
          scale: [1, 1.4, 0.8, 1],
          opacity: [0.15, 0.25, 0.1, 0.15],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#ff6b35] rounded-full blur-[140px]"
      />
      
      {/* Electric Blue Orb */}
      <motion.div
        animate={{
          x: [0, -200, 100, 0],
          y: [0, 150, -100, 0],
          scale: [1, 1.2, 1.5, 1],
          opacity: [0.1, 0.2, 0.15, 0.1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 -right-60 w-[700px] h-[700px] bg-[#0ea5e9] rounded-full blur-[160px]"
      />
      
      {/* Spring Green Orb */}
      <motion.div
        animate={{
          x: [0, 80, -120, 0],
          y: [0, -150, 50, 0],
          scale: [1, 1.3, 0.9, 1],
          opacity: [0.05, 0.15, 0.1, 0.05],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-60 left-1/4 w-[800px] h-[800px] bg-[#22c55e] rounded-full blur-[180px]"
      />
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
    </div>
  )
}
