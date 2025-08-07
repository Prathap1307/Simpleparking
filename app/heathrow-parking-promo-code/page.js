'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push('/'), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Heathrow Parking Promo Code | 2024 Exclusive Deals</title>
        <meta name="description" content="Latest Heathrow parking promo codes. Save 15-20% on meet & greet and valet services. Limited stock!" />
        <meta name="keywords" content="Heathrow parking promo code, LHR voucher code, airport parking discounts" />
        <meta property="og:title" content="Heathrow Parking Promo Codes | 2024" />
        <meta property="og:description" content="Exclusive discount codes for Heathrow parking" />
        <link rel="canonical" href="https://yourwebsite.com/heathrow-parking-promo-code" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Promo Codes</h1>
        <p className="text-lg text-gray-600 mb-8">Save 15-20% on Heathrow parking</p>
        <p className="text-blue-600 animate-pulse">Redirecting to homepage...</p>
      </div>
    </>
  );
}