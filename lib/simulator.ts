'use client';
import { useEffect, useRef } from 'react';
import { useSwarmStore } from '@/store/swarmStore';
import { AgentLog, LogSeverity, DashboardMetrics } from '@/types';

// Parse raw markdown log content into AgentLog entries
function parseMarkdownLogs(content: string, existingIds: Set<string>): AgentLog[] {
  const lines = content
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 10)
    .slice(-30);

  return lines
    .map((line, i): AgentLog | null => {
      const id = `live-log-${encodeURIComponent(line.slice(0, 60)).replace(/[^a-zA-Z0-9]/g, '').slice(0, 12)}-${i}`;
      if (existingIds.has(id)) return null;
      let severity: LogSeverity = 'info';
      const lower = line.toLowerCase();
      if (lower.includes('error') || lower.includes('fail') || lower.includes('exception')) severity = 'error';
      else if (lower.includes('execut') || lower.includes('tool:') || lower.includes('action')) severity = 'action';
      else if (lower.includes('think') || lower.includes('plan') || lower.includes('consider')) severity = 'thought';
      return {
        id,
        agentId: 'panodu-main',
        swarmId: 'swarm-1',
        severity,
        message: line.replace(/^#+\s*/, '').slice(0, 200),
        timestamp: Date.now() - (30 - i) * 2000,
      };
    })
    .filter((l): l is AgentLog => l !== null);
}

export function useSwarmSimulator() {
  const pushLog = useSwarmStore((s) => s.pushLog);
  const setMetrics = useSwarmStore((s) => s.setMetrics);
  const setAgents = useSwarmStore((s) => s.setAgents);
  const seenLogIds = useRef<Set<string>>(new Set());

  // Live status polling from /api/status every 10s
  useEffect(() => {
    async function pollStatus() {
      try {
        const res = await fetch('/api/status', { cache: 'no-store' });
        if (!res.ok) {
          pushLog({
            id: `err-status-${Date.now()}`,
            agentId: 'system',
            swarmId: 'swarm-1',
            severity: 'error',
            message: `[STATUS API] HTTP ${res.status}: failed to fetch agent status.`,
            timestamp: Date.now(),
          });
          return;
        }
        const data = await res.json();
        if (data.error) {
          pushLog({
            id: `err-status-${Date.now()}`,
            agentId: 'system',
            swarmId: 'swarm-1',
            severity: 'error',
            message: `[STATUS API] Error: ${data.error}`,
            timestamp: Date.now(),
          });
          return;
        }
        const patch: Partial<DashboardMetrics> = {};
        if (typeof data.activeAgents === 'number') patch.activeAgents = data.activeAgents;
        if (typeof data.activeSwarms === 'number') patch.activeSwarms = data.activeSwarms;
        if (typeof data.totalTokensToday === 'number') patch.totalTokensToday = data.totalTokensToday;
        if (typeof data.totalCostToday === 'number') patch.totalCostToday = data.totalCostToday;
        if (typeof data.totalTokensMonth === 'number') patch.totalTokensMonth = data.totalTokensMonth;
        if (Object.keys(patch).length > 0) setMetrics(patch);
        if (Array.isArray(data.agents) && data.agents.length > 0) setAgents(data.agents);
      } catch (err) {
        pushLog({
          id: `err-status-${Date.now()}`,
          agentId: 'system',
          swarmId: 'swarm-1',
          severity: 'error',
          message: `[STATUS API] Unreachable: ${err instanceof Error ? err.message : String(err)}`,
          timestamp: Date.now(),
        });
      }
    }
    pollStatus();
    const interval = setInterval(pollStatus, 10_000);
    return () => clearInterval(interval);
  }, [setMetrics, setAgents, pushLog]);

  // Live log polling from /api/logs every 30s
  useEffect(() => {
    async function pollLogs() {
      try {
        const res = await fetch('/api/logs', { cache: 'no-store' });
        if (!res.ok) {
          pushLog({
            id: `err-logs-${Date.now()}`,
            agentId: 'system',
            swarmId: 'swarm-1',
            severity: 'error',
            message: `[LOGS API] HTTP ${res.status}: failed to fetch logs.`,
            timestamp: Date.now(),
          });
          return;
        }
        const { content } = await res.json();
        if (!content) return;
        const newLogs = parseMarkdownLogs(content, seenLogIds.current);
        newLogs.forEach((log) => {
          seenLogIds.current.add(log.id);
          pushLog(log);
        });
      } catch (err) {
        pushLog({
          id: `err-logs-${Date.now()}`,
          agentId: 'system',
          swarmId: 'swarm-1',
          severity: 'error',
          message: `[LOGS API] Unreachable: ${err instanceof Error ? err.message : String(err)}`,
          timestamp: Date.now(),
        });
      }
    }
    pollLogs();
    const interval = setInterval(pollLogs, 30_000);
    return () => clearInterval(interval);
  }, [pushLog]);
}
