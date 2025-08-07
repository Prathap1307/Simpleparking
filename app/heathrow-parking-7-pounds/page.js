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
        <title>Heathrow Parking From £7 | £1 Extra Days - Book Now!</title>
        <meta name="description" content="Cheapest Heathrow parking deal: Start at £7 for first day + only £1 for each additional day. Secure parking with 24/7 surveillance." />
        <meta name="keywords" content="Heathrow parking £7, LHR £1 parking, cheapest airport parking" />
        <meta property="og:title" content="Heathrow Parking From £7 + £1 Days" />
        <meta property="og:description" content="Unbeatable rates: £7 first day, £1 for extra days" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Parking From £7</h1>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
          <p className="font-bold">FIRST DAY: <span className="text-red-600">£7</span></p>
          <p>EXTRA DAYS: <span className="font-bold">£1/day</span></p>
        </div>
        <p className="text-blue-600 animate-pulse">Redirecting to homepage...</p>
      </div>
    </>
  );
}