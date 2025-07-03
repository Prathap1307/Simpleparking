import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');

  try {
    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        // Update your database (e.g., mark order as paid)
        break;
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id);
        break;
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Checkout completed:', session.id);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}