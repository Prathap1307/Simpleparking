
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Image } from '@heroui/react';
import { useRouter } from "next/navigation";


const ParkingCard = ({ 
  title, 
  details, 
  price, 
  pricePerHour, 
  imageUrl, 
  duration,
  index,
  setSearching,
  pricingTiers
}) => {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter()
  
  const formatDurationText = () => {
    const daysText = duration.days === 1 ? 'day' : 'days';
    const hoursText = duration.hours === 1 ? 'hour' : 'hours';
    return `${duration.days} ${daysText} ${duration.hours > 0 ? `and ${duration.hours} ${hoursText}` : ''}`;
  };

  const calculatePriceFromTiers = (pricingTiers, days) => {
      if (!pricingTiers || pricingTiers.length === 0) {
        return { total: 0, message: "Please contact support@simpleparking.uk" };
      }
  
      // Find the matching tier
      const matchingTier = pricingTiers.find(tier => 
        days >= tier.minDays && days <= tier.maxDays
      );
  
      if (matchingTier) {
        const total = matchingTier.basic + (matchingTier.perDay * days);
        return { total, message: null };
      }
  
      // Check if days exceed all tiers
      const maxTier = pricingTiers.reduce((max, tier) => 
        tier.maxDays > max.maxDays ? tier : max
      );
      
      if (days > maxTier.maxDays) {
        return { total: 0, message: "Please contact support@simpleparking.uk" };
      }
  
      // If no tier matches (shouldn't happen if tiers cover all ranges)
      return { total: 0, message: "No pricing tier available for this duration" };
  };


  const calculateTotalPrice = () => {
    // First try to calculate based on pricing tiers if available
    if (pricingTiers && pricingTiers.length > 0) {
      const { total, message } = calculatePriceFromTiers(pricingTiers, duration.days);
      if (message) {
        return message; // This will show the contact message
      }
      // Add hourly price if any
      return total + (duration.hours * pricePerHour);
    }
    
    // Fallback to simple calculation if no pricing tiers
    return (price * duration.days) + (pricePerHour * duration.hours);
  };

  const totalPrice = calculateTotalPrice();
  const isContactMessage = typeof totalPrice === 'string';

  const handleBookNow = () => {
    setSearching(true);
    
    // Save the booking details to session storage
    sessionStorage.setItem('selectedParking', JSON.stringify({
      title,
      price,
      pricePerHour,
      duration,
      totalPrice,
      imageUrl
    }));

    const searchData = JSON.parse(sessionStorage.getItem("parkingSearchData"));
    sessionStorage.setItem("parkingSearchData", JSON.stringify(searchData));
    // Navigate to payment page
    router.push(`/Paymentdetails/${encodeURIComponent(title)}`);
  };

  
  return (
    <motion.div
      className="bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-700 overflow-hidden mb-6 group hover:border-indigo-500 transition-all duration-300"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.3)" }}
    >
      <div className="flex flex-col md:flex-row">
        {/* Image Section with Futuristic Overlay */}
        <div className="relative w-full md:w-2/5 h-48 md:h-auto">
          <Image
            src={imageUrl || "https://blog.getmyparking.com/wp-content/uploads/2018/07/underground-parking.jpg"}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            radius="none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-indigo-600/90 text-white text-xs font-semibold rounded-full backdrop-blur-sm border border-indigo-400/30">
              {duration.days > 0 ? `${duration.days}d ${duration.hours}h` : `${duration.hours}h`}
            </span>
          </div>
          {/* Futuristic Corner Accent */}
          <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-indigo-500 rounded-bl-2xl opacity-80" />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6">
          <div className="flex flex-col md:flex-row h-full">
            {/* Text Content */}
            <div className="flex-1 pr-4 mt-16 md:mt-0">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                {title}
                <span className="ml-2 text-xs font-normal text-indigo-400 bg-indigo-900/30 px-2 py-1 rounded-full">
                  PREMIUM
                </span>
              </h3>
              
              {/* Description with Gradient Fade */}
              <div className="mb-4">
                <div className="text-gray-300 text-sm">
                  {details?.split(".").filter(Boolean).map((line, index) => (
                    <p key={index} className="mb-1">{line.trim()}</p>
                  ))}
                </div>
              </div>
              
              {/* Quick Features */}
              <div className="flex flex-wrap gap-2 mb-4">
                {['24/7 Security', 'CCTV', 'EV Charging'].map((feature, i) => (
                  <span 
                    key={i}
                    className="px-2.5 py-1 bg-gray-800/50 text-indigo-300 text-xs font-medium rounded-full border border-gray-700 flex items-center"
                  >
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-1.5 animate-pulse" />
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Pricing Section - Futuristic Design */}
            <div className="md:w-1/3 flex flex-col items-end">
              {/* Day Rate - Highlighted */}
              
              {/* Hourly Rate */}
              {pricePerHour && (
                <div className="text-right mb-4 p-3 bg-gray-800/20 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1">HOURLY RATE</p>
                  <div className="flex items-end justify-end gap-1">
                    <span className="text-xl font-bold text-white">£{pricePerHour}</span>
                    <span className="text-xs text-gray-400 mb-0.5">/hour</span>
                  </div>
                </div>
              )}
              
              {/* Total Price - Futuristic Badge */}
              <div className="w-full mb-4">
                <div className="bg-gradient-to-r from-gray-800/70 to-gray-900/70 rounded-lg p-3 border border-gray-700/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-purple-600" />
                  <p className="text-xs text-gray-300 mb-1">TOTAL FOR {formatDurationText().toUpperCase()}</p>
                    {isContactMessage ? (
                      <div className="text-sm text-yellow-400">{totalPrice}</div>
                    ) : (
                      <p className="text-lg font-bold text-white">£{totalPrice.toFixed(2)}</p>
                    )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col gap-3 w-full">
                <motion.button
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium transition-all relative overflow-hidden group flex items-center justify-center"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(handleBookNow)}
                >
                  <span className="relative z-10 flex items-center">
                    Book Now 
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </motion.button>  
              </div>
            </div>
          </div>

          {/* Expanded Details */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 overflow-hidden"
              >
                <div className="pt-4 border-t border-gray-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse" />
                        FACILITIES
                      </h4>
                      <div className="space-y-2">
                        {['24/7 Security Monitoring', 'HD CCTV Coverage', 'EV Charging Stations', 'Free Shuttle Service', 'Covered Parking', '24/7 Customer Support'].map((item, i) => (
                          <div key={i} className="flex items-center">
                            <svg className="w-4 h-4 text-indigo-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span className="text-sm text-gray-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse" />
                        POLICIES
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-gray-400 mb-1">CANCELLATION</p>
                          <p className="text-sm text-gray-300">Free cancellation up to 24 hours before your booking</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-400 mb-1">INSURANCE</p>
                          <p className="text-sm text-gray-300">Full coverage included during parking period</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-400 mb-1">ACCESS</p>
                          <p className="text-sm text-gray-300">24/7 access with digital keycode</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};


export default ParkingCard