import { NextRequest, NextResponse } from 'next/server';
import { rateLimiter } from '@/app/middleware/rateLimiter';

export async function GET(req: NextRequest) {
  const rateLimitResponse = await rateLimiter(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  return NextResponse.json({ message: 'Rate limit test successful' });
}
