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
        <title>Heathrow Parking Deals | Save 30% Today | Limited-Time Offers</title>
        <meta name="description" content="Exclusive Heathrow airport parking deals. Compare prices and save up to 30% on secure parking. Book now for instant discounts!" />
        <meta name="keywords" content="Heathrow parking deals, LHR parking discounts, cheap Heathrow parking" />
        <meta property="og:title" content="Heathrow Parking Deals | Save 30% Today" />
        <meta property="og:description" content="Limited-time offers on Heathrow airport parking. Book now and save!" />
        <link rel="canonical" href="https://yourwebsite.com/heathrow-parking-deals" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Heathrow Parking Deals</h1>
        <p className="text-lg text-gray-600 mb-8">Save up to 30% on secure airport parking</p>
        <p className="text-blue-600 animate-pulse">Redirecting to homepage...</p>
      </div>
    </>
  );
}