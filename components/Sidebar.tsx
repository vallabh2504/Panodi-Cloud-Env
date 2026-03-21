'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Bot, ShieldAlert, Settings, Zap, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSwarmStore } from '@/store/swarmStore';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/agents', label: 'Agents', icon: Bot },
  { href: '/interventions', label: 'Interventions', icon: ShieldAlert },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const interventions = useSwarmStore((s) => s.interventions);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: isOpen ? 0 : -300 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={[
        'flex flex-col w-64 h-screen glass-elevated border-r border-violet-500/20 shrink-0',
        'fixed inset-y-0 left-0 z-30 transition-transform duration-200 ease-in-out',
        'lg:static lg:translate-x-0 lg:z-auto lg:transition-none lg:animate-none lg:initial:x-0 lg:animate-none',
      ].join(' ')}
    >
      {/* Header */}
      <motion.div
        className="flex items-center gap-3 px-6 py-5 border-b border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-purple-600/5"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Zap className="text-violet-400 neon-glow-violet" size={22} />
        </motion.div>
        <span className="text-white font-bold text-lg tracking-tight flex-1 bg-gradient-to-r from-violet-300 to-purple-200 bg-clip-text text-transparent">
          SwarmOps
        </span>
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Close navigation menu"
          className="lg:hidden text-gray-400 hover:text-violet-300 transition-colors"
        >
          <X size={20} />
        </motion.button>
      </motion.div>

      {/* Navigation */}
      <motion.nav
        className="flex-1 py-4 px-3 space-y-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          const badge = href === '/interventions' && interventions.length > 0 ? interventions.length : null;
          return (
            <motion.div key={href} variants={itemVariants}>
              <Link
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  active
                    ? 'glass-elevated neon-border-violet text-white shadow-lg shadow-violet-500/20'
                    : 'text-gray-300 hover:glass hover:text-violet-300'
                }`}
                aria-label={label}
              >
                <motion.div
                  animate={active ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: active ? 2 : 0 }}
                >
                  <Icon size={18} />
                </motion.div>
                <span className="flex-1">{label}</span>
                {badge !== null && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center neon-glow-pink"
                  >
                    {badge}
                  </motion.span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </motion.nav>

      {/* Footer */}
      <motion.div
        className="px-6 py-4 border-t border-violet-500/20 bg-gradient-to-r from-violet-500/5 to-purple-600/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-xs text-gray-400 font-mono">SwarmOps v0.1.0</p>
        <p className="text-xs text-gray-500 font-mono">fine-clownfish-749</p>
      </motion.div>
    </motion.aside>
  );
}
