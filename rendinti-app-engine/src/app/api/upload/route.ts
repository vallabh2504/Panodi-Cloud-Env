import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
  }

  // MVP: Mock S3/Cloudinary upload. Just return a mock URL.
  const fileName = `${Date.now()}-${file.name}`;
  const mockUrl = `https://storage.rendinti.engine/proofs/${fileName}`;

  return NextResponse.json({ success: true, url: mockUrl });
}
