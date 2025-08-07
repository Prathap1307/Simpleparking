'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

export default function HeathrowMeetAndGreetPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect after 2 seconds (lets Google crawl first)
    const timer = setTimeout(() => {
      router.push('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Heathrow Meet & Greet Parking | Best Prices & Secure Service</title>
        <meta name="description" content="Book premium Heathrow meet and greet parking. Save up to 70% with our secure valet service. Free cancellations & 24/7 surveillance." />
        <meta name="keywords" content="Heathrow meet and greet parking, LHR valet parking, Heathrow terminal parking" />
        <link rel="canonical" href="https://yourwebsite.com/heathrow-meet-and-greet-parking" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Heathrow Meet & Greet Parking | Fast & Secure" />
        <meta property="og:description" content="Drop your car and walk straight to check-in at Heathrow. No shuttles needed." />
        <meta property="og:url" content="https://yourwebsite.com/heathrow-meet-and-greet-parking" />
        <meta property="og:image" content="https://yourwebsite.com/images/heathrow-parking-og.jpg" />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Heathrow Meet & Greet Parking Deals" />
        <meta name="twitter:description" content="Exclusive discounts on Heathrow valet parking" />
        <meta name="twitter:image" content="https://yourwebsite.com/images/heathrow-parking-twitter.jpg" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Heathrow Meet & Greet Parking
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Enjoy our premium valet service at Heathrow Airport. 
            Your car will be waiting for you when you return.
          </p>
          <div className="animate-pulse text-blue-600">
            Redirecting to our homepage...
          </div>
        </div>
      </div>
    </>
  );
}