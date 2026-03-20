# SwarmOps Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js 15 + Tailwind v4 multi-component dashboard for monitoring and controlling autonomous AI agent swarms, with real-time simulated telemetry data.

**Architecture:** App Router layout with a persistent sidebar; global Zustand store drives all live data (logs, metrics, agent states); a layout-level `useEffect` pushes simulated events every second to create a live feel. Each major view is a route segment under `/dashboard`, `/agents`, `/interventions`, and `/settings`.

**Tech Stack:** Next.js 15 (App Router, React 19), Tailwind CSS v4, Zustand, Recharts, Lucide React, TypeScript

---

## File Structure

```
genesis-app-v2/
├── app/
│   ├── layout.tsx                  # Root layout (sidebar + main area)
│   ├── page.tsx                    # Redirect to /dashboard
│   ├── dashboard/
│   │   └── page.tsx                # Dashboard view - stats + chart
│   ├── agents/
│   │   └── page.tsx                # Agent Activity Feed
│   ├── interventions/
│   │   └── page.tsx                # Human-in-the-Loop Panel
│   └── settings/
│       └── page.tsx                # Swarm Config / Settings
├── components/
│   ├── Sidebar.tsx                 # Nav sidebar
│   ├── StatsCard.tsx               # Single stat card (agents/cost/tokens)
│   ├── TokenBurnChart.tsx          # Recharts line chart
│   ├── LogFeed.tsx                 # Scrolling log list
│   ├── LogEntry.tsx                # Single log row
│   ├── InterventionCard.tsx        # Paused agent awaiting approval
│   └── SwarmConfigRow.tsx          # Per-swarm budget/toggle row
├── store/
│   └── swarmStore.ts               # Zustand store (agents, logs, metrics, interventions)
├── lib/
│   ├── mockData.ts                 # Initial mock data factories
│   └── simulator.ts                # Interval simulation logic (exported hook)
└── types/
    └── index.ts                    # Shared TypeScript types
```

---

### Task 1: Bootstrap Next.js 15 Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `tailwind.config.ts`, `postcss.config.mjs`

- [ ] **Step 1: Bootstrap the Next.js 15 app with TypeScript and Tailwind v4**

```bash
cd /root/.openclaw/workspace/Panodi-Cloud-Env/rendinti-factory/genesis-app-v2
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=no --import-alias="@/*" --yes
```

Expected: Project files created, including `package.json`, `app/`, `public/`, etc.

- [ ] **Step 2: Install additional dependencies**

```bash
npm install zustand recharts lucide-react
npm install --save-dev @types/node
```

- [ ] **Step 3: Verify dev server starts**

```bash
npm run build 2>&1 | tail -20
```

Expected: Build succeeds with no errors.

- [ ] **Step 4: Clean up default Next.js boilerplate**

Replace `app/globals.css` with minimal Tailwind directives. Clear `app/page.tsx` to a simple redirect.

- [ ] **Step 5: Commit**

```bash
git init
git add .
git commit -m "feat: bootstrap Next.js 15 + Tailwind v4 project"
```

---

### Task 2: Define Types and Mock Data

**Files:**
- Create: `types/index.ts`
- Create: `lib/mockData.ts`

- [ ] **Step 1: Write shared TypeScript types**

Create `types/index.ts`:

```typescript
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
```

- [ ] **Step 2: Write mock data factories**

Create `lib/mockData.ts` with realistic initial data for agents, swarms, logs, interventions, and metrics.

```typescript
import { Agent, AgentLog, Swarm, Intervention, DashboardMetrics, TokenDataPoint } from '@/types';

export const MOCK_SWARMS: Swarm[] = [
  { id: 'swarm-1', name: 'Research Swarm Alpha', tokenBudget: 500000, tokensUsed: 123450, active: true, killSwitch: false },
  { id: 'swarm-2', name: 'Code Refactor Beta', tokenBudget: 200000, tokensUsed: 89000, active: true, killSwitch: false },
  { id: 'swarm-3', name: 'Data Pipeline Gamma', tokenBudget: 100000, tokensUsed: 98000, active: false, killSwitch: false },
];

export const MOCK_AGENTS: Agent[] = [
  { id: 'agent-001', name: 'Researcher-A1', swarmId: 'swarm-1', status: 'active', tokensUsed: 45200, costUsd: 1.36 },
  { id: 'agent-002', name: 'Researcher-A2', swarmId: 'swarm-1', status: 'active', tokensUsed: 38100, costUsd: 1.14 },
  { id: 'agent-003', name: 'Coder-B1', swarmId: 'swarm-2', status: 'idle', tokensUsed: 22000, costUsd: 0.66 },
  { id: 'agent-004', name: 'Coder-B2', swarmId: 'swarm-2', status: 'active', tokensUsed: 31000, costUsd: 0.93 },
  { id: 'agent-005', name: 'Pipeline-C1', swarmId: 'swarm-3', status: 'paused', tokensUsed: 49000, costUsd: 1.47 },
];

const SAMPLE_MESSAGES: Record<string, string[]> = {
  thought: [
    'Analyzing the repository structure to identify entry points...',
    'Considering whether to use breadth-first or depth-first traversal...',
    'Evaluating risk level of proposed file deletion...',
    'Cross-referencing tool output with expected schema...',
  ],
  action: [
    'Executing tool: read_file("src/index.ts")',
    'Executing tool: web_search("Next.js 15 streaming")',
    'Executing tool: create_file("output/report.md")',
    'Calling sub-agent: summarizer with 12,400 token context',
  ],
  info: [
    'Task checkpoint reached. 3/7 subtasks complete.',
    'Budget check: 45,200 / 500,000 tokens used.',
    'Handoff to peer agent completed successfully.',
    'Context compressed. Saved 8,000 tokens.',
  ],
  error: [
    'Tool call failed: API rate limit exceeded.',
    'Hallucination detected: file path does not exist.',
    'Context window exceeded. Truncating oldest messages.',
  ],
};

let logCounter = 0;
export function generateLog(agentId?: string, swarmId?: string): AgentLog {
  const agent = MOCK_AGENTS[Math.floor(Math.random() * MOCK_AGENTS.length)];
  const severities = ['info', 'action', 'thought', 'error'] as const;
  const weights = [0.35, 0.35, 0.20, 0.10];
  const rand = Math.random();
  let cumulative = 0;
  let severity = severities[0];
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
  return Array.from({ length: 50 }, () => generateLog());
}

export const MOCK_INTERVENTIONS: Intervention[] = [
  {
    id: 'int-001', agentId: 'agent-001', agentName: 'Researcher-A1', swarmId: 'swarm-1',
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
    id: 'int-003', agentId: 'agent-003', agentName: 'Coder-B1', swarmId: 'swarm-2',
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
```

- [ ] **Step 3: Commit**

```bash
git add types/ lib/mockData.ts
git commit -m "feat: add types and mock data factories"
```

---

### Task 3: Zustand Store

**Files:**
- Create: `store/swarmStore.ts`

- [ ] **Step 1: Implement the Zustand store**

Create `store/swarmStore.ts`:

```typescript
import { create } from 'zustand';
import { Agent, AgentLog, Swarm, Intervention, DashboardMetrics } from '@/types';
import {
  MOCK_AGENTS, MOCK_SWARMS, MOCK_INTERVENTIONS, INITIAL_METRICS, generateInitialLogs,
} from '@/lib/mockData';

const MAX_LOGS = 200;

interface SwarmState {
  agents: Agent[];
  swarms: Swarm[];
  logs: AgentLog[];
  interventions: Intervention[];
  metrics: DashboardMetrics;
  logFilter: { agentId: string; swarmId: string; severity: string };
  // Actions
  pushLog: (log: AgentLog) => void;
  approveIntervention: (id: string, guidance: string) => void;
  rejectIntervention: (id: string) => void;
  setSwarmKillSwitch: (swarmId: string, value: boolean) => void;
  setSwarmActive: (swarmId: string, value: boolean) => void;
  setSwarmBudget: (swarmId: string, budget: number) => void;
  setLogFilter: (filter: Partial<SwarmState['logFilter']>) => void;
  updateMetric: (delta: { tokens: number; cost: number }) => void;
}

export const useSwarmStore = create<SwarmState>((set) => ({
  agents: MOCK_AGENTS,
  swarms: MOCK_SWARMS,
  logs: generateInitialLogs(),
  interventions: MOCK_INTERVENTIONS,
  metrics: INITIAL_METRICS,
  logFilter: { agentId: '', swarmId: '', severity: '' },

  pushLog: (log) =>
    set((s) => ({ logs: [log, ...s.logs].slice(0, MAX_LOGS) })),

  approveIntervention: (id, guidance) =>
    set((s) => ({
      interventions: s.interventions.filter((i) => i.id !== id),
      logs: [
        {
          id: `log-approved-${id}`,
          agentId: s.interventions.find((i) => i.id === id)?.agentId || '',
          swarmId: s.interventions.find((i) => i.id === id)?.swarmId || '',
          severity: 'action',
          message: `[APPROVED] Human override: "${guidance || 'Proceed as planned.'}"`,
          timestamp: Date.now(),
        },
        ...s.logs,
      ].slice(0, MAX_LOGS),
    })),

  rejectIntervention: (id) =>
    set((s) => ({
      interventions: s.interventions.filter((i) => i.id !== id),
      logs: [
        {
          id: `log-rejected-${id}`,
          agentId: s.interventions.find((i) => i.id === id)?.agentId || '',
          swarmId: s.interventions.find((i) => i.id === id)?.swarmId || '',
          severity: 'error',
          message: `[REJECTED] Human intervention: action blocked.`,
          timestamp: Date.now(),
        },
        ...s.logs,
      ].slice(0, MAX_LOGS),
    })),

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
}));
```

- [ ] **Step 2: Commit**

```bash
git add store/swarmStore.ts
git commit -m "feat: implement Zustand swarm store with full state + actions"
```

---

### Task 4: Simulator Hook

**Files:**
- Create: `lib/simulator.ts`

- [ ] **Step 1: Implement the simulator hook**

Create `lib/simulator.ts`:

```typescript
'use client';
import { useEffect } from 'react';
import { useSwarmStore } from '@/store/swarmStore';
import { generateLog } from '@/lib/mockData';

export function useSwarmSimulator() {
  const pushLog = useSwarmStore((s) => s.pushLog);
  const updateMetric = useSwarmStore((s) => s.updateMetric);

  useEffect(() => {
    const interval = setInterval(() => {
      const log = generateLog();
      pushLog(log);
      // Simulate token burn per tick
      const tokenDelta = Math.floor(50 + Math.random() * 300);
      updateMetric({ tokens: tokenDelta, cost: parseFloat((tokenDelta * 0.000003).toFixed(6)) });
    }, 1200);

    return () => clearInterval(interval);
  }, [pushLog, updateMetric]);
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/simulator.ts
git commit -m "feat: add swarm simulator hook for live telemetry"
```

---

### Task 5: Layout and Sidebar

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Create: `components/Sidebar.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create Sidebar component**

Create `components/Sidebar.tsx`:

```tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Bot, ShieldAlert, Settings, Zap } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/agents', label: 'Agents', icon: Bot },
  { href: '/interventions', label: 'Interventions', icon: ShieldAlert },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-64 h-screen bg-gray-950 border-r border-gray-800 shrink-0">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-800">
        <Zap className="text-violet-400" size={22} />
        <span className="text-white font-bold text-lg tracking-tight">SwarmOps</span>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-violet-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 py-4 border-t border-gray-800">
        <p className="text-xs text-gray-600">v0.1.0 · fine-clownfish-749</p>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Update root layout**

Update `app/layout.tsx` to include the Sidebar, simulator hook, and dark background:

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import SimulatorProvider from '@/components/SimulatorProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SwarmOps Dashboard',
  description: 'Real-time AI agent swarm monitoring and control',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-gray-100 min-h-screen`}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <SimulatorProvider />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Create SimulatorProvider client component**

Create `components/SimulatorProvider.tsx`:

```tsx
'use client';
import { useSwarmSimulator } from '@/lib/simulator';

export default function SimulatorProvider() {
  useSwarmSimulator();
  return null;
}
```

- [ ] **Step 4: Update app/page.tsx to redirect to /dashboard**

```tsx
import { redirect } from 'next/navigation';
export default function Home() {
  redirect('/dashboard');
}
```

- [ ] **Step 5: Update globals.css**

```css
@import "tailwindcss";
```

- [ ] **Step 6: Commit**

```bash
git add app/ components/Sidebar.tsx components/SimulatorProvider.tsx
git commit -m "feat: add layout, sidebar, and simulator provider"
```

---

### Task 6: StatsCard and TokenBurnChart Components

**Files:**
- Create: `components/StatsCard.tsx`
- Create: `components/TokenBurnChart.tsx`

- [ ] **Step 1: Create StatsCard**

Create `components/StatsCard.tsx`:

```tsx
import { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export default function StatsCard({ title, value, subtitle, icon: Icon, iconColor = 'text-violet-400', trend }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400 font-medium">{title}</span>
        <div className={`p-2 rounded-lg bg-gray-800 ${iconColor}`}>
          <Icon size={16} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create TokenBurnChart**

Create `components/TokenBurnChart.tsx`:

```tsx
'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TokenDataPoint } from '@/types';

interface Props {
  data: TokenDataPoint[];
}

export default function TokenBurnChart({ data }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="text-sm font-medium text-gray-400 mb-4">Token Burn Rate (Last 24h)</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="hour" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} interval={3} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
            labelStyle={{ color: '#9ca3af' }}
            itemStyle={{ color: '#a78bfa' }}
            formatter={(v: number) => [`${v.toLocaleString()} tokens`, 'Burn']}
          />
          <Line type="monotone" dataKey="tokens" stroke="#7c3aed" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#a78bfa' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/StatsCard.tsx components/TokenBurnChart.tsx
git commit -m "feat: add StatsCard and TokenBurnChart components"
```

---

### Task 7: Dashboard Page

**Files:**
- Create: `app/dashboard/page.tsx`

- [ ] **Step 1: Implement Dashboard page**

Create `app/dashboard/page.tsx`:

```tsx
'use client';
import { useSwarmStore } from '@/store/swarmStore';
import StatsCard from '@/components/StatsCard';
import TokenBurnChart from '@/components/TokenBurnChart';
import { Bot, DollarSign, Zap, Layers } from 'lucide-react';

export default function DashboardPage() {
  const metrics = useSwarmStore((s) => s.metrics);
  const interventions = useSwarmStore((s) => s.interventions);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Control Plane</h1>
        <p className="text-gray-400 text-sm mt-1">Real-time overview of all active swarms and agents.</p>
      </div>

      {interventions.length > 0 && (
        <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-4 flex items-center gap-3">
          <span className="text-amber-400 font-semibold text-sm">
            ⚠ {interventions.length} intervention{interventions.length > 1 ? 's' : ''} require your attention.
          </span>
          <a href="/interventions" className="text-amber-300 underline text-sm hover:text-amber-200">Review now →</a>
        </div>
      )}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Active Agents"
          value={metrics.activeAgents}
          subtitle={`Across ${metrics.activeSwarms} swarms`}
          icon={Bot}
          iconColor="text-green-400"
        />
        <StatsCard
          title="Tokens Today"
          value={metrics.totalTokensToday.toLocaleString()}
          subtitle="Cumulative token usage"
          icon={Zap}
          iconColor="text-violet-400"
        />
        <StatsCard
          title="Monthly Tokens"
          value={`${(metrics.totalTokensMonth / 1_000_000).toFixed(2)}M`}
          subtitle="Rolling 30-day total"
          icon={Layers}
          iconColor="text-blue-400"
        />
        <StatsCard
          title="Cost Today"
          value={`$${metrics.totalCostToday.toFixed(2)}`}
          subtitle="Estimated API cost"
          icon={DollarSign}
          iconColor="text-emerald-400"
        />
      </div>

      <TokenBurnChart data={metrics.tokenBurnHistory} />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/dashboard/
git commit -m "feat: implement dashboard view with stats and token burn chart"
```

---

### Task 8: Agent Activity Feed

**Files:**
- Create: `components/LogEntry.tsx`
- Create: `components/LogFeed.tsx`
- Create: `app/agents/page.tsx`

- [ ] **Step 1: Create LogEntry component**

Create `components/LogEntry.tsx`:

```tsx
import { AgentLog } from '@/types';

const SEVERITY_STYLES: Record<AgentLog['severity'], string> = {
  info:    'text-blue-400  bg-blue-900/20  border-blue-800/40',
  action:  'text-green-400 bg-green-900/20 border-green-800/40',
  thought: 'text-violet-400 bg-violet-900/20 border-violet-800/40',
  error:   'text-red-400   bg-red-900/20   border-red-800/40',
};

const SEVERITY_LABELS: Record<AgentLog['severity'], string> = {
  info: 'INFO', action: 'ACT', thought: 'THT', error: 'ERR',
};

interface Props { log: AgentLog; }

export default function LogEntry({ log }: Props) {
  const styles = SEVERITY_STYLES[log.severity];
  const time = new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className={`flex items-start gap-3 px-3 py-2 rounded-lg border ${styles} font-mono text-xs`}>
      <span className="shrink-0 opacity-60">{time}</span>
      <span className={`shrink-0 font-bold w-8`}>{SEVERITY_LABELS[log.severity]}</span>
      <span className="shrink-0 text-gray-500">[{log.agentId}]</span>
      <span className="flex-1 break-all">{log.message}</span>
    </div>
  );
}
```

- [ ] **Step 2: Create LogFeed component**

Create `components/LogFeed.tsx`:

```tsx
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
      <div className="flex flex-wrap gap-2">
        <select
          value={filter.agentId}
          onChange={(e) => setLogFilter({ agentId: e.target.value })}
          className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-3 py-2 focus:ring-violet-500 focus:border-violet-500"
          aria-label="Filter by agent"
        >
          <option value="">All Agents</option>
          {MOCK_AGENTS.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <select
          value={filter.swarmId}
          onChange={(e) => setLogFilter({ swarmId: e.target.value })}
          className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-3 py-2"
          aria-label="Filter by swarm"
        >
          <option value="">All Swarms</option>
          {MOCK_SWARMS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select
          value={filter.severity}
          onChange={(e) => setLogFilter({ severity: e.target.value })}
          className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-3 py-2"
          aria-label="Filter by severity"
        >
          <option value="">All Severities</option>
          {SEVERITIES.map((s) => <option key={s} value={s}>{s.toUpperCase()}</option>)}
        </select>
        <span className="ml-auto text-xs text-gray-500 self-center">{filtered.length} entries</span>
      </div>
      {/* Log list */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1" aria-label="Agent activity feed" aria-live="polite" aria-atomic="false">
        {filtered.map((log) => <LogEntry key={log.id} log={log} />)}
        {filtered.length === 0 && (
          <p className="text-center text-gray-600 text-sm py-10">No logs match current filters.</p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create Agents page**

Create `app/agents/page.tsx`:

```tsx
import LogFeed from '@/components/LogFeed';

export default function AgentsPage() {
  return (
    <div className="p-6 flex flex-col h-full gap-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Agent Activity Feed</h1>
        <p className="text-gray-400 text-sm mt-1">Live stream of all agent thoughts, actions, and errors.</p>
      </div>
      <div className="flex-1 min-h-0">
        <LogFeed />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add components/LogEntry.tsx components/LogFeed.tsx app/agents/
git commit -m "feat: implement agent activity feed with real-time logs and filters"
```

---

### Task 9: Human-in-the-Loop Intervention Panel

**Files:**
- Create: `components/InterventionCard.tsx`
- Create: `app/interventions/page.tsx`

- [ ] **Step 1: Create InterventionCard component**

Create `components/InterventionCard.tsx`:

```tsx
'use client';
import { useState } from 'react';
import { Intervention } from '@/types';
import { useSwarmStore } from '@/store/swarmStore';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const RISK_STYLES = {
  low:    'text-blue-400  border-blue-800  bg-blue-900/10',
  medium: 'text-amber-400 border-amber-800 bg-amber-900/10',
  high:   'text-red-400   border-red-800   bg-red-900/10',
};

interface Props { intervention: Intervention; }

export default function InterventionCard({ intervention: iv }: Props) {
  const [guidance, setGuidance] = useState('');
  const approveIntervention = useSwarmStore((s) => s.approveIntervention);
  const rejectIntervention = useSwarmStore((s) => s.rejectIntervention);

  return (
    <div className={`rounded-xl border p-5 space-y-4 ${RISK_STYLES[iv.riskLevel]}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={16} className={iv.riskLevel === 'high' ? 'text-red-400' : 'text-amber-400'} />
            <span className="font-semibold text-white text-sm">{iv.agentName}</span>
            <span className="text-xs text-gray-500">· {iv.swarmId}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${RISK_STYLES[iv.riskLevel]}`}>
              {iv.riskLevel.toUpperCase()} RISK
            </span>
          </div>
          <p className="text-xs text-gray-400">{iv.description}</p>
        </div>
        <span className="text-xs text-gray-600 shrink-0">
          {new Date(iv.timestamp).toLocaleTimeString()}
        </span>
      </div>

      <div className="bg-gray-950 border border-gray-800 rounded-lg p-3 font-mono text-xs text-green-400">
        <span className="text-gray-600 mr-2">$</span>{iv.pendingAction}
      </div>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="Optional: provide corrected guidance for agent..."
          value={guidance}
          onChange={(e) => setGuidance(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:ring-1 focus:ring-violet-500 focus:border-violet-500 outline-none"
          aria-label="Guidance for agent"
        />
        <div className="flex gap-3">
          <button
            onClick={() => approveIntervention(iv.id, guidance)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-700 hover:bg-green-600 text-white text-sm font-medium transition-colors"
            aria-label={`Approve action for ${iv.agentName}`}
          >
            <CheckCircle size={15} /> Approve
          </button>
          <button
            onClick={() => rejectIntervention(iv.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-800 hover:bg-red-700 text-white text-sm font-medium transition-colors"
            aria-label={`Reject action for ${iv.agentName}`}
          >
            <XCircle size={15} /> Reject
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create Interventions page**

Create `app/interventions/page.tsx`:

```tsx
'use client';
import { useSwarmStore } from '@/store/swarmStore';
import InterventionCard from '@/components/InterventionCard';
import { ShieldCheck } from 'lucide-react';

export default function InterventionsPage() {
  const interventions = useSwarmStore((s) => s.interventions);

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Human-in-the-Loop</h1>
        <p className="text-gray-400 text-sm mt-1">Agents paused and awaiting your approval before executing risky actions.</p>
      </div>

      {interventions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-600">
          <ShieldCheck size={40} />
          <p className="text-sm">No pending interventions. All agents are running autonomously.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {interventions.map((iv) => <InterventionCard key={iv.id} intervention={iv} />)}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/InterventionCard.tsx app/interventions/
git commit -m "feat: implement human-in-the-loop intervention panel"
```

---

### Task 10: Swarm Configuration (Settings)

**Files:**
- Create: `components/SwarmConfigRow.tsx`
- Create: `app/settings/page.tsx`

- [ ] **Step 1: Create SwarmConfigRow component**

Create `components/SwarmConfigRow.tsx`:

```tsx
'use client';
import { useState } from 'react';
import { Swarm } from '@/types';
import { useSwarmStore } from '@/store/swarmStore';

interface Props { swarm: Swarm; }

export default function SwarmConfigRow({ swarm }: Props) {
  const { setSwarmActive, setSwarmKillSwitch, setSwarmBudget } = useSwarmStore((s) => ({
    setSwarmActive: s.setSwarmActive,
    setSwarmKillSwitch: s.setSwarmKillSwitch,
    setSwarmBudget: s.setSwarmBudget,
  }));
  const [budget, setBudget] = useState(swarm.tokenBudget.toString());

  const budgetPct = Math.min(100, (swarm.tokensUsed / swarm.tokenBudget) * 100);
  const barColor = budgetPct > 90 ? 'bg-red-500' : budgetPct > 70 ? 'bg-amber-500' : 'bg-violet-500';

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-sm">{swarm.name}</h3>
          <p className="text-xs text-gray-500">{swarm.id}</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Active toggle */}
          <label className="flex items-center gap-2 cursor-pointer" aria-label={`Toggle ${swarm.name} active`}>
            <span className="text-xs text-gray-400">Active</span>
            <button
              role="switch"
              aria-checked={swarm.active}
              onClick={() => setSwarmActive(swarm.id, !swarm.active)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${swarm.active ? 'bg-violet-600' : 'bg-gray-700'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${swarm.active ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </label>
          {/* Kill switch */}
          <label className="flex items-center gap-2 cursor-pointer" aria-label={`Kill switch for ${swarm.name}`}>
            <span className="text-xs text-red-400 font-medium">Kill Switch</span>
            <button
              role="switch"
              aria-checked={swarm.killSwitch}
              onClick={() => setSwarmKillSwitch(swarm.id, !swarm.killSwitch)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${swarm.killSwitch ? 'bg-red-600' : 'bg-gray-700'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${swarm.killSwitch ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </label>
        </div>
      </div>

      {/* Budget */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Token Budget</span>
          <span>{swarm.tokensUsed.toLocaleString()} / {swarm.tokenBudget.toLocaleString()}</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${budgetPct}%` }} />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-200 text-xs rounded-lg px-3 py-1.5 w-36 focus:ring-1 focus:ring-violet-500 outline-none"
            aria-label={`Token budget for ${swarm.name}`}
          />
          <button
            onClick={() => { const v = parseInt(budget); if (!isNaN(v) && v > 0) setSwarmBudget(swarm.id, v); }}
            className="text-xs px-3 py-1.5 bg-violet-700 hover:bg-violet-600 text-white rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create Settings page**

Create `app/settings/page.tsx`:

```tsx
'use client';
import { useSwarmStore } from '@/store/swarmStore';
import SwarmConfigRow from '@/components/SwarmConfigRow';

export default function SettingsPage() {
  const swarms = useSwarmStore((s) => s.swarms);

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Swarm Configuration</h1>
        <p className="text-gray-400 text-sm mt-1">Manage budgets, activation, and kill switches per swarm.</p>
      </div>
      <div className="space-y-4">
        {swarms.map((swarm) => <SwarmConfigRow key={swarm.id} swarm={swarm} />)}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/SwarmConfigRow.tsx app/settings/
git commit -m "feat: implement swarm configuration settings page"
```

---

### Task 11: Final Build Verification and Push to GitHub

- [ ] **Step 1: Run production build**

```bash
npm run build 2>&1
```

Expected: `Route (app)` table shows all 5 routes. No TypeScript or build errors.

- [ ] **Step 2: Fix any build errors before proceeding**

Common issues: missing `'use client'` directives, recharts SSR, incorrect imports.

- [ ] **Step 3: Set up GitHub remote and push**

```bash
git remote add origin https://github.com/Vallabh2504/Panodi-Cloud-Env.git
git branch -M main
git push -u origin main
```

- [ ] **Step 4: Confirm push succeeded**

```bash
git log --oneline -10
```

---
