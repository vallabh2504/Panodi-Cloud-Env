'use client';
import { useState } from 'react';
import { Menu, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated background gradient */}
      <motion.div
        className="fixed inset-0 -z-10 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 pointer-events-none"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Mobile overlay backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 relative">
        {/* Mobile top bar */}
        <motion.div
          className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 glass-dark border-b border-violet-500/20 lg:hidden backdrop-blur-3xl"
          initial={{ y: -60 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <motion.button
            onClick={() => setSidebarOpen(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open navigation menu"
            className="text-gray-300 hover:text-violet-300 transition-colors"
          >
            <Menu size={22} />
          </motion.button>
          <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity }}>
            <Zap className="text-violet-400 neon-glow-violet" size={18} />
          </motion.div>
          <span className="text-white font-bold text-base tracking-tight bg-gradient-to-r from-violet-300 to-purple-200 bg-clip-text text-transparent">
            SwarmOps
          </span>
        </motion.div>

        {/* Content area with subtle gradient */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
