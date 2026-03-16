import { motion } from 'framer-motion'
import { Share2, Download, RefreshCw, CheckCircle } from 'lucide-react'
import { useState, useRef } from 'react'
import DelusionMeter from './DelusionMeter'

function AdvicePill({ text, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2.5 + index * 0.15 }}
      className="flex items-start gap-3 p-3 rounded-sm"
      style={{ background: 'rgba(57,255,20,0.05)', border: '1px solid rgba(57,255,20,0.15)' }}
    >
      <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color: '#39ff14' }} />
      <span className="text-xs font-mono" style={{ color: 'rgba(226,232,240,0.8)' }}>{text}</span>
    </motion.div>
  )
}

export default function RoastCard({ result, dream, reality, onReset }) {
  const { score, label, color, emoji, roast, advice } = result
  const [copied, setCopied] = useState(false)
  const cardRef = useRef(null)

  const handleShare = () => {
    const text = `🤡 My Delusion Score: ${score}/100\n"${roast}"\n\nCheck yours at DelusionCheck.ai`
    if (navigator.share) {
      navigator.share({ title: 'DelusionCheck.ai', text }).catch(() => {})
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  const handleDownload = () => {
    // Mock download — shows a toast
    const el = document.createElement('div')
    el.style.cssText = `
      position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
      background:#0d0d1a; border:1px solid #39ff14; color:#39ff14;
      padding:12px 24px; border-radius:4px; font-family:monospace;
      font-size:13px; z-index:99999; box-shadow:0 0 20px rgba(57,255,20,0.4);
    `
    el.textContent = '📸 Roast card downloaded! (mock)'
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 2500)
  }

  const roastWords = roast.split(' ')

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Main card */}
      <div
        className="rounded-sm p-6 md:p-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0d0d1a 0%, #080814 100%)',
          border: `1px solid ${color}40`,
          boxShadow: `0 0 40px ${color}20, 0 0 80px ${color}10`,
        }}
      >
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2" style={{ borderColor: color }} />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2" style={{ borderColor: color }} />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2" style={{ borderColor: color }} />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2" style={{ borderColor: color }} />

        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
            className="text-xs tracking-[0.3em] uppercase mb-1"
            style={{ color: 'rgba(226,232,240,0.4)' }}
          >
            DelusionCheck.ai // Diagnosis Complete
          </motion.div>
        </div>

        {/* Meter */}
        <div className="flex justify-center mb-6">
          <DelusionMeter score={score} label={label} emoji={emoji} color={color} />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${color}60)` }} />
          <span className="text-xs font-mono" style={{ color: `${color}80` }}>ROAST INCOMING</span>
          <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${color}60, transparent)` }} />
        </div>

        {/* Roast text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="rounded-sm p-5 mb-6 relative"
          style={{
            background: 'rgba(255,45,120,0.05)',
            border: '1px solid rgba(255,45,120,0.2)',
          }}
        >
          <div
            className="absolute -top-px left-8 right-8 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #ff2d78, transparent)' }}
          />
          <div className="text-xs uppercase tracking-widest mb-3" style={{ color: '#ff2d78', opacity: 0.7 }}>
            // Hyderabadi Verdict
          </div>
          <p className="font-mono text-sm md:text-base leading-relaxed" style={{ color: '#e2e8f0' }}>
            {roastWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.04, duration: 0.2 }}
                className="inline-block mr-1"
              >
                {word}
              </motion.span>
            ))}
          </p>
        </motion.div>

        {/* Input summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <div className="rounded-sm p-3" style={{ background: 'rgba(0,245,255,0.05)', border: '1px solid rgba(0,245,255,0.15)' }}>
            <div className="text-xs uppercase tracking-widest mb-1" style={{ color: '#00f5ff80' }}>Dream</div>
            <p className="text-xs font-mono truncate" style={{ color: 'rgba(226,232,240,0.7)' }}>
              {dream.length > 60 ? dream.slice(0, 60) + '…' : dream}
            </p>
          </div>
          <div className="rounded-sm p-3" style={{ background: 'rgba(255,45,120,0.05)', border: '1px solid rgba(255,45,120,0.15)' }}>
            <div className="text-xs uppercase tracking-widest mb-1" style={{ color: '#ff2d7880' }}>Reality</div>
            <p className="text-xs font-mono truncate" style={{ color: 'rgba(226,232,240,0.7)' }}>
              {reality.length > 60 ? reality.slice(0, 60) + '…' : reality}
            </p>
          </div>
        </motion.div>

        {/* Advice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="mb-6"
        >
          <div className="text-xs uppercase tracking-widest mb-3" style={{ color: 'rgba(57,255,20,0.6)' }}>
            // Action Plan (if you dare)
          </div>
          <div className="flex flex-col gap-2">
            {advice.map((tip, i) => (
              <AdvicePill key={i} text={tip} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3 }}
          className="flex gap-3 flex-wrap"
        >
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm font-mono font-bold uppercase tracking-wider transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: 'rgba(255,45,120,0.15)',
              border: '1px solid #ff2d78',
              color: '#ff2d78',
              boxShadow: '0 0 15px rgba(255,45,120,0.25)',
            }}
          >
            <Share2 size={14} />
            {copied ? 'Copied!' : 'Share Roast'}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm font-mono font-bold uppercase tracking-wider transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: 'rgba(57,255,20,0.1)',
              border: '1px solid #39ff14',
              color: '#39ff14',
              boxShadow: '0 0 15px rgba(57,255,20,0.2)',
            }}
          >
            <Download size={14} />
            Download Card
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm font-mono font-bold uppercase tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 ml-auto"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(226,232,240,0.6)',
            }}
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}
