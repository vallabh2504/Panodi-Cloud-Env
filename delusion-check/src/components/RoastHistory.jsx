import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, Zap } from 'lucide-react'
import { supabase } from '../supabaseClient'

function ScoreBadge({ score }) {
  const color = score >= 75 ? '#ff2d78' : score >= 40 ? '#ffa500' : '#39ff14'
  return (
    <span
      className="text-xs font-mono font-bold px-2 py-0.5 rounded-sm shrink-0"
      style={{ background: `${color}15`, border: `1px solid ${color}60`, color }}
    >
      {score}/100
    </span>
  )
}

function HistoryItem({ item, index }) {
  const [expanded, setExpanded] = useState(false)
  const date = new Date(item.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07 }}
      className="rounded-sm overflow-hidden cursor-pointer"
      style={{ border: '1px solid rgba(57,255,20,0.15)', background: 'rgba(57,255,20,0.03)' }}
      onClick={() => setExpanded(p => !p)}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <ScoreBadge score={item.score} />
        <p className="text-xs font-mono flex-1 truncate" style={{ color: 'rgba(226,232,240,0.7)' }}>
          {item.dream}
        </p>
        <span className="text-xs font-mono shrink-0" style={{ color: 'rgba(226,232,240,0.3)' }}>
          {date}
        </span>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          className="text-xs font-mono shrink-0"
          style={{ color: 'rgba(57,255,20,0.5)' }}
        >
          ▼
        </motion.span>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-sm p-2.5" style={{ background: 'rgba(0,245,255,0.05)', border: '1px solid rgba(0,245,255,0.1)' }}>
                  <div className="text-xs uppercase tracking-widest mb-1" style={{ color: '#00f5ff80' }}>Dream</div>
                  <p className="text-xs font-mono" style={{ color: 'rgba(226,232,240,0.7)' }}>{item.dream}</p>
                </div>
                <div className="rounded-sm p-2.5" style={{ background: 'rgba(255,45,120,0.05)', border: '1px solid rgba(255,45,120,0.1)' }}>
                  <div className="text-xs uppercase tracking-widest mb-1" style={{ color: '#ff2d7880' }}>Reality</div>
                  <p className="text-xs font-mono" style={{ color: 'rgba(226,232,240,0.7)' }}>{item.reality}</p>
                </div>
              </div>
              <div className="rounded-sm p-3" style={{ background: 'rgba(255,45,120,0.05)', border: '1px solid rgba(255,45,120,0.15)' }}>
                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: '#ff2d7880' }}>// Hyderabadi Verdict</div>
                <p className="text-xs font-mono leading-relaxed" style={{ color: '#e2e8f0' }}>{item.roast}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function RoastHistory({ user, onClose }) {
  const [roasts, setRoasts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('roasts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error) setRoasts(data ?? [])
        setLoading(false)
      })
  }, [user.id])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(5,5,16,0.92)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="w-full max-w-xl max-h-[80vh] flex flex-col rounded-sm overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0d0d1a 0%, #080814 100%)',
          border: '1px solid rgba(57,255,20,0.25)',
          boxShadow: '0 0 60px rgba(57,255,20,0.1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(57,255,20,0.1)' }}>
          <div className="flex items-center gap-2">
            <Clock size={14} style={{ color: '#39ff14' }} />
            <span className="font-mono text-sm uppercase tracking-widest" style={{ color: '#39ff14' }}>
              Roast History
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-sm"
            style={{ border: '1px solid rgba(255,45,120,0.3)', color: '#ff2d78' }}
          >
            <X size={14} />
          </motion.button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 rounded-full"
                style={{ border: '2px solid transparent', borderTopColor: '#39ff14', borderRightColor: '#39ff14' }}
              />
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'rgba(57,255,20,0.5)' }}>
                Loading history...
              </span>
            </div>
          ) : roasts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Zap size={24} style={{ color: 'rgba(57,255,20,0.3)' }} />
              <p className="text-xs font-mono text-center" style={{ color: 'rgba(226,232,240,0.3)' }}>
                No roasts yet.<br />Run your first Delusion Check!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-mono mb-2" style={{ color: 'rgba(226,232,240,0.3)' }}>
                {roasts.length} roast{roasts.length !== 1 ? 's' : ''} on record. Click any to expand.
              </p>
              {roasts.map((item, i) => (
                <HistoryItem key={item.id} item={item} index={i} />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
