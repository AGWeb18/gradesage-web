import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/auth-options';
import { kv } from '../../../lib/kv';
import { Session } from 'next-auth';

// Add this line at the top of your file
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session & { user: { id: string, email: string } };

    if (!session || !session.user) {
      console.log('No session or user found in user-data');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.email;
    console.log('Fetching data for user:', userId);
    
    // Check if the user is new
    const userExists = await kv.get(`user:${userId}:subscription`);
    if (!userExists) {
      console.log(`New user signed in: ${userId}`);
    }

    const key = `user:${userId}:anthropic_requests`;
    const subscriptionStartKey = `user:${userId}:subscription_start`;

    const [subscriptionType, requestCount, subscriptionStart] = await Promise.all([
      kv.get(`user:${userId}:subscription`),
      kv.get(key),
      kv.get(subscriptionStartKey),
    ]);

    let parsedRequestCount = parseInt(requestCount?.toString() ?? '0');
    let daysLeft = 30;

    if (subscriptionStart) {
      const daysSinceSubscriptionStart = Math.floor((Date.now() - parseInt(subscriptionStart.toString())) / (1000 * 60 * 60 * 24));
      daysLeft = Math.max(0, 30 - daysSinceSubscriptionStart);
      if (daysSinceSubscriptionStart >= 30) {
        await kv.set(key, '0');
        await kv.set(subscriptionStartKey, Date.now().toString());
        parsedRequestCount = 0;
        daysLeft = 30;
        console.log(`Reset Anthropic request count for user ${userId}`);
      }
    } else {
      await kv.set(subscriptionStartKey, Date.now().toString());
    }

    console.log('KV data:', { subscriptionType, requestCount: parsedRequestCount });

    let limit = 10;
    if (subscriptionType === 'Basic') limit = 300;
    if (subscriptionType === 'Premium') limit = 1000;
    if (subscriptionType === 'VIP') limit = Infinity;

    const remainingRequests = Math.max(0, limit - parsedRequestCount);

    const responseData = {
      subscriptionType: subscriptionType || 'Free',
      requestCount: parsedRequestCount,
      remainingRequests,
      limit,
      daysLeft,
      upgradeInfo: subscriptionType === 'Free' ? 'Upgrade to Basic for 300 requests/month' :
                   subscriptionType === 'Basic' ? 'Upgrade to Premium for 1000 requests/month' : null
    };

    console.log('Sending user data:', responseData);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in user-data API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
