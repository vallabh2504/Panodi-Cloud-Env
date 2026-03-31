import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Meal Plans API endpoint',
    note: 'Implement your meal plans API here',
  });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  return NextResponse.json(
    {
      message: 'Meal plan created',
      data,
    },
    { status: 201 }
  );
}
