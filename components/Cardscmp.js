"use client";

import React from "react";
import { Card, CardBody, Image, Button } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function Cardscmp({ title, details, price, imageUrl }) {
    
    const router = useRouter();

    const handleBookNow = (parkingSpaceName) => {
        // Save to sessionStorage
        sessionStorage.setItem("selectedParkingSpace", parkingSpaceName);

        // Redirect to the payment page with the parking space name in the URL
        router.push(`/Paymentdetails/${encodeURIComponent(parkingSpaceName)}`);
    };
    
  return (
    <div className="w-full flex justify-center">
      <Card
        isBlurred
        className="border-none bg-background/60 dark:bg-default-100/50 w-11/12 md:w-9/12 m-2"
        shadow="sm"
      >
        <CardBody>
          <div className="grid grid-cols-4 md:grid-cols-12 gap-6 md:gap-4">
            <div className="relative col-span-6 md:col-span-4">
              <Image
                alt="Location image"
                className="object-cover"
                height={200}
                shadow="md"
                src={imageUrl || "https://heroui.com/images/album-cover.png"}
                width="100%"
              />
            </div>

            <div className="flex flex-col col-span-4 md:col-span-4 justify-center">
              <h3 className="font-semibold text-xl mt-2 mb-2">{title}</h3>
                {details
                    ?.split(".")
                    .filter((line) => line.trim() !== "")
                    .map((line, index) => (
                    <p key={index}>
                        {line.trim() + "."}
                    </p>
                    ))}
            </div>

            <div className="flex flex-col col-span-4 md:col-span-4 justify-center items-center p-4">
              <h3 className="font-semibold text-foreground/90">£ {price}</h3>
              <Button className="w-full text-white" color="success" onClick={()=>{handleBookNow(title)}}>Book Now</Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
