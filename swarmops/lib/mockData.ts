import { Agent, AgentLog, LogSeverity, Swarm, Intervention, DashboardMetrics, TokenDataPoint } from '@/types';

export const MOCK_SWARMS: Swarm[] = [
  { id: 'swarm-1', name: 'Research Swarm Alpha', tokenBudget: 500000, tokensUsed: 123450, active: true, killSwitch: false },
  { id: 'swarm-2', name: 'Code Refactor Beta', tokenBudget: 200000, tokensUsed: 89000, active: true, killSwitch: false },
  { id: 'swarm-3', name: 'Data Pipeline Gamma', tokenBudget: 100000, tokensUsed: 98000, active: false, killSwitch: false },
];

export const MOCK_AGENTS: Agent[] = [
  { id: 'agent-001', name: 'main', swarmId: 'swarm-1', status: 'active', tokensUsed: 45200, costUsd: 1.36 },
  { id: 'agent-002', name: 'wa-gatekeeper', swarmId: 'swarm-1', status: 'active', tokensUsed: 38100, costUsd: 1.14 },
  { id: 'agent-003', name: 'architect-pro', swarmId: 'swarm-2', status: 'idle', tokensUsed: 22000, costUsd: 0.66 },
  { id: 'agent-004', name: 'Coder-B2', swarmId: 'swarm-2', status: 'active', tokensUsed: 31000, costUsd: 0.93 },
  { id: 'agent-005', name: 'Pipeline-C1', swarmId: 'swarm-3', status: 'paused', tokensUsed: 49000, costUsd: 1.47 },
];

const SAMPLE_MESSAGES: Record<string, string[]> = {
  thought: [
    'Analyzing the repository structure to identify entry points...',
    'Considering whether to use breadth-first or depth-first traversal...',
    'Evaluating risk level of proposed file deletion...',
    'Cross-referencing tool output with expected schema...',
    'Determining optimal context compression strategy...',
    'Planning sub-agent delegation for parallel research tasks...',
  ],
  action: [
    'Executing tool: read_file("src/index.ts")',
    'Executing tool: web_search("Next.js 15 streaming")',
    'Executing tool: create_file("output/report.md")',
    'Calling sub-agent: summarizer with 12,400 token context',
    'Executing tool: bash("npm run test")',
    'Executing tool: edit_file("app/layout.tsx", patch)',
  ],
  info: [
    'Task checkpoint reached. 3/7 subtasks complete.',
    'Budget check: 45,200 / 500,000 tokens used.',
    'Handoff to peer agent completed successfully.',
    'Context compressed. Saved 8,000 tokens.',
    'Cache hit: reusing prior tool result.',
    'Sub-agent returned with 2,400 token response.',
  ],
  error: [
    'Tool call failed: API rate limit exceeded.',
    'Hallucination detected: file path does not exist.',
    'Context window exceeded. Truncating oldest messages.',
    'Sub-agent timed out after 30s. Retrying...',
  ],
};

let logCounter = 0;
export function generateLog(agentId?: string, swarmId?: string): AgentLog {
  const agent = MOCK_AGENTS[Math.floor(Math.random() * MOCK_AGENTS.length)];
  const severities: LogSeverity[] = ['info', 'action', 'thought', 'error'];
  const weights = [0.35, 0.35, 0.20, 0.10];
  const rand = Math.random();
  let cumulative = 0;
  let severity: LogSeverity = severities[0];
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (rand < cumulative) { severity = severities[i]; break; }
  }
  const messages = SAMPLE_MESSAGES[severity];
  return {
    id: `log-${++logCounter}-${Date.now()}`,
    agentId: agentId || agent.id,
    swarmId: swarmId || agent.swarmId,
    severity,
    message: messages[Math.floor(Math.random() * messages.length)],
    timestamp: Date.now(),
  };
}

export function generateInitialLogs(): AgentLog[] {
  return Array.from({ length: 50 }, (_, i) => ({
    ...generateLog(),
    timestamp: Date.now() - (50 - i) * 3000,
  }));
}

export const MOCK_INTERVENTIONS: Intervention[] = [
  {
    id: 'int-001', agentId: 'agent-001', agentName: 'main', swarmId: 'swarm-1',
    pendingAction: 'delete_file("data/archive/2023-backup.tar.gz")',
    description: 'Agent wants to free disk space by deleting a backup archive. This action is irreversible.',
    riskLevel: 'high', timestamp: Date.now() - 120000,
  },
  {
    id: 'int-002', agentId: 'agent-004', agentName: 'Coder-B2', swarmId: 'swarm-2',
    pendingAction: 'execute_bash("git push --force origin main")',
    description: 'Agent attempting force push to main branch after resolving merge conflict.',
    riskLevel: 'high', timestamp: Date.now() - 45000,
  },
  {
    id: 'int-003', agentId: 'agent-003', agentName: 'architect-pro', swarmId: 'swarm-2',
    pendingAction: 'api_call("POST /payments/transfer", { amount: 49.99 })',
    description: 'Agent requesting a payment transfer as part of automated billing workflow.',
    riskLevel: 'medium', timestamp: Date.now() - 10000,
  },
];

export function generateTokenHistory(): TokenDataPoint[] {
  const now = new Date();
  return Array.from({ length: 24 }, (_, i) => {
    const h = new Date(now.getTime() - (23 - i) * 3600000);
    const hour = h.toLocaleTimeString('en-US', { hour: '2-digit', hour12: false });
    return { hour, tokens: Math.floor(5000 + Math.random() * 20000) };
  });
}

export const INITIAL_METRICS: DashboardMetrics = {
  totalTokensToday: 248750,
  totalTokensMonth: 3_412_000,
  totalCostToday: 7.46,
  activeAgents: 3,
  activeSwarms: 2,
  tokenBurnHistory: generateTokenHistory(),
};
