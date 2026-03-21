'use client';
import { motion } from 'framer-motion';
import { useSwarmStore } from '@/store/swarmStore';
import LogEntry from './LogEntry';
import { LogSeverity } from '@/types';

const SEVERITIES: LogSeverity[] = ['info', 'action', 'thought', 'error'];

export default function LogFeed() {
  const logs = useSwarmStore((s) => s.logs);
  const agents = useSwarmStore((s) => s.agents);
  const swarms = useSwarmStore((s) => s.swarms);
  const filter = useSwarmStore((s) => s.logFilter);
  const setLogFilter = useSwarmStore((s) => s.setLogFilter);

  const filtered = logs.filter((l) => {
    if (filter.agentId && l.agentId !== filter.agentId) return false;
    if (filter.swarmId && l.swarmId !== filter.swarmId) return false;
    if (filter.severity && l.severity !== filter.severity) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Filters */}
      <motion.div
        className="flex flex-wrap gap-2 items-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-3 sticky top-0 z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <select
          value={filter.agentId}
          onChange={(e) => setLogFilter({ agentId: e.target.value })}
          className="glass rounded-lg px-3 py-2 text-xs text-gray-200 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 outline-none backdrop-blur-xl"
          aria-label="Filter by agent"
        >
          <option value="">All Agents</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        <select
          value={filter.swarmId}
          onChange={(e) => setLogFilter({ swarmId: e.target.value })}
          className="glass rounded-lg px-3 py-2 text-xs text-gray-200 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 outline-none backdrop-blur-xl"
          aria-label="Filter by swarm"
        >
          <option value="">All Swarms</option>
          {swarms.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <select
          value={filter.severity}
          onChange={(e) => setLogFilter({ severity: e.target.value })}
          className="glass rounded-lg px-3 py-2 text-xs text-gray-200 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 outline-none backdrop-blur-xl"
          aria-label="Filter by severity"
        >
          <option value="">All Severities</option>
          {SEVERITIES.map((s) => (
            <option key={s} value={s}>{s.toUpperCase()}</option>
          ))}
        </select>
        <motion.button
          onClick={() => setLogFilter({ agentId: '', swarmId: '', severity: '' })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-xs px-3 py-2 text-gray-400 hover:text-violet-300 transition-colors font-medium"
          aria-label="Clear filters"
        >
          Clear
        </motion.button>
        <span className="ml-auto text-xs text-gray-500 font-mono">{filtered.length} entries</span>
      </motion.div>

      {/* Log list */}
      <motion.div
        className="flex-1 overflow-y-auto space-y-1.5 pr-2"
        role="list"
        aria-label="Agent activity feed"
        aria-live="polite"
        aria-atomic="false"
        aria-relevant="additions"
      >
        {filtered.map((log, idx) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.02 }}
          >
            <LogEntry log={log} />
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 text-sm py-10 font-light"
          >
            No logs match current filters.
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
