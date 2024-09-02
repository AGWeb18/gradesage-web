import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';
import { kv } from '@/lib/kv';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] as string;

  if (!sig) {
    console.error('Stripe signature is missing');
    return res.status(400).send('Stripe signature is missing');
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const error = err as Error;
    console.error(`Webhook Error: ${error.message}`);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.client_reference_id;
  if (!userId) {
    console.error('No client_reference_id found in session');
    return;
  }

  const paymentLinkId = session.payment_link;
  if (!paymentLinkId) {
    console.error('No payment_link found in session');
    return;
  }

  await updateUserSubscription(userId, paymentLinkId);
}

async function updateUserSubscription(userId: string, paymentLinkId: string | Stripe.PaymentLink) {
  let subscriptionType = 'Free';

  // Map the payment link ID to the subscription type
  if (typeof paymentLinkId === 'string') {
    if (paymentLinkId === process.env.STRIPE_BASIC_PAYMENT_LINK) {
      subscriptionType = 'Basic';
    } else if (paymentLinkId === process.env.STRIPE_PREMIUM_PAYMENT_LINK) {
      subscriptionType = 'Premium';
    } else if (paymentLinkId === process.env.STRIPE_VIP_PAYMENT_LINK) {
      subscriptionType = 'VIP';
    } else {
      console.error(`Unknown payment link ID: ${paymentLinkId}`);
    }
  } else {
    console.error(`Unexpected paymentLinkId type: ${typeof paymentLinkId}`);
  }

  // Update user object in Redis
  const userKey = `user:${userId}`;
  await kv.hset(userKey, {
    subscriptionType: subscriptionType,
    subscriptionUpdatedAt: Date.now().toString(),
  });

  // Set the subscription type
  await kv.set(`user:${userId}:subscription`, subscriptionType);

  // Set an expiration date (e.g., 30 days from now)
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 30);
  await kv.set(`user:${userId}:subscriptionExpiration`, expirationDate.toISOString());

  // Reset the Anthropic request count for the new subscription period
  await kv.set(`user:${userId}:anthropic_requests`, '0');

  console.log(`Updated subscription for user ${userId} to ${subscriptionType}`);
}