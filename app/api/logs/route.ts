export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') ?? new Date().toISOString().slice(0, 10);
  
  try {
    const bridgeUrl = process.env.VPS_BRIDGE_URL || 'http://localhost:3333';
    const res = await fetch(`${bridgeUrl}/api/logs?date=${date}`, {
      headers: {
        'Authorization': `Bearer ${process.env.BRIDGE_API_KEY || 'vps-bridge-token-2026'}`,
        'Cache-Control': 'no-cache'
      },
      signal: AbortSignal.timeout(10000),
      next: { revalidate: 0 }
    });
    
    if (res.ok) {
      const data = await res.json();
      // Ensure we stringify correctly and don't blow up Latin1 buffers
      return new NextResponse(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    } else {
      console.error('Bridge logs fetch failed:', res.status, await res.text());
      return NextResponse.json({ date, content: "Error fetching logs from VPS", source: "error" }, { status: 500 });
    }
  } catch (error) {
    console.error('Error fetching logs from bridge:', error);
    return NextResponse.json({ date, content: "Error fetching logs from VPS", source: "error" }, { status: 500 });
  }
}
