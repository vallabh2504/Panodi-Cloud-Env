'use client';
import { motion } from 'framer-motion';
import { useSwarmStore } from '@/store/swarmStore';
import SwarmConfigRow from '@/components/SwarmConfigRow';

export default function SettingsPage() {
  const swarms = useSwarmStore((s) => s.swarms);

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
          Swarm Configuration
        </motion.h1>
        <p className="text-gray-400 text-sm mt-2">
          Manage budgets, activation state, and kill switches per swarm.
        </p>
      </motion.div>
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
        {swarms.map((swarm) => (
          <SwarmConfigRow key={swarm.id} swarm={swarm} />
        ))}
      </motion.div>
    </motion.div>
  );
}
