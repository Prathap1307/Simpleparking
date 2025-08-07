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
        <title>Summer Sale: Heathrow Parking £7 + £1 Days | Book Now!</title>
        <meta name="description" content="SUMMER SPECIAL: Heathrow parking starts at £7 first day + £1 for extra days. Free cancellation & secure covered parking." />
        <meta name="keywords" content="Heathrow summer parking sale, LHR holiday parking deals, £7 airport special" />
        <meta property="og:title" content="Summer Parking Sale - £7 First Day" />
        <meta property="og:description" content="Holiday special: £7 first day, just £1 for extra days" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Summer Parking Sale</h1>
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-4 max-w-md">
          <p className="text-xl font-bold text-gray-800">FIRST DAY <span className="text-red-600">£7</span></p>
          <p className="text-lg">+ <span className="font-bold">£1/day</span> after</p>
        </div>
        <p className="text-blue-600 animate-pulse">Redirecting to homepage...</p>
      </div>
    </>
  );
}