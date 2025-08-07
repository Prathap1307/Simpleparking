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
        <title>Best Heathrow Parking | Top-Rated Services 2024</title>
        <meta name="description" content="Discover the best Heathrow parking services rated by travelers. Valet, meet & greet, and budget options compared." />
        <meta name="keywords" content="best Heathrow parking, top LHR parking, rated airport parking" />
        <meta property="og:title" content="Best Heathrow Parking | 2024 Top Picks" />
        <meta property="og:description" content="Highest-rated parking services at Heathrow Airport" />
        <link rel="canonical" href="https://yourwebsite.com/best-heathrow-parking" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Best Heathrow Parking</h1>
        <p className="text-lg text-gray-600 mb-8">Top-rated services for 2024</p>
        <p className="text-blue-600 animate-pulse">Redirecting to homepage...</p>
      </div>
    </>
  );
}