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
        <title>50% OFF Heathrow Parking | Just £7/Day + £1 Extra Days</title>
        <meta name="description" content="FLASH SALE: 50% off Heathrow parking! Start at £7 for first day, only £1 for each extra day. Limited time offer - book now!" />
        <meta name="keywords" content="Heathrow parking 50% off, LHR parking sale, £7 airport parking" />
        <meta property="og:title" content="50% OFF Heathrow Parking - £7 First Day" />
        <meta property="og:description" content="Massive discount: Pay just £7 first day + £1 for extra days" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">50% OFF Heathrow Parking</h1>
        <p className="text-lg text-gray-600 mb-2">First day just <span className="text-red-600 font-bold">£7</span></p>
        <p className="text-lg text-gray-600 mb-8">Only <span className="font-bold">£1/day</span> after that!</p>
        <p className="text-blue-600 animate-pulse">Redirecting to homepage...</p>
      </div>
    </>
  );
}