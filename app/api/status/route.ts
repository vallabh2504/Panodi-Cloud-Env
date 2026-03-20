export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { Agent } from '@/types';

const mockStatus = {
  "os": {
    "platform": "linux",
    "arch": "x64",
    "release": "unknown",
    "label": "unknown"
  },
  "agents": {
    "defaultId": "main",
    "agents": [],
    "totalSessions": 0,
    "bootstrapPendingCount": 0
  }
};

export async function GET() {
  let status = mockStatus;
  try {
    const bridgeUrl = process.env.VPS_BRIDGE_URL || 'https://composed-jill-importantly-sized.trycloudflare.com';
    const res = await fetch(`${bridgeUrl}/api/status`, {
      headers: {
        'Authorization': `Bearer ${process.env.BRIDGE_API_KEY || 'vps-bridge-token-2026'}`,
        'Cache-Control': 'no-cache'
      },
      next: { revalidate: 0 }
    });
    
    if (res.ok) {
      status = await res.json();
    } else {
      console.error('Bridge fetch failed:', res.status, await res.text());
    }
  } catch (error) {
    console.error('Error fetching from bridge:', error);
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
