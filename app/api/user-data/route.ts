import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/auth-options';
import { redis } from '../../../lib/redis';
import { Session } from 'next-auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session & { user: { id: string, email: string } };

    if (!session || !session.user) {
      console.log('No session or user found in user-data');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.email;
    console.log('Fetching data for user:', userId);
    const key = `user:${userId}:anthropic_requests`;

    const [subscriptionType, requestCount] = await Promise.all([
      redis.get(`user:${userId}:subscription`),
      redis.get(key),
    ]);

    console.log('Redis data:', { subscriptionType, requestCount });

    let limit = 500; // Default to Basic plan
    if (subscriptionType === 'Pro') limit = 1000;
    if (subscriptionType === 'Enterprise') limit = Infinity;

    const parsedRequestCount = parseInt(requestCount ?? '0');
    const remainingRequests = Math.max(0, limit - parsedRequestCount);

    const responseData = {
      subscriptionType: subscriptionType || 'Basic',
      requestCount: parsedRequestCount,
      remainingRequests,
      limit,
    };

    console.log('Sending user data:', responseData);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in user-data API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
