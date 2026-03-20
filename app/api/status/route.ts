import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import { Agent } from '@/types';

export async function GET() {
  try {
    const rawStatus = execSync('openclaw status --json').toString();
    const status = JSON.parse(rawStatus);
    
    // Map openclaw agents to Frontend Agent interface
    const openclawAgents = status.agents?.agents || [];
    
    const mappedAgents: Agent[] = openclawAgents.map((a: any) => {
      const isIdle = a.lastActiveAgeMs === null || a.lastActiveAgeMs > 60000;
      
      return {
        id: a.id,
        name: a.name || a.id,
        swarmId: 'swarm-1', // Default swarm
        status: a.bootstrapPending ? 'paused' : (isIdle ? 'idle' : 'active'),
        tokensUsed: a.sessionsCount * 1500, // mock metrics based on real sessions
        costUsd: parseFloat((a.sessionsCount * 0.05).toFixed(2)) // mock cost
      };
    });

    return NextResponse.json({
      ...status,
      agents: mappedAgents,
      activeAgents: mappedAgents.filter((a: Agent) => a.status === 'active').length
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}
