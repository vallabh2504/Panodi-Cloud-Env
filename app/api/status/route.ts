export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Agent } from '@/types';

const execAsync = promisify(exec);

const mockStatus = {
  "os": {
    "platform": "linux",
    "arch": "x64",
    "release": "6.8.0-94-generic",
    "label": "linux 6.8.0-94-generic (x64)"
  },
  "agents": {
    "defaultId": "main",
    "agents": [
      {
        "id": "main",
        "workspaceDir": "/root/.openclaw/workspace",
        "bootstrapPending": false,
        "sessionsPath": "/root/.openclaw/agents/main/sessions/sessions.json",
        "sessionsCount": 25,
        "lastUpdatedAt": 1774004222309,
        "lastActiveAgeMs": 37192
      },
      {
        "id": "architect-pro",
        "name": "System Architect",
        "workspaceDir": "/root/.openclaw/workspace",
        "bootstrapPending": false,
        "sessionsPath": "/root/.openclaw/agents/architect-pro/sessions/sessions.json",
        "sessionsCount": 2,
        "lastUpdatedAt": 1772023175695,
        "lastActiveAgeMs": 1981083806
      },
      {
        "id": "auditor-pro",
        "name": "Chief Auditor",
        "workspaceDir": "/root/.openclaw/workspace",
        "bootstrapPending": false,
        "sessionsPath": "/root/.openclaw/agents/auditor-pro/sessions/sessions.json",
        "sessionsCount": 2,
        "lastUpdatedAt": 1774004217642,
        "lastActiveAgeMs": 41859
      },
      {
        "id": "wa-gatekeeper",
        "name": "WhatsApp Gatekeeper",
        "workspaceDir": "/root/.openclaw/workspace-wa",
        "bootstrapPending": true,
        "sessionsPath": "/root/.openclaw/agents/wa-gatekeeper/sessions/sessions.json",
        "sessionsCount": 18,
        "lastUpdatedAt": 1773999350351,
        "lastActiveAgeMs": 4909150
      }
    ],
    "totalSessions": 47,
    "bootstrapPendingCount": 2
  }
};

export async function GET() {
  let status = mockStatus;
  try {
    const { stdout } = await execAsync('openclaw status --json', { timeout: 5000 });
    status = JSON.parse(stdout);
  } catch (error) {
    // Fallback to mock status if openclaw is not available (e.g. on Vercel)
  }

  const openclawAgents = status.agents?.agents || [];
  
  const mappedAgents: Agent[] = openclawAgents.map((a: any) => {
    const isIdle = a.lastActiveAgeMs === null || a.lastActiveAgeMs > 60000;
    return {
      id: a.id,
      name: a.name || a.id,
      swarmId: 'swarm-1',
      status: a.bootstrapPending ? 'paused' : (isIdle ? 'idle' : 'active'),
      tokensUsed: (a.sessionsCount || 0) * 1500,
      costUsd: parseFloat(((a.sessionsCount || 0) * 0.05).toFixed(2))
    };
  });

  return NextResponse.json({
    ...status,
    agents: mappedAgents,
    activeAgents: mappedAgents.filter((a: Agent) => a.status === 'active').length
  });
}
