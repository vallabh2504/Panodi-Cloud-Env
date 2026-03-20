import { create } from 'zustand';
import { Agent, AgentLog, Swarm, Intervention, DashboardMetrics } from '@/types';
import {
  MOCK_SWARMS, MOCK_INTERVENTIONS, INITIAL_METRICS, generateInitialLogs,
} from '@/lib/mockData';

const MAX_LOGS = 200;

interface SwarmState {
  agents: Agent[];
  swarms: Swarm[];
  logs: AgentLog[];
  interventions: Intervention[];
  metrics: DashboardMetrics;
  logFilter: { agentId: string; swarmId: string; severity: string };
  pushLog: (log: AgentLog) => void;
  approveIntervention: (id: string, guidance: string) => void;
  rejectIntervention: (id: string) => void;
  setSwarmKillSwitch: (swarmId: string, value: boolean) => void;
  setSwarmActive: (swarmId: string, value: boolean) => void;
  setSwarmBudget: (swarmId: string, budget: number) => void;
  setAgents: (agents: Agent[]) => void;
  setLogFilter: (filter: Partial<SwarmState['logFilter']>) => void;
  updateMetric: (delta: { tokens: number; cost: number }) => void;
  setMetrics: (metrics: Partial<DashboardMetrics>) => void;
}

export const useSwarmStore = create<SwarmState>((set, get) => ({
  agents: [],
  swarms: MOCK_SWARMS,
  logs: generateInitialLogs(),
  interventions: MOCK_INTERVENTIONS,
  metrics: INITIAL_METRICS,
  logFilter: { agentId: '', swarmId: '', severity: '' },

  pushLog: (log) =>
    set((s) => ({ logs: [log, ...s.logs].slice(0, MAX_LOGS) })),

  approveIntervention: (id, guidance) => {
    const iv = get().interventions.find((i) => i.id === id);
    set((s) => ({
      interventions: s.interventions.filter((i) => i.id !== id),
      logs: [
        {
          id: `log-approved-${id}-${Date.now()}`,
          agentId: iv?.agentId || '',
          swarmId: iv?.swarmId || '',
          severity: 'action' as const,
          message: `[APPROVED] Human override: "${guidance || 'Proceed as planned.'}"`,
          timestamp: Date.now(),
        },
        ...s.logs,
      ].slice(0, MAX_LOGS),
    }));
  },

  rejectIntervention: (id) => {
    const iv = get().interventions.find((i) => i.id === id);
    set((s) => ({
      interventions: s.interventions.filter((i) => i.id !== id),
      logs: [
        {
          id: `log-rejected-${id}-${Date.now()}`,
          agentId: iv?.agentId || '',
          swarmId: iv?.swarmId || '',
          severity: 'error' as const,
          message: `[REJECTED] Human intervention: action blocked by operator.`,
          timestamp: Date.now(),
        },
        ...s.logs,
      ].slice(0, MAX_LOGS),
    }));
  },

  setSwarmKillSwitch: (swarmId, value) =>
    set((s) => ({
      swarms: s.swarms.map((sw) => (sw.id === swarmId ? { ...sw, killSwitch: value } : sw)),
    })),

  setSwarmActive: (swarmId, value) =>
    set((s) => ({
      swarms: s.swarms.map((sw) => (sw.id === swarmId ? { ...sw, active: value } : sw)),
    })),

  setSwarmBudget: (swarmId, budget) =>
    set((s) => ({
      swarms: s.swarms.map((sw) => (sw.id === swarmId ? { ...sw, tokenBudget: budget } : sw)),
    })),

  setAgents: (agents) => set({ agents }),

  setLogFilter: (filter) =>
    set((s) => ({ logFilter: { ...s.logFilter, ...filter } })),

  updateMetric: ({ tokens, cost }) =>
    set((s) => ({
      metrics: {
        ...s.metrics,
        totalTokensToday: s.metrics.totalTokensToday + tokens,
        totalCostToday: parseFloat((s.metrics.totalCostToday + cost).toFixed(4)),
      },
    })),

  setMetrics: (metrics) =>
    set((s) => ({ metrics: { ...s.metrics, ...metrics } })),
}));
