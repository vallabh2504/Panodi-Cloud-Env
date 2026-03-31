import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Recipes API endpoint',
    note: 'Implement your recipes API here',
  });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  return NextResponse.json(
    {
      message: 'Recipe created',
      data,
    },
    { status: 201 }
  );
}
