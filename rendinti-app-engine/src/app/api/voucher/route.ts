import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { voucherToken, orderId, merchantId } = body;

  // MVP: Mock voucher verification. Signed with a mock secret.
  if (voucherToken.startsWith('rendinti-v-')) {
    console.log(`Voucher reconciled for ${orderId}`);
    return NextResponse.json({ success: true, reconciled: true });
  }

  return NextResponse.json({ success: false, message: 'Invalid voucher signature' }, { status: 403 });
}
