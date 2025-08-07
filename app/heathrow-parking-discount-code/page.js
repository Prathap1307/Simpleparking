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
        <title>Heathrow Parking Discount Code | Save £10 Instantly</title>
        <meta name="description" content="Active Heathrow parking discount codes. Save up to £10 on your booking. Limited-time offers available." />
        <meta name="keywords" content="Heathrow parking discount, LHR promo code, airport parking vouchers" />
        <meta property="og:title" content="Heathrow Parking Discount Code | 2024 Deals" />
        <meta property="og:description" content="Latest working discount codes for Heathrow parking" />
        <link rel="canonical" href="https://yourwebsite.com/heathrow-parking-discount-code" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Heathrow Parking Discounts</h1>
        <p className="text-lg text-gray-600 mb-8">Save £10 with our latest codes</p>
        <p className="text-blue-600 animate-pulse">Redirecting to homepage...</p>
      </div>
    </>
  );
}