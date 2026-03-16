import { useEffect, useState, useCallback } from 'react';
import type { Agent, AgentId, AgentState, SwarmEvent } from '../types';

// Default agent registry — shown even when no events have been received
const DEFAULT_AGENTS: Agent[] = [
  {
    id: 'panodu',
    name: 'Panodu',
    role: 'Commander',
    accentColor: '#9B59B6',
    state: 'idle',
    message: 'Sipping chai, awaiting directives...',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'wa-gatekeeper',
    name: 'WA-Gatekeeper',
    role: 'Auth Guard',
    accentColor: '#27AE60',
    state: 'idle',
    message: 'Watching the gates...',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'architect-pro',
    name: 'Architect-Pro',
    role: 'System Architect',
    accentColor: '#E67E22',
    state: 'idle',
    message: 'Studying blueprints...',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'auditor-pro',
    name: 'Auditor-Pro',
    role: 'Code Auditor',
    accentColor: '#8E44AD',
    state: 'idle',
    message: 'Reviewing the logs...',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'claude-worker',
    name: 'Claude Worker',
    role: 'AI Engine',
    accentColor: '#17BEBB',
    state: 'idle',
    message: 'Processing in standby...',
    timestamp: new Date().toISOString(),
  },
];

const VALID_IDS = new Set<string>(DEFAULT_AGENTS.map(a => a.id));
const POLL_MS = 5000;

export function useSwarmEvents() {
  const [agents, setAgents] = useState<Agent[]>(DEFAULT_AGENTS);
  const [lastPoll, setLastPoll] = useState<string>('—');

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch('/swarm_events.jsonl?_=' + Date.now());
      if (!res.ok) return;

      const text = await res.text();
      const lines = text.trim().split('\n').filter(Boolean);

      // Build latest-event-per-agent map
      const latest = new Map<string, SwarmEvent>();
      for (const line of lines) {
        try {
          const ev: SwarmEvent = JSON.parse(line);
          if (VALID_IDS.has(ev.agent)) {
            const prev = latest.get(ev.agent);
            if (!prev || new Date(ev.timestamp) > new Date(prev.timestamp)) {
              latest.set(ev.agent, ev);
            }
          }
        } catch {
          // skip malformed lines
        }
      }

      if (latest.size === 0) return;

      setAgents(prev =>
        prev.map(agent => {
          const ev = latest.get(agent.id);
          if (!ev) return agent;
          return {
            ...agent,
            state: ev.state as AgentState,
            message: ev.message,
            timestamp: ev.timestamp,
          };
        })
      );

      setLastPoll(new Date().toLocaleTimeString());
    } catch {
      // network or parse error — keep existing state
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    const iv = setInterval(fetchEvents, POLL_MS);
    return () => clearInterval(iv);
  }, [fetchEvents]);

  return { agents, lastPoll };
}
