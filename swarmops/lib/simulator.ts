'use client';
import { useEffect, useRef } from 'react';
import { useSwarmStore } from '@/store/swarmStore';
import { AgentLog, LogSeverity, DashboardMetrics } from '@/types';

// Parse raw markdown log content into AgentLog entries
function parseMarkdownLogs(content: string, seenLogIds: React.MutableRefObject<Set<string>>): AgentLog[] {
  const lines = content
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 10)
    .slice(-50); // Take last 50 lines for better context

  return lines
    .map((line, i): AgentLog | null => {
      // Create a stable ID based on content to prevent duplicates across polls
      const lineHash = encodeURIComponent(line.slice(0, 100)).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
      const id = `live-log-${lineHash}`;
      if (seenLogIds.current.has(id)) return null;

      let severity: LogSeverity = 'info';
      const lower = line.toLowerCase();
      
      // Match severity from memory file keywords
      if (lower.includes('error') || lower.includes('fail') || lower.includes('crash') || lower.includes('issue')) severity = 'error';
      else if (lower.includes('victory') || lower.includes('success') || lower.includes('done') || lower.includes('milestone') || lower.includes('deployed')) severity = 'action';
      else if (lower.includes('thought') || lower.includes('logic') || lower.includes('decision') || lower.includes('research')) severity = 'thought';

      // Clean the message (remove markdown headers and excess whitespace)
      const message = line
        .replace(/^#+\s*/, '')
        .replace(/^-\s*/, '')
        .trim();

      return {
        id,
        agentId: 'panodu-main',
        swarmId: 'swarm-1',
        severity,
        message: message.slice(0, 500),
        timestamp: Date.now() - (lines.length - i) * 1000,
      };
    })
    .filter((l): l is AgentLog => l !== null);
}

export function useSwarmSimulator() {
  const pushLog = useSwarmStore((s) => s.pushLog);
  const setMetrics = useSwarmStore((s) => s.setMetrics);
  const setAgents = useSwarmStore((s) => s.setAgents);
  const seenLogIds = useRef<Set<string>>(new Set());

  // Live log polling from /api/logs every 10s
  useEffect(() => {
    async function pollLogs() {
      try {
        const res = await fetch('/api/logs', { cache: 'no-store' });
        if (!res.ok) {
          const errMsg = `[LOGS API] HTTP ${res.status}: failed to fetch logs.`;
          const errId = `err-logs-${Date.now()}`;
          if (!seenLogIds.current.has(errId)) {
            pushLog({
              id: errId,
              agentId: 'system',
              swarmId: 'swarm-1',
              severity: 'error',
              message: errMsg,
              timestamp: Date.now(),
            });
            seenLogIds.current.add(errId);
          }
          return;
        }
        
        const data = await res.json();
        const content = data.content || '';
        if (!content) return;

        const newLogs = parseMarkdownLogs(content, seenLogIds);
        newLogs.forEach((log) => {
          seenLogIds.current.add(log.id);
          pushLog(log);
        });
      } catch (err) {
        const errMsg = `[LOGS API] Unreachable: ${err instanceof Error ? err.message : String(err)}`;
        const errId = `err-logs-fetch-${Date.now()}`;
        if (!seenLogIds.current.has(errId)) {
          pushLog({
            id: errId,
            agentId: 'system',
            swarmId: 'swarm-1',
            severity: 'error',
            message: errMsg,
            timestamp: Date.now(),
          });
          seenLogIds.current.add(errId);
        }
      }
    }
    
    pollLogs();
    const interval = setInterval(pollLogs, 10000); // 10s poll for fresher feel
    return () => clearInterval(interval);
  }, [pushLog]);

  // Live status polling from /api/status every 15s
  useEffect(() => {
    async function pollStatus() {
      try {
        const res = await fetch('/api/status', { cache: 'no-store' });
        if (!res.ok) {
          const errMsg = `[STATUS API] HTTP ${res.status}: failed to fetch status.`;
          const errId = `err-status-${Date.now()}`;
          if (!seenLogIds.current.has(errId)) {
            pushLog({
              id: errId,
              agentId: 'system',
              swarmId: 'swarm-1',
              severity: 'error',
              message: errMsg,
              timestamp: Date.now(),
            });
            seenLogIds.current.add(errId);
          }
          return;
        }
        
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        const patch: Partial<DashboardMetrics> = {};
        if (typeof data.activeAgents === 'number') patch.activeAgents = data.activeAgents;
        if (typeof data.activeSwarms === 'number') patch.activeSwarms = data.activeSwarms;
        if (typeof data.totalTokensToday === 'number') patch.totalTokensToday = data.totalTokensToday;
        if (typeof data.totalCostToday === 'number') patch.totalCostToday = data.totalCostToday;
        if (typeof data.totalTokensMonth === 'number') patch.totalTokensMonth = data.totalTokensMonth;
        
        if (Object.keys(patch).length > 0) setMetrics(patch);
        if (Array.isArray(data.agents)) setAgents(data.agents);
      } catch (err) {
        const errMsg = `[STATUS API] Error: ${err instanceof Error ? err.message : String(err)}`;
        const errId = `err-status-fetch-${Date.now()}`;
        if (!seenLogIds.current.has(errId)) {
          pushLog({
            id: errId,
            agentId: 'system',
            swarmId: 'swarm-1',
            severity: 'error',
            message: errMsg,
            timestamp: Date.now(),
          });
          seenLogIds.current.add(errId);
        }
      }
    }
    
    pollStatus();
    const interval = setInterval(pollStatus, 15000);
    return () => clearInterval(interval);
  }, [setMetrics, setAgents, pushLog]);
}
