import { NextResponse } from 'next/server';

const mockOrders = [
  { id: 'ORD-101', merchantId: 'M-55', items: ['Gari', 'Fish'], status: 'pending', customerOtp: '5678' },
  { id: 'ORD-102', merchantId: 'M-56', items: ['Yam', 'Egg'], status: 'preparing', customerOtp: '1234' },
];

export async function GET() {
  return NextResponse.json({ success: true, orders: mockOrders });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { id, status, photoUrl } = body;

  // MVP: Mock DB update
  console.log(`Order ${id} updated to ${status}`);
  if (photoUrl) console.log(`Photo URL attached: ${photoUrl}`);

  return NextResponse.json({ success: true, message: 'Order updated' });
}
