import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    const { stdout } = await execAsync('openclaw status --json', { timeout: 5000 });
    const data = JSON.parse(stdout);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'openclaw not available', agents: [], status: 'offline' },
      { status: 503 }
    );
  }
}
