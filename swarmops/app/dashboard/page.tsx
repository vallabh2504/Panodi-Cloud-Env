'use client';
import { motion } from 'framer-motion';
import { useSwarmStore } from '@/store/swarmStore';
import StatsCard from '@/components/StatsCard';
import TokenBurnChart from '@/components/TokenBurnChart';
import { Bot, DollarSign, Zap, Layers } from 'lucide-react';

export default function DashboardPage() {
  const metrics = useSwarmStore((s) => s.metrics);
  const interventions = useSwarmStore((s) => s.interventions);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <motion.h1
          className="text-3xl font-bold bg-gradient-to-r from-violet-300 via-purple-200 to-violet-300 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Control Plane
        </motion.h1>
        <motion.p className="text-gray-400 text-sm mt-2">
          Real-time overview of all active swarms and agents.
        </motion.p>
      </motion.div>

      {/* Alert Banner */}
      {interventions.length > 0 && (
        <motion.div
          variants={itemVariants}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-elevated neon-border-pink rounded-2xl p-4 flex items-center gap-3 border-amber-500/50 bg-gradient-to-r from-amber-500/10 to-orange-500/5 shadow-lg shadow-amber-500/20"
        >
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl"
          >
            ⚠
          </motion.span>
          <span className="text-amber-300 font-semibold text-sm flex-1">
            {interventions.length} intervention{interventions.length > 1 ? 's' : ''} require your attention.
          </span>
          <motion.a
            href="/interventions"
            whileHover={{ x: 5 }}
            className="text-amber-200 underline text-sm hover:text-amber-100 transition-colors font-medium"
          >
            Review now →
          </motion.a>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 xl:grid-cols-4 gap-4"
      >
        <StatsCard
          title="Active Agents"
          value={metrics.activeAgents}
          subtitle={`Across ${metrics.activeSwarms} swarms`}
          icon={Bot}
          iconColor="text-green-400"
        />
        <StatsCard
          title="Tokens Today"
          value={metrics.totalTokensToday.toLocaleString()}
          subtitle="Cumulative token usage"
          icon={Zap}
          iconColor="text-violet-400"
        />
        <StatsCard
          title="Monthly Tokens"
          value={`${(metrics.totalTokensMonth / 1_000_000).toFixed(2)}M`}
          subtitle="Rolling 30-day total"
          icon={Layers}
          iconColor="text-blue-400"
        />
        <StatsCard
          title="Cost Today"
          value={`$${metrics.totalCostToday.toFixed(2)}`}
          subtitle="Estimated API cost"
          icon={DollarSign}
          iconColor="text-emerald-400"
        />
      </motion.div>

      {/* Chart */}
      <motion.div variants={itemVariants}>
        <TokenBurnChart data={metrics.tokenBurnHistory} />
      </motion.div>
    </motion.div>
  );
}
