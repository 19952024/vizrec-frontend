import { NextResponse } from 'next/server';

export async function GET() {
  const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL;
  if (backendUrl) {
    const base = backendUrl.replace(/\/$/, '');
    return NextResponse.redirect(`${base}/api/auth/google`);
  }
  return NextResponse.json(
    { error: 'Google login requires backend. Set BACKEND_URL in .env.local.' },
    { status: 501 }
  );
}
