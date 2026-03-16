import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Agent, AgentState } from '../types';
import { SPRITES } from '../sprites';
import PixelSprite from './PixelSprite';

// State config — animation speed & glow colour
const STATE_CFG: Record<AgentState, { fps: number; glow: string | null; label: string; labelColor: string }> = {
  idle:    { fps: 600,  glow: null,      label: 'IDLE',    labelColor: '#4ADE80' },
  working: { fps: 200,  glow: '#17BEBB', label: 'WORKING', labelColor: '#38BDF8' },
  alert:   { fps: 300,  glow: '#FBBF24', label: 'ALERT',   labelColor: '#FBBF24' },
};

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  const [frameIdx, setFrameIdx] = useState(0);

  const cfg = STATE_CFG[agent.state];
  const spriteSet = SPRITES[agent.id];
  const frames = spriteSet[agent.state];

  // Cycle sprite frames
  useEffect(() => {
    setFrameIdx(0);
    const iv = setInterval(() => setFrameIdx(f => (f + 1) % frames.length), cfg.fps);
    return () => clearInterval(iv);
  }, [agent.state, cfg.fps, frames.length]);

  // Framer Motion body animation
  const bodyAnimation =
    agent.state === 'idle'
      ? { y: [0, -2, 0] }
      : agent.state === 'working'
      ? { y: [0, -3, 0, -1, 0] }
      : { scale: [1, 1.06, 1] };

  const bodyTransition =
    agent.state === 'working'
      ? { duration: 0.5, repeat: Infinity, ease: 'easeInOut' }
      : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' };

  // Alert ring pulsing
  const alertBorderVariants = {
    pulse: {
      boxShadow: [
        '0 0 0px 0px rgba(251,191,36,0)',
        '0 0 0px 4px rgba(251,191,36,0.6)',
        '0 0 0px 0px rgba(251,191,36,0)',
      ],
      transition: { duration: 1, repeat: Infinity },
    },
    none: { boxShadow: 'none' },
  };

  return (
    <motion.div
      animate={agent.state === 'alert' ? 'pulse' : 'none'}
      variants={alertBorderVariants}
      className="flex flex-col items-center gap-3 p-4 bg-slate-950 border border-green-900 rounded"
      style={{ minWidth: 160 }}
    >
      {/* Sprite */}
      <motion.div
        animate={bodyAnimation}
        transition={bodyTransition}
        className="relative"
      >
        <PixelSprite
          pixels={frames[frameIdx]}
          scale={4}
          glow={cfg.glow}
        />

        {/* Alert speech bubble */}
        <AnimatePresence>
          {agent.state === 'alert' && (
            <motion.div
              key="bubble"
              initial={{ opacity: 0, y: 4, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-yellow-400 text-black text-[9px] font-bold px-2 py-0.5 rounded"
              style={{ zIndex: 10 }}
            >
              ❗ INPUT NEEDED
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Name + role */}
      <div className="text-center">
        <div className="text-xs font-bold tracking-widest text-green-300 uppercase">
          {agent.name}
        </div>
        <div className="text-[10px] text-green-700 tracking-wide mt-0.5">
          {agent.role}
        </div>
      </div>

      {/* State badge */}
      <div
        className="text-[10px] font-mono px-2 py-0.5 border rounded tracking-widest"
        style={{ color: cfg.labelColor, borderColor: cfg.labelColor + '55' }}
      >
        [{cfg.label}]
      </div>

      {/* Last message */}
      <div className="text-[10px] text-green-600 text-center leading-relaxed max-w-[140px]">
        {agent.message}
      </div>

      {/* Timestamp */}
      <div className="text-[9px] text-green-900 font-mono">
        {agent.timestamp ? new Date(agent.timestamp).toLocaleTimeString() : '—'}
      </div>
    </motion.div>
  );
}
