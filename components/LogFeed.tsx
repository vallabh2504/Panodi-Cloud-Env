'use client';
import { useSwarmStore } from '@/store/swarmStore';
import LogEntry from './LogEntry';
import { MOCK_AGENTS, MOCK_SWARMS } from '@/lib/mockData';
import { LogSeverity } from '@/types';

const SEVERITIES: LogSeverity[] = ['info', 'action', 'thought', 'error'];

export default function LogFeed() {
  const logs = useSwarmStore((s) => s.logs);
  const filter = useSwarmStore((s) => s.logFilter);
  const setLogFilter = useSwarmStore((s) => s.setLogFilter);

  const filtered = logs.filter((l) => {
    if (filter.agentId && l.agentId !== filter.agentId) return false;
    if (filter.swarmId && l.swarmId !== filter.swarmId) return false;
    if (filter.severity && l.severity !== filter.severity) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <select
          value={filter.agentId}
          onChange={(e) => setLogFilter({ agentId: e.target.value })}
          className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-3 py-2 focus:ring-1 focus:ring-violet-500 focus:border-violet-500 outline-none"
          aria-label="Filter by agent"
        >
          <option value="">All Agents</option>
          {MOCK_AGENTS.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        <select
          value={filter.swarmId}
          onChange={(e) => setLogFilter({ swarmId: e.target.value })}
          className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-3 py-2 focus:ring-1 focus:ring-violet-500 focus:border-violet-500 outline-none"
          aria-label="Filter by swarm"
        >
          <option value="">All Swarms</option>
          {MOCK_SWARMS.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <select
          value={filter.severity}
          onChange={(e) => setLogFilter({ severity: e.target.value })}
          className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-3 py-2 focus:ring-1 focus:ring-violet-500 focus:border-violet-500 outline-none"
          aria-label="Filter by severity"
        >
          <option value="">All Severities</option>
          {SEVERITIES.map((s) => (
            <option key={s} value={s}>{s.toUpperCase()}</option>
          ))}
        </select>
        <button
          onClick={() => setLogFilter({ agentId: '', swarmId: '', severity: '' })}
          className="text-xs px-3 py-2 text-gray-500 hover:text-gray-300 transition-colors"
          aria-label="Clear filters"
        >
          Clear
        </button>
        <span className="ml-auto text-xs text-gray-500">{filtered.length} entries</span>
      </div>

      {/* Log list */}
      <div
        className="flex-1 overflow-y-auto space-y-1 pr-1"
        role="list"
        aria-label="Agent activity feed"
        aria-live="polite"
        aria-atomic="false"
        aria-relevant="additions"
      >
        {filtered.map((log) => (
          <LogEntry key={log.id} log={log} />
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-gray-600 text-sm py-10">
            No logs match current filters.
          </p>
        )}
      </div>
    </div>
  );
}
