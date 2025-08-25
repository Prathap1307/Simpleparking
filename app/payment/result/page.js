// app/payment/result/page.js
"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Spinner } from "@heroui/react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function PaymentResult() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const handlePaymentResult = async () => {
      try {
        const stripe = await stripePromise;
        const clientSecret = new URLSearchParams(window.location.search).get(
          'payment_intent_client_secret'
        );
        
        const bookingId = searchParams.get('bookingId');
        const orderId = searchParams.get('orderId');

        if (!clientSecret) {
          throw new Error('Missing client secret');
        }

        const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

        if (paymentIntent.status === 'succeeded') {
          // Update booking to confirmed status
          const response = await fetch('/api/update-booking', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: bookingId,
              status: 'confirmed',
              paymentIntentId: paymentIntent.id
            })
          });

          if (response.ok) {
            setStatus('success');
            setTimeout(() => {
              router.push(`/payment/success?bookingId=${bookingId}`);
            }, 2000);
          } else {
            setStatus('error');
          }
        } else if (paymentIntent.status === 'processing') {
          setStatus('processing');
        } else {
          setStatus('failed');
          setTimeout(() => {
            router.push(`/payment/failed?bookingId=${bookingId}`);
          }, 2000);
        }
      } catch (error) {
        console.error('Payment result error:', error);
        setStatus('error');
      }
    };

    handlePaymentResult();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Spinner size="lg" className="mb-4" />
        <h2 className="text-xl font-semibold text-gray-800">
          {status === 'processing' && 'Processing your payment...'}
          {status === 'success' && 'Payment successful! Redirecting...'}
          {status === 'failed' && 'Payment failed. Redirecting...'}
          {status === 'error' && 'An error occurred. Please contact support.'}
        </h2>
      </div>
    </div>
  );
}