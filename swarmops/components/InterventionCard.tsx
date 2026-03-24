'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Intervention } from '@/types';
import { useSwarmStore } from '@/store/swarmStore';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const RISK_STYLES: Record<Intervention['riskLevel'], string> = {
  low:    'border-blue-500/40 bg-blue-500/10 shadow-lg shadow-blue-500/20',
  medium: 'border-amber-500/40 bg-amber-500/10 shadow-lg shadow-amber-500/20',
  high:   'border-red-500/40 bg-red-500/10 shadow-lg shadow-red-500/30',
};

interface Props { intervention: Intervention; }

export default function InterventionCard({ intervention: iv }: Props) {
  const [guidance, setGuidance] = useState('');
  const approveIntervention = useSwarmStore((s) => s.approveIntervention);
  const rejectIntervention = useSwarmStore((s) => s.rejectIntervention);

  const elapsed = Math.floor((Date.now() - iv.timestamp) / 1000);
  const elapsedStr = elapsed < 60 ? `${elapsed}s ago` : `${Math.floor(elapsed / 60)}m ago`;

  const riskColor = iv.riskLevel === 'high' ? 'text-red-400' : iv.riskLevel === 'medium' ? 'text-amber-400' : 'text-blue-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`glass-elevated rounded-2xl p-6 space-y-4 border transition-all ${RISK_STYLES[iv.riskLevel]}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <AlertTriangle size={16} className={riskColor} />
            </motion.div>
            <span className="font-semibold text-white text-sm">{iv.agentName}</span>
            <span className="text-xs text-gray-400">· {iv.swarmId}</span>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`text-xs font-bold px-2 py-1 rounded-full border neon-glow-${iv.riskLevel === 'high' ? 'pink' : iv.riskLevel === 'medium' ? 'amber' : 'blue'} ${riskColor}`}
            >
              {iv.riskLevel.toUpperCase()} RISK
            </motion.span>
          </div>
          <p className="text-xs text-gray-300">{iv.description}</p>
        </div>
        <span className="text-xs text-gray-500 shrink-0 tabular-nums">{elapsedStr}</span>
      </div>

      {/* Pending action */}
      <motion.div
        className="backdrop-blur-xl bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-500/30 rounded-lg p-3 font-mono text-xs text-green-400"
        whileHover={{ borderColor: 'rgba(34, 197, 94, 0.6)' }}
      >
        <span className="text-gray-500 mr-2">$</span>
        {iv.pendingAction}
      </motion.div>

      {/* Controls */}
      <div className="space-y-3">
        <motion.input
          type="text"
          placeholder="Optional: provide corrected guidance for the agent..."
          value={guidance}
          onChange={(e) => setGuidance(e.target.value)}
          className="w-full glass rounded-lg px-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 outline-none backdrop-blur-xl"
          aria-label={`Corrected guidance for ${iv.agentName}`}
          whileFocus={{ scale: 1.02 }}
        />
        <div className="flex gap-3">
          <motion.button
            onClick={() => approveIntervention(iv.id, guidance)}
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg glass-elevated neon-border-cyan bg-gradient-to-r from-green-500/20 to-emerald-500/10 text-green-300 text-sm font-semibold transition-all"
            aria-label={`Approve action for ${iv.agentName}`}
          >
            <CheckCircle size={16} /> Approve
          </motion.button>
          <motion.button
            onClick={() => rejectIntervention(iv.id)}
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg glass-elevated neon-border-pink bg-gradient-to-r from-red-500/20 to-pink-500/10 text-red-300 text-sm font-semibold transition-all"
            aria-label={`Reject action for ${iv.agentName}`}
          >
            <XCircle size={16} /> Reject
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
