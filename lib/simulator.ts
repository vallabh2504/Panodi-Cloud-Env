'use client';
import { useEffect, useRef } from 'react';
import { useSwarmStore } from '@/store/swarmStore';
import { generateLog } from '@/lib/mockData';
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
      const id = `live-log-${btoa(line.slice(0, 60)).replace(/[^a-zA-Z0-9]/g, '').slice(0, 12)}-${i}`;
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
  const updateMetric = useSwarmStore((s) => s.updateMetric);
  const setMetrics = useSwarmStore((s) => s.setMetrics);
  const seenLogIds = useRef<Set<string>>(new Set());

  // Simulated log stream (fallback / supplementary activity)
  useEffect(() => {
    const interval = setInterval(() => {
      const log = generateLog();
      pushLog(log);
      const tokenDelta = Math.floor(50 + Math.random() * 300);
      updateMetric({ tokens: tokenDelta, cost: parseFloat((tokenDelta * 0.000003).toFixed(6)) });
    }, 1200);
    return () => clearInterval(interval);
  }, [pushLog, updateMetric]);

  // Live status polling from /api/status every 10s
  useEffect(() => {
    async function pollStatus() {
      try {
        const res = await fetch('/api/status', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (data.error) return;
        const patch: Partial<DashboardMetrics> = {};
        if (typeof data.activeAgents === 'number') patch.activeAgents = data.activeAgents;
        if (typeof data.activeSwarms === 'number') patch.activeSwarms = data.activeSwarms;
        if (typeof data.totalTokensToday === 'number') patch.totalTokensToday = data.totalTokensToday;
        if (typeof data.totalCostToday === 'number') patch.totalCostToday = data.totalCostToday;
        if (typeof data.totalTokensMonth === 'number') patch.totalTokensMonth = data.totalTokensMonth;
        if (Object.keys(patch).length > 0) setMetrics(patch);
      } catch {
        // openclaw unavailable — simulated data continues
      }
    }
    pollStatus();
    const interval = setInterval(pollStatus, 10_000);
    return () => clearInterval(interval);
  }, [setMetrics]);

  // Live log polling from /api/logs every 30s
  useEffect(() => {
    async function pollLogs() {
      try {
        const res = await fetch('/api/logs', { cache: 'no-store' });
        if (!res.ok) return;
        const { content } = await res.json();
        if (!content) return;
        const newLogs = parseMarkdownLogs(content, seenLogIds.current);
        newLogs.forEach((log) => {
          seenLogIds.current.add(log.id);
          pushLog(log);
        });
      } catch {
        // memory logs unavailable — simulated logs continue
      }
    }
    pollLogs();
    const interval = setInterval(pollLogs, 30_000);
    return () => clearInterval(interval);
  }, [pushLog]);
}
