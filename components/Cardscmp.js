'use client';

import React from "react";
import { Card, CardBody, Image, Button } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function ParkingSpaceCard({
  title,
  details,
  price,
  pricePerHour,
  imageUrl,
  duration = { days: 0, hours: 0 },
  setSearching,
}) {
  const router = useRouter();

  const calculateTotalPrice = () => {
    return (price * duration.days) + (pricePerHour * duration.hours);
  };

  const handleBookNow = (parkingSpaceName) => {
    setSearching(true);
    
    // Save selection to session storage
    sessionStorage.setItem("selectedParkingSpace", parkingSpaceName);
    sessionStorage.setItem("selectedParkingDetails", JSON.stringify({
      title,
      totalPrice: calculateTotalPrice(),
    }));

    // Navigate to payment page
    setTimeout(() => {
      router.push(`/Paymentdetails/${encodeURIComponent(parkingSpaceName)}`);
    }, 500);
  };

  const formatDurationText = () => {
    const daysText = duration.days === 1 ? 'day' : 'days';
    const hoursText = duration.hours === 1 ? 'hour' : 'hours';
    return `${duration.days} ${daysText} ${duration.hours > 0 ? `and ${duration.hours} ${hoursText}` : ''}`;
  };

  return (
    <div className="w-full px-4 py-2 flex justify-center">
      <Card className="w-full max-w-4xl bg-white shadow-md rounded-xl overflow-hidden">
        <CardBody className="p-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image Section */}
            <div className="w-full md:w-1/3 flex-shrink-0 flex justify-center">
              <div className="relative aspect-video rounded-lg overflow-hidden ">
                <Image
                  alt={`${title} parking space`}
                  src={imageUrl || "https://blog.getmyparking.com/wp-content/uploads/2018/07/underground-parking.jpg"}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* Details Section */}
            <div className="flex-1 flex flex-col justify-between">
              <div className=" mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  {details?.split(".").filter(Boolean).map((line, index) => (
                    <p key={index}>{line.trim()}</p>
                  ))}
                </div>
              </div>

              {/* Pricing Section */}
              <div className="mt-4 md:mt-0">
                <div className="flex flex-wrap gap-4 mb-3">
                  <div className="bg-blue-50 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-blue-800">
                      £{price} <span className="text-gray-500">/day</span>
                    </span>
                  </div>
                  <div className="bg-blue-50 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-blue-800">
                      £{pricePerHour} <span className="text-gray-500">/hour</span>
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-semibold text-gray-800">
                    Total: <span className="text-blue-600">£{calculateTotalPrice().toFixed(2)}</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    For {formatDurationText()}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="w-full md:w-auto flex items-end">
              <Button 
                color="success" 
                className="w-full md:w-32 h-12 font-medium"
                onClick={() => handleBookNow(title)}
              >
                Book Now
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}