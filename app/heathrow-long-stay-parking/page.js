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
        <title>Heathrow Long Stay Parking | Cheap Weekly Rates</title>
        <meta name="description" content="Affordable long-stay parking at Heathrow. Secure parking for 1-3 weeks with free shuttle transfers." />
        <meta name="keywords" content="Heathrow long stay parking, LHR weekly parking, extended airport parking" />
        <meta property="og:title" content="Heathrow Long Stay Parking | Weekly Deals" />
        <meta property="og:description" content="Best rates for 1-3 week parking at Heathrow" />
        <link rel="canonical" href="https://yourwebsite.com/heathrow-long-stay-parking" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Long Stay Parking</h1>
        <p className="text-lg text-gray-600 mb-8">Cheap weekly rates at Heathrow</p>
        <p className="text-blue-600 animate-pulse">Redirecting to homepage...</p>
      </div>
    </>
  );
}