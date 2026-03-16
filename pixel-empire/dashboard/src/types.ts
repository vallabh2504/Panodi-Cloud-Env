export type AgentState = 'idle' | 'working' | 'alert';

export type AgentId =
  | 'panodu'
  | 'wa-gatekeeper'
  | 'architect-pro'
  | 'auditor-pro'
  | 'claude-worker';

export interface Agent {
  id: AgentId;
  name: string;
  role: string;
  accentColor: string;
  state: AgentState;
  message: string;
  timestamp: string;
}

export interface SwarmEvent {
  agent: string;
  state: AgentState;
  message: string;
  timestamp: string;
}
