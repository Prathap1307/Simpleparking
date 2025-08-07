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
        <title>Heathrow Terminal 5 Parking | Fast & Secure Options</title>
        <meta name="description" content="Best parking options for Heathrow Terminal 5. Meet & greet, short-stay, and long-stay parking with free shuttle service." />
        <meta name="keywords" content="Heathrow T5 parking, Terminal 5 parking, LHR terminal parking" />
        <meta property="og:title" content="Heathrow Terminal 5 Parking | Fast & Secure" />
        <meta property="og:description" content="Convenient parking options right at Heathrow Terminal 5" />
        <link rel="canonical" href="https://yourwebsite.com/heathrow-terminal-5-parking" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Heathrow Terminal 5 Parking</h1>
        <p className="text-lg text-gray-600 mb-8">Fast access to Terminal 5 with secure parking</p>
        <p className="text-blue-600 animate-pulse">Redirecting to homepage...</p>
      </div>
    </>
  );
}