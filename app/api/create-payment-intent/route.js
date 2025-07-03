// app/api/create-payment-intent/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const body = await request.json();

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: body.amount, // in pence
      currency: "gbp",
      metadata: {
        bookingId: body.bookingId, // Add this line
        email: body.email,
        licensePlate: body.licensePlate,
        parking: body.selectedParking,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
