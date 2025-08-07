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
        <title>Heathrow Short Stay Parking | Hourly & Daily Rates</title>
        <meta name="description" content="Convenient short-stay parking near Heathrow terminals. Ideal for pickups, drop-offs, and quick trips." />
        <meta name="keywords" content="Heathrow short stay parking, LHR hourly parking, quick airport parking" />
        <meta property="og:title" content="Heathrow Short Stay Parking | Hourly Rates" />
        <meta property="og:description" content="Quick parking solutions near Heathrow terminals" />
        <link rel="canonical" href="https://yourwebsite.com/heathrow-short-stay-parking" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Short Stay Parking</h1>
        <p className="text-lg text-gray-600 mb-8">Hourly and daily parking options</p>
        <p className="text-blue-600 animate-pulse">Redirecting to homepage...</p>
      </div>
    </>
  );
}