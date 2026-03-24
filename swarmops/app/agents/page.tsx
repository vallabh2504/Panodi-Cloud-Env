'use client';
import { motion } from 'framer-motion';
import LogFeed from '@/components/LogFeed';

export default function AgentsPage() {
  return (
    <motion.div
      className="p-6 flex flex-col h-full gap-4"
      style={{ height: 'calc(100vh - 0px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.h1 className="text-3xl font-bold bg-gradient-to-r from-violet-300 via-purple-200 to-violet-300 bg-clip-text text-transparent">
          Agent Activity Feed
        </motion.h1>
        <p className="text-gray-400 text-sm mt-2">
          Live stream of all agent thoughts, actions, and errors.
        </p>
      </motion.div>
      <div className="flex-1 min-h-0">
        <LogFeed />
      </div>
    </motion.div>
  );
}
