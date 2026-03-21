'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Swarm } from '@/types';
import { useSwarmStore } from '@/store/swarmStore';

interface Props { swarm: Swarm; }

export default function SwarmConfigRow({ swarm }: Props) {
  const setSwarmActive = useSwarmStore((s) => s.setSwarmActive);
  const setSwarmKillSwitch = useSwarmStore((s) => s.setSwarmKillSwitch);
  const setSwarmBudget = useSwarmStore((s) => s.setSwarmBudget);
  const [budget, setBudget] = useState(swarm.tokenBudget.toString());

  const budgetPct = Math.min(100, (swarm.tokensUsed / swarm.tokenBudget) * 100);
  const barColor = budgetPct > 90 ? 'from-red-500 to-red-600' : budgetPct > 70 ? 'from-amber-500 to-amber-600' : 'from-violet-500 to-purple-600';

  const saveBudget = () => {
    const v = parseInt(budget, 10);
    if (!isNaN(v) && v > 0) setSwarmBudget(swarm.id, v);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-elevated neon-border-violet rounded-2xl p-6 space-y-5 group hover:neon-glow-violet transition-all"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <motion.h3
            className="text-white font-bold text-sm bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {swarm.name}
          </motion.h3>
          <p className="text-xs text-gray-500 font-mono mt-1">{swarm.id}</p>
        </div>
        <div className="flex items-center gap-6">
          {/* Active toggle */}
          <motion.div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium">Active</span>
            <motion.button
              role="switch"
              aria-checked={swarm.active}
              aria-label={`Toggle ${swarm.name} active`}
              onClick={() => setSwarmActive(swarm.id, !swarm.active)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${
                swarm.active
                  ? 'bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30'
                  : 'bg-gray-700/50 backdrop-blur-xl'
              }`}
            >
              <motion.span
                layout
                className="inline-block h-5 w-5 transform rounded-full bg-white shadow-lg"
                animate={{ x: swarm.active ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            </motion.button>
          </motion.div>

          {/* Kill switch */}
          <motion.div className="flex items-center gap-2">
            <span className="text-xs text-red-400 font-bold">Kill Switch</span>
            <motion.button
              role="switch"
              aria-checked={swarm.killSwitch}
              aria-label={`Kill switch for ${swarm.name}`}
              onClick={() => setSwarmKillSwitch(swarm.id, !swarm.killSwitch)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-red-500/50 ${
                swarm.killSwitch
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 shadow-lg shadow-red-500/30'
                  : 'bg-gray-700/50 backdrop-blur-xl'
              }`}
            >
              <motion.span
                layout
                className="inline-block h-5 w-5 transform rounded-full bg-white shadow-lg"
                animate={{ x: swarm.killSwitch ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Budget bar */}
      <motion.div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="font-semibold">Token Budget Usage</span>
          <span className="tabular-nums font-mono text-violet-300">{swarm.tokensUsed.toLocaleString()} / {swarm.tokenBudget.toLocaleString()}</span>
        </div>
        <motion.div
          className="h-2.5 bg-white/5 backdrop-blur-xl rounded-full overflow-hidden border border-white/10"
          role="progressbar"
          aria-valuenow={Math.round(budgetPct)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${budgetPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full bg-gradient-to-r ${barColor} shadow-lg rounded-full`}
            style={{
              filter: `drop-shadow(0 0 8px ${budgetPct > 90 ? 'rgb(239, 68, 68, 0.5)' : budgetPct > 70 ? 'rgb(217, 119, 6, 0.5)' : 'rgb(168, 85, 247, 0.5)'})`,
            }}
          />
        </motion.div>
        <div className="flex items-center gap-2 flex-wrap">
          <motion.input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && saveBudget()}
            className="glass rounded-lg px-3 py-2 text-xs text-gray-200 w-48 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 outline-none backdrop-blur-xl tabular-nums"
            aria-label={`Token budget for ${swarm.name}`}
            min={1}
            whileFocus={{ scale: 1.02 }}
          />
          <motion.button
            onClick={saveBudget}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-xs px-4 py-2 glass-elevated neon-border-violet text-violet-300 rounded-lg transition-all font-semibold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40"
          >
            Save Budget
          </motion.button>
          <span className="text-xs text-gray-500 ml-auto font-mono">{budgetPct.toFixed(1)}% used</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
