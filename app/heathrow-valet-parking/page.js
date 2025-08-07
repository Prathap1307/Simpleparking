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
        <title>Heathrow Valet Parking | Luxury Drop-Off Service</title>
        <meta name="description" content="Premium Heathrow valet parking service. Drop your car at the terminal and enjoy stress-free travel. Book now!" />
        <meta name="keywords" content="Heathrow valet parking, LHR VIP parking, luxury airport parking" />
        <meta property="og:title" content="Heathrow Valet Parking | Terminal Drop-Off" />
        <meta property="og:description" content="Luxury valet service at Heathrow - we park for you" />
        <link rel="canonical" href="https://yourwebsite.com/heathrow-valet-parking" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Heathrow Valet Parking</h1>
        <p className="text-lg text-gray-600 mb-8">Luxury terminal drop-off service</p>
        <p className="text-blue-600 animate-pulse">Redirecting to homepage...</p>
      </div>
    </>
  );
}