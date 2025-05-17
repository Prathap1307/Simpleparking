"use client";

import React, { useEffect, useState } from "react";
import { Card, CardBody, Button, Divider } from "@heroui/react";
import { Input } from "@heroui/input";
import Navbarcmp from "@/components/Navbar";
import { useParams, useRouter } from "next/navigation"; // import useRouter
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const countries = [
  { code: "+44", label: "UK" },
  { code: "+1", label: "USA" },
  { code: "+91", label: "India" },
  { code: "+61", label: "Australia" },
];

function CheckoutForm({ formData, selectedParking }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter(); // instantiate router

  const handlePay = async () => {
    if (!stripe || !elements) return;

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          licensePlate: formData.licensePlate,
          selectedParking,
          amount: 5000,
          productName: "Airport Parking",
        }),
      });

      const session = await response.json();

      const result = await stripe.redirectToCheckout({ sessionId: session.id });

      if (result.error) {
        alert(result.error.message);
      } else {
        // This else block rarely executes because redirectToCheckout usually redirects immediately
        // But just in case, you can redirect manually:
        router.push("/app/paymentsuccess");
      }
    } catch (error) {
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <Card className="mt-6 shadow-md">
      <CardBody className="space-y-4">
        <Button color="primary" className="w-full" onClick={handlePay}>
          Pay £50 Now
        </Button>
      </CardBody>
    </Card>
  );
}

export default function PaymentPage() {
  const params = useParams();
  const selectedParking = decodeURIComponent(params?.selectedAirport || "London Luton Airport");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    phoneCountry: "+44",
    phone: "",
    licensePlate: "",
  });

  const [searchData, setSearchData] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("parkingSearchData");
    if (stored) setSearchData(JSON.parse(stored));
  }, []);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const formatDateTime = (date) =>
    date
      ? new Date(date).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "N/A";

  return (
    <div className="bg-blue-400">
      <Navbarcmp />
      <main className="px-4 md:px-16 py-8 bg-white min-h-screen">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left: Form Section */}
          <section className="w-full lg:w-2/3 space-y-8">
            <Card className="shadow-md">
              <CardBody className="space-y-6">
                <h3 className="text-lg font-semibold">Your Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="First Name" value={formData.firstName} onChange={handleChange("firstName")} />
                  <Input label="Last Name" value={formData.lastName} onChange={handleChange("lastName")} />
                </div>
                <Input label="Email" value={formData.email} onChange={handleChange("email")} />
                <Input label="Confirm Email" value={formData.confirmEmail} onChange={handleChange("confirmEmail")} />
                <div className="grid grid-cols-4 gap-4">
                  <select
                    className="col-span-1 border rounded-md p-2 text-sm"
                    value={formData.phoneCountry}
                    onChange={handleChange("phoneCountry")}
                  >
                    {countries.map(({ code, label }) => (
                      <option key={code} value={code}>
                        {label} ({code})
                      </option>
                    ))}
                  </select>
                  <Input label="Phone" className="col-span-3" value={formData.phone} onChange={handleChange("phone")} />
                </div>
                <Input label="License Plate" value={formData.licensePlate} onChange={handleChange("licensePlate")} />
              </CardBody>
            </Card>

            <Elements stripe={stripePromise}>
              <CheckoutForm formData={formData} selectedParking={selectedParking} />
            </Elements>
          </section>

          {/* Right: Booking Summary */}
          <aside className="w-full lg:w-1/3">
            <Card className="shadow-md">
              <CardBody className="space-y-4">
                <h3 className="text-lg font-semibold">Booking Summary</h3>
                <Divider />
                <div className="text-sm space-y-2">
                  <p>
                    <strong>Airport:</strong> {searchData?.airport || "Not selected"}
                  </p>
                  <p>
                    <strong>Parking:</strong> {selectedParking}
                  </p>
                  <p>
                    <strong>Exit:</strong> {formatDateTime(searchData?.dropOffDate)}
                  </p>
                  <p>
                    <strong>Entry:</strong> {formatDateTime(searchData?.pickupDate)}
                  </p>
                  <p>
                    <strong>Booking Fee:</strong> £0
                  </p>
                  <Divider />
                  <p className="text-lg font-bold">Total: £50</p>
                </div>
              </CardBody>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
