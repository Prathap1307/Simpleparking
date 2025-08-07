// middleware.js
export function middleware(request) {
  // Track redirect sources for analytics
  const trackRedirect = (path) => {
    console.log(`Redirect triggered: ${path} → Homepage`);
    // Add your analytics tracking here (e.g., Google Analytics)
  };

  // All redirect mappings (SEO pages → Homepage)
  const redirects = {
    // Core Service Pages
    '/best-heathrow-parking': '/',
    '/cheapest-heathrow-parking': '/',
    '/heathrow-airport-parking-cheap': '/',
    '/heathrow-long-stay-parking': '/',
    '/heathrow-meet-and-greet-parking': '/',
    '/heathrow-short-stay-parking': '/',
    '/heathrow-terminal-5-parking': '/',
    '/heathrow-valet-parking': '/',
    
    // Special Offers & Deals
    '/heathrow-parking-7-pounds': '/?offer=7pound',
    '/heathrow-parking-50-percent-off': '/?offer=50off',
    '/heathrow-parking-deals': '/?src=deals',
    '/heathrow-parking-discount-code': '/?src=discount',
    '/heathrow-parking-flash-sale': '/?offer=flash',
    '/heathrow-parking-promo-code': '/?src=promo',
    '/heathrow-parking-summer-sale': '/?offer=summer',
    '/heathrow-parking-weekly-offer': '/?offer=weekly',
    
    // Common Typos/Misspellings
    '/heathrowairport': '/',
    '/heatrow-parking': '/heathrow-meet-and-greet-parking',
    '/hethrow-parking': '/heathrow-meet-and-greet-parking'
  };

  const path = request.nextUrl.pathname;
  
  if (redirects[path]) {
    trackRedirect(path);
    const destination = new URL(redirects[path], request.url);
    
    // Preserve query params if they exist
    if (request.nextUrl.search) {
      destination.search = request.nextUrl.search;
    }
    
    return Response.redirect(destination, 301);
  }
}

// Performance optimization - only run on these paths
export const config = {
  matcher: [
    '/best-heathrow-parking',
    '/cheapest-heathrow-parking',
    '/heathrow-airport-parking-cheap',
    '/heathrow-long-stay-parking',
    '/heathrow-meet-and-greet-parking',
    '/heathrow-short-stay-parking',
    '/heathrow-terminal-5-parking',
    '/heathrow-valet-parking',
    '/heathrow-parking-7-pounds',
    '/heathrow-parking-50-percent-off',
    '/heathrow-parking-deals',
    '/heathrow-parking-discount-code',
    '/heathrow-parking-flash-sale',
    '/heathrow-parking-promo-code',
    '/heathrow-parking-summer-sale',
    '/heathrow-parking-weekly-offer',
    '/heathrowairport',
    '/heatrow-parking',
    '/hethrow-parking'
  ]
};