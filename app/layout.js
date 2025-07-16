// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Head from 'next/head'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Heathrow Parking Under £30 | 70% Off | SimpleParking UK",
  description: "Affordable Heathrow meet & greet parking from just £30! Save 70% on official airport parking. Book online for the best rates.",
    icons: {
      icon: "/logo.ico",
      shortcut: "/favicon-32x32.png",
      apple: "/apple-touch-icon.png",
    },
  keywords: [
    "heathrow airport parking",
    "london airport parking",
    "affordable heathrow parking",
    "meet and greet parking",
    "parking under £30",
    "heathrow parking deals",
    "valet parking heathrow"
  ],
  verification: {
    google: "seozSF04L1eyNoQHrtx8OtH8Sou9mguXMGw3bL9BSeQ",
  },
  openGraph: {
    title: "Heathrow Parking Under £30 | 70% Off | SimpleParking UK",
    description: "Affordable Heathrow meet & greet parking from just £30! Save 70% on official airport parking. Book online for the best rates.",
    url: "https://simpleparking.uk",
    images: [{
      url: "/favicon.ico",
      width: 1200,
      height: 630,
      alt: "SimpleParking Heathrow Parking Deal",
    }],
    siteName: "SimpleParking",
  },
  alternates: {
    canonical: "https://simpleparking.uk",
  },
  twitter: {
    card: "summary_large_image",
    title: "Heathrow Parking Under £30 | 70% Off | SimpleParking UK",
    description: "Affordable Heathrow meet & greet parking from just £30! Save 70% on official airport parking.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-RFC99GL7N2"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-RFC99GL7N2');
            `,
          }}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        
        {/* Schema Markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Heathrow Airport Parking",
            "description": "Affordable meet & greet parking service at Heathrow Airport",
            "url": "https://simpleparking.uk",
            "offers": {
              "@type": "Offer",
              "price": "30",
              "priceCurrency": "GBP",
              "priceValidUntil": "2025-12-31",
              "description": "Parking for under £30"
            },
            "areaServed": {
              "@type": "GeoCircle",
              "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": 51.4700,
                "longitude": -0.4543
              },
              "geoRadius": 50000
            },
            "serviceType": "Valet parking",
            "provider": {
              "@type": "Organization",
              "name": "SimpleParking UK"
            }
          })}
        </script>
      </body>
    </html>
  );
}