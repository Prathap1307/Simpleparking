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
        <title>Cheapest Heathrow Parking | £7 First Day + £1 Extra Days</title>
        <meta name="description" content="Lowest price guaranteed! Heathrow parking starts at £7 first day + only £1 for each extra day. Compare prices and save 60% today." />
        <meta name="keywords" content="cheapest Heathrow parking, LHR budget parking, £1 daily parking" />
        <meta property="og:title" content="CHEAPEST Heathrow Parking - £7 Start" />
        <meta property="og:description" content="Guaranteed lowest rates: £7 + £1/day" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Cheapest Heathrow Parking</h1>
        <div className="flex justify-center gap-4 mb-6">
          <div className="bg-green-100 p-3 rounded-lg">
            <p className="font-bold">Day 1: <span className="text-red-600">£7</span></p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <p className="font-bold">Day 2+: <span className="text-green-800">£1/day</span></p>
          </div>
        </div>
        <p className="text-blue-600 animate-pulse">Redirecting to homepage...</p>
      </div>
    </>
  );
}