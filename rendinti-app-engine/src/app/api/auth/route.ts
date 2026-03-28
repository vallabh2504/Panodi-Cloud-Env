import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { phone, otp } = body;

  // MVP: Mock auth. In production, verify OTP with provider.
  if (otp === '123456') {
    return NextResponse.json({ 
      success: true, 
      token: 'mock-jwt-token',
      user: { phone, role: 'rider' }
    });
  }

  return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 401 });
}
