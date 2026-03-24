'use client';
import { motion } from 'framer-motion';
import { useSwarmStore } from '@/store/swarmStore';
import InterventionCard from '@/components/InterventionCard';
import { ShieldCheck } from 'lucide-react';

export default function InterventionsPage() {
  const interventions = useSwarmStore((s) => s.interventions);

  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.h1 className="text-3xl font-bold bg-gradient-to-r from-violet-300 via-purple-200 to-violet-300 bg-clip-text text-transparent">
          Human-in-the-Loop
        </motion.h1>
        <p className="text-gray-400 text-sm mt-2">
          Agents paused and awaiting your approval before executing risky actions.
        </p>
      </motion.div>

      {interventions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 gap-3 text-gray-500"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          >
            <ShieldCheck size={48} className="text-violet-400 opacity-60" />
          </motion.div>
          <p className="text-sm font-light">No pending interventions. All agents are running autonomously.</p>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-4 max-w-3xl"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          {interventions.map((iv) => (
            <InterventionCard key={iv.id} intervention={iv} />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
