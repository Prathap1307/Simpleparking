// lib/seoUtils.js
export const defaultSEOSettings = {
  home: {
    title: "Cheap Airport Parking UK | Meet & Greet Valet Service | SimpleParking",
    description: "Save 50%+ on Heathrow, Gatwick & UK airport parking! Book trusted meet & greet valet parking with free terminal drop-off. Lowest price guarantee.",
    keywords: [
      "UK airport parking",
      "cheap Heathrow parking",
      "Gatwick meet and greet",
      "Stansted valet parking",
      "Luton airport parking deals",
      "Manchester airport parking",
      "airport parking service",
    ],
    openGraph: {
      title: "Cheap UK Airport Parking | SimpleParking",
      description: "Skip expensive airport lots! We collect & return your car at the terminal.",
      images: "/og-image.jpg",
    }
  },
  airport: {
    title: "Cheap {airport} Parking | Meet & Greet Service | SimpleParking",
    description: "Best prices for {airport} meet & greet parking. We collect your car at the terminal and store it securely.",
    keywords: [
      "{airport} parking",
      "cheap {airport} parking",
      "{airport} meet and greet",
      "{airport} valet parking",
    ],
    openGraph: {
      title: "Cheap {airport} Parking | SimpleParking",
      description: "Professional meet & greet service at {airport}.",
      images: "/og-image.jpg",
    }
  }
};

export function getSEOSettings(pageType, variables = {}) {
  let settings = defaultSEOSettings[pageType] || defaultSEOSettings.home;
  
  // Replace variables in strings
  const processText = (text) => {
    if (typeof text === 'string') {
      Object.keys(variables).forEach(key => {
        text = text.replace(new RegExp(`{${key}}`, 'g'), variables[key]);
      });
      return text;
    }
    return text;
  };

  const processObject = (obj) => {
    const result = {};
    Object.keys(obj).forEach(key => {
      if (Array.isArray(obj[key])) {
        result[key] = obj[key].map(item => processText(item));
      } else if (typeof obj[key] === 'object') {
        result[key] = processObject(obj[key]);
      } else {
        result[key] = processText(obj[key]);
      }
    });
    return result;
  };

  return processObject(settings);
}