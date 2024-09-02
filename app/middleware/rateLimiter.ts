import { NextRequest, NextResponse } from 'next/server';
import { kv } from '../../lib/kv';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/auth-options';

const RATE_LIMITS = {
  Free: 10,
  Basic: 300,
  Premium: 1000,
  VIP: Infinity
};

export async function rateLimiter(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    console.log('No session or user found in rateLimiter');
    return { error: 'Unauthorized', status: 401 };
  }

  const userId = session.user.email;
  const key = `user:${userId}:anthropic_requests`;

  const [subscriptionType, requestCount] = await Promise.all([
    kv.get(`user:${userId}:subscription`),
    kv.get(key),
  ]);

  console.log(`Rate limiter called for user ${userId}. Current Anthropic request count:`, requestCount);

  const limit = RATE_LIMITS[subscriptionType as keyof typeof RATE_LIMITS] || RATE_LIMITS.Basic;

  if (parseInt(requestCount as string ?? '0') >= limit) {
    console.log(`Rate limit exceeded for user ${userId}`);
    return { error: 'Rate limit exceeded', status: 429 };
  }

  return null; // No rate limit exceeded
}

export const config = {
  matcher: '/api/process-csv',
};
