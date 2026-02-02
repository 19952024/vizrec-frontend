import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/utils/authService';

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');
  if (!email || !email.includes('@')) {
    return NextResponse.json({ exists: false, message: 'Invalid email', database_connected: false });
  }
  try {
    const exists = authService.checkEmailExists(email);
    return NextResponse.json({
      exists,
      message: exists ? 'This user is already registered. Please sign in.' : 'Email is available. You can register.',
      database_connected: false,
    });
  } catch {
    return NextResponse.json({ exists: false, message: 'Could not check email', database_connected: false });
  }
}
