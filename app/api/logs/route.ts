export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const MEMORY_DIR = '/root/.openclaw/workspace/memory';

const MOCK_LOG_CONTENT = `
[08:00:00] [wa-gatekeeper] 🚨 **URGENT WA ALERT** Received message from VIP
[08:00:05] [main] Received urgent alert, notifying Vallabh via Telegram
[08:01:00] [main] Executed tool: message (channel="telegram", target="456109422")
[08:02:30] [architect-pro] Synced latest logs to convex cloud
[08:03:00] [auditor-pro] Checked SwarmOps deployment status
`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') ?? new Date().toISOString().slice(0, 10);
  const filePath = path.join(MEMORY_DIR, `${date}.md`);

  try {
    const content = await readFile(filePath, 'utf-8');
    return NextResponse.json({ date, content, source: filePath });
  } catch {
    // Try the most recent available log
    try {
      const { readdir } = await import('fs/promises');
      const files = (await readdir(MEMORY_DIR))
        .filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
        .sort()
        .reverse();

      if (files.length === 0) {
        throw new Error('No files found');
      }

      const latest = files[0];
      const latestPath = path.join(MEMORY_DIR, latest);
      const content = await readFile(latestPath, 'utf-8');
      return NextResponse.json({ date: latest.replace('.md', ''), content, source: latestPath });
    } catch {
      // Fallback for Vercel
      return NextResponse.json({ date, content: MOCK_LOG_CONTENT, source: 'mock-vercel' });
    }
  }
}
