import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/auth-options';
import { kv } from '@/lib/kv';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, feedback } = await req.json();

    if (!name || !email || !feedback) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userId = session.user.email;
    const feedbackKey = `user:${userId}:feedback:${Date.now()}`;

    await kv.hmset(feedbackKey, {
      name,
      email,
      feedback,
      timestamp: Date.now().toString(),
    });

    await kv.expire(feedbackKey, 30 * 24 * 60 * 60);

    return NextResponse.json({ message: 'Feedback submitted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
