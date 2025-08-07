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
        <title>FLASH SALE: Heathrow Parking £7 + £1 Days | 24 Hours Only!</title>
        <meta name="description" content="24-HOUR SALE: Heathrow parking at £7 first day + £1 for extra days. Secure your spot before this deal disappears!" />
        <meta name="keywords" content="Heathrow parking flash sale, LHR limited offer, £7 parking deal" />
        <meta property="og:title" content="FLASH SALE: £7 Heathrow Parking" />
        <meta property="og:description" content="24-hour special: £7 first day + £1 extra days" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <h1 className="text-3xl font-bold mb-2">FLASH SALE</h1>
          <p className="text-xl">Ends in <span className="font-bold">23:59:59</span></p>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Parking from <span className="text-red-600">£7</span></h2>
        <p className="text-lg mb-2">+ <span className="font-bold">£1/day</span> after first day</p>
        <p className="text-blue-600 animate-pulse">Redirecting to homepage...</p>
      </div>
    </>
  );
}