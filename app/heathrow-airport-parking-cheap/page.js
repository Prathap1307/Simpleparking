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
        <title>Cheap Heathrow Airport Parking | From £5/Day</title>
        <meta name="description" content="Affordable Heathrow parking options starting at £5/day. Compare prices and book budget-friendly secure parking online." />
        <meta name="keywords" content="cheap Heathrow parking, budget LHR parking, low cost airport parking" />
        <meta property="og:title" content="Cheap Heathrow Parking | From £5/Day" />
        <meta property="og:description" content="Most affordable parking options at Heathrow Airport" />
        <link rel="canonical" href="https://yourwebsite.com/heathrow-airport-parking-cheap" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Cheap Heathrow Parking</h1>
        <p className="text-lg text-gray-600 mb-8">Prices starting from just £5 per day</p>
        <p className="text-blue-600 animate-pulse">Redirecting to homepage...</p>
      </div>
    </>
  );
}