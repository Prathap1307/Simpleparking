'use client';

import React from "react";
import { Card, CardBody, Image, Button } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function Cardscmp({
  title,
  details,
  price,
  pricePerHour,
  imageUrl,
  duration = { days: 0, hours: 0 }, // <-- default value here
  setSearching,
}) {
  const router = useRouter();

  const totalPrice =
    (price * duration.days) + (pricePerHour * duration.hours);

  const handleBookNow = (parkingSpaceName) => {
    setSearching(true);
    setTimeout(() => {
      sessionStorage.setItem("selectedParkingSpace", parkingSpaceName);

      sessionStorage.setItem("selectedParkingDetails", JSON.stringify({
          title,
          totalPrice,
        }));

      router.push(`/Paymentdetails/${encodeURIComponent(parkingSpaceName)}`);
    }, 500);
  };

  return (
    <div className="w-full flex justify-center">
      <Card className="w-11/12 md:w-9/12 m-2 bg-white shadow-lg">
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Image
                alt="Location image"
                src={imageUrl || "https://heroui.com/images/album-cover.png"}
                className="object-cover w-full h-48"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-xl font-semibold">{title}</h3>
              {details?.split(".").filter(Boolean).map((line, index) => (
                <p key={index}>{line.trim()}.</p>
              ))}
            </div>
            <div className="flex flex-col justify-center items-center text-center">
              <p className="text-gray-700 text-sm">£{price} per day</p>
              <p className="text-gray-700 text-sm">£{pricePerHour} per hour</p>
              <p className="text-lg font-semibold mt-2"> Total: £{totalPrice.toFixed(2)} for {duration.days} {duration.days === 1 ? 'day' : 'days'} and {duration.hours} {duration.hours === 1 ? 'hour' : 'hours'}</p>
              <Button color="success" className="mt-2 w-full" onClick={() => handleBookNow(title)}>
                Book Now
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
