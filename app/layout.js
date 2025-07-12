// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({ params }) {

  const baseUrl = 'https://simpleparking.uk';

  let metadata = {
    title: "Simple Parking | Affordable Airport Parking Services",
    description: "Save money on airport parking with our meet and greet service across UK airports.",
    keywords: ["airport parking", "meet and greet", "UK airport parking"],
    openGraph: {
      title: "Simple Parking | Affordable Airport Parking Services",
      description: "Save money on airport parking with our meet and greet service across UK airports.",
      url: "https://simpleparking.uk",
      images: "/og-image.jpg",
    },
    alternates: {
      canonical: "https://simpleparking.uk",
    },
  };

  try {
    // Determine page type based on route
    let pageType = 'home';
    let pageSlug = null;
    
    if (params.airport) {
      pageType = 'airport';
      pageSlug = params.airport;
    } else if (params.blog) {
      pageType = 'blog';
      pageSlug = params.blog;
    }

    // Fetch SEO settings from your API
    const res = await fetch(
      `${baseUrl}/api/seo-settings?pageType=${pageType}${pageSlug ? `&pageSlug=${pageSlug}` : ''}`
    );
    
    if (res.ok) {
      const seoSettings = await res.json();
      if (seoSettings.length > 0) {
        // Use the first matching settings (you might want more specific logic)
        const settings = seoSettings[0];
        metadata = {
          title: settings.title,
          description: settings.description,
          keywords: settings.keywords,
          openGraph: settings.openGraph || {
            title: settings.title,
            description: settings.description,
            url: `https://simpleparking.uk${pageSlug ? `/${pageSlug}` : ''}`,
            images: "/og-image.jpg",
          },
          alternates: {
            canonical: `https://simpleparking.uk${pageSlug ? `/${pageSlug}` : ''}`,
          },
        };
      }
    }
  } catch (error) {
    console.error('Error fetching SEO settings:', error);
  }

  return metadata;
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        
        {/* Dynamic Schema Markup can be added here if needed */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AutoParking",
            "name": "SimpleParking",
            "description": "Affordable meet & greet airport parking service in UK.",
            "url": "https://simpleparking.uk",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "London",
              "addressRegion": "UK",
            },
            "openingHours": "Mo-Su 00:00-24:00",
            "priceRange": "£",
            "serviceType": "Valet parking",
          })}
        </script>
      </body>
    </html>
  );
}