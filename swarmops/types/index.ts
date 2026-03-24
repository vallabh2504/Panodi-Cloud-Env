export type LogSeverity = 'info' | 'action' | 'thought' | 'error';

export interface AgentLog {
  id: string;
  agentId: string;
  swarmId: string;
  severity: LogSeverity;
  message: string;
  timestamp: number;
}

export interface Agent {
  id: string;
  name: string;
  swarmId: string;
  status: 'active' | 'idle' | 'paused' | 'error';
  tokensUsed: number;
  costUsd: number;
}

export interface Swarm {
  id: string;
  name: string;
  tokenBudget: number;
  tokensUsed: number;
  active: boolean;
  killSwitch: boolean;
}

export interface Intervention {
  id: string;
  agentId: string;
  agentName: string;
  swarmId: string;
  pendingAction: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  timestamp: number;
}

export interface TokenDataPoint {
  hour: string;
  tokens: number;
}

export interface DashboardMetrics {
  totalTokensToday: number;
  totalTokensMonth: number;
  totalCostToday: number;
  activeAgents: number;
  activeSwarms: number;
  tokenBurnHistory: TokenDataPoint[];
}
