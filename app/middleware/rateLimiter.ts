import { NextRequest, NextResponse } from 'next/server';
import { redis } from '../../lib/redis';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/auth-options';

const RATE_LIMIT_DURATION = 30 * 24 * 60 * 60; // 30 days in seconds

const RATE_LIMITS = {
  Basic: 500,
  Pro: 1000,
  Enterprise: Infinity
};

export async function rateLimiter(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    console.log('No session or user found in rateLimiter');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.email;
  const key = `user:${userId}:anthropic_requests`;

  const [subscriptionType, requestCount] = await Promise.all([
    redis.get(`user:${userId}:subscription`),
    redis.get(key),
  ]);

  console.log(`Rate limiter called for user ${userId}. Current Anthropic request count:`, requestCount);

  const limit = RATE_LIMITS[subscriptionType as keyof typeof RATE_LIMITS] || RATE_LIMITS.Basic;

  if (parseInt(requestCount ?? '0') >= limit) {
    console.log(`Rate limit exceeded for user ${userId}`);
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  return null;
}
