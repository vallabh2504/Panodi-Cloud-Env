import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const MEMORY_DIR = '/root/.openclaw/workspace/memory';

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
        return NextResponse.json({ date, content: '', source: null }, { status: 404 });
      }

      const latest = files[0];
      const latestPath = path.join(MEMORY_DIR, latest);
      const content = await readFile(latestPath, 'utf-8');
      return NextResponse.json({ date: latest.replace('.md', ''), content, source: latestPath });
    } catch {
      return NextResponse.json(
        { error: 'Memory logs unavailable', date, content: '' },
        { status: 503 }
      );
    }
  }
}
