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
        <title>Weekly Special: Heathrow Parking £7 + £1 Days | Book Now!</title>
        <meta name="description" content="This week only: Heathrow parking at £7 first day + £1 for extra days. Covered parking with free shuttle service." />
        <meta name="keywords" content="Heathrow weekly parking deal, LHR £7 special, airport parking promotion" />
        <meta property="og:title" content="Weekly Parking Special - £7 Start" />
        <meta property="og:description" content="Limited time: £7 first day + £1 extra days" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Weekly Parking Special</h1>
        <div className="bg-purple-100 p-4 rounded-lg mb-6 max-w-md mx-auto">
          <p className="text-xl font-bold">Pay just <span className="text-red-600">£7</span> first day</p>
          <p className="text-lg">Then <span className="font-bold">£1/day</span></p>
        </div>
        <p className="text-blue-600 animate-pulse">Redirecting to homepage...</p>
      </div>
    </>
  );
}