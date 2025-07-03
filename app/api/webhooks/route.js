// app/api/webhooks/route.js
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');

  try {
    // Verify webhook came from Stripe
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handleSuccessfulPayment(event.data.object);
        break;
        
      case 'payment_intent.payment_failed':
        await handleFailedPayment(event.data.object);
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

async function handleSuccessfulPayment(paymentIntent) {
  if (!paymentIntent.metadata.bookingId) return; 
  // Verify payment is actually successful
  if (paymentIntent.status !== 'succeeded') return;
  
  // Update booking status
  await updateBookingStatus(
    paymentIntent.metadata.bookingId,
    'confirmed',
    paymentIntent.id
  );
  
  // Optional: Send confirmation email
  await sendConfirmationEmail(paymentIntent.metadata.email);
}

async function handleFailedPayment(paymentIntent) {
  await updateBookingStatus(
    paymentIntent.metadata.bookingId,
    'payment_failed'
  );
}

async function updateBookingStatus(bookingId, status, paymentIntentId = null) {
  const updateData = { 
    Status: status,
    updatedAt: new Date().toISOString(),
    ...(paymentIntentId && { paymentIntentId })
  };

  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/Todaysbooking?id=${bookingId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData)
  });

  if (!response.ok) {
    throw new Error(`Failed to update booking ${bookingId} to ${status}`);
  }
}