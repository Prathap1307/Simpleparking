"use client";

import React, { useEffect, useState } from "react";
import { Card, CardBody, Button, Divider } from "@heroui/react";
import { Input } from "@heroui/input";
import Navbarcmp from "@/components/Navbar";
import { useParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { motion, AnimatePresence } from "framer-motion";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const calculateTotalPrice = () => {
  return (price * duration.days) + (pricePerHour * duration.hours);
};


const countries = [
  { code: "+44", label: "UK" },
  { code: "+1", label: "USA" },
  { code: "+91", label: "India" },
  { code: "+61", label: "Australia" },
];

function mergeDateTime(date, time) {
  if (!date || !time) return null;
  const d = new Date(date);
  const t = new Date(time);
  d.setHours(t.getHours(), t.getMinutes(), 0, 0);
  return d;
}

function formatDateTime(dateObj) {
  if (!dateObj || isNaN(new Date(dateObj))) return "N/A";
  const date = new Date(dateObj);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

function calculateDuration(fromDate, fromTime, toDate, toTime) {
  const start = mergeDateTime(fromDate, fromTime);
  const end = mergeDateTime(toDate, toTime);
  if (!start || !end) return { days: 0, hours: 0 };

  const diffMs = end - start;
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffHrs / 24);
  const hours = diffHrs % 24;
  return { days, hours };
}

function CheckoutForm({ formData, selectedParking, clientSecret, searchData, totalPrice }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    sessionStorage.setItem('customerDetails', JSON.stringify(formData));

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
      redirect: "always", // Force redirect for all payment methods
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      alert("Payment and booking successful!");
      router.push("/success");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mt-6 shadow-md">
        <CardBody className="space-y-4">
          <PaymentElement />
          <Button color="primary" className="w-full mt-4" type="submit" disabled={!stripe}>
            Pay Now
          </Button>
        </CardBody>
      </Card>
    </form>
  );
}

export default function PaymentPage() {
   const params = useParams();
    const selectedParking = decodeURIComponent(params?.paymentdetailsbasedonparking || "London Luton Airport");
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
  const [clientSecret, setClientSecret] = useState(null);
  const [selectedParkingDetails, setSelectedParkingDetails] = useState(null);
  const [showMobileSummary, setShowMobileSummary] = useState(false);
  
    useEffect(() => {
      const storedDetails = sessionStorage.getItem("selectedParking");
      if (storedDetails) {
        const parsed = JSON.parse(storedDetails);
        setSelectedParkingDetails(parsed);
      }
  
      const storedSearch = sessionStorage.getItem("parkingSearchData");
      if (storedSearch) {
        setSearchData(JSON.parse(storedSearch));
      }
    }, []);
  
    const totalPrice = selectedParkingDetails?.totalPrice || 0;
  
    useEffect(() => {
      if (!totalPrice) return;
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          licensePlate: formData.licensePlate,
          selectedParking: selectedParkingDetails?.title,
          amount: Math.round(totalPrice * 100),
        }),
      })
        .then((res) => res.json())
        .then((data) => data.clientSecret && setClientSecret(data.clientSecret))
        .catch(console.error);
    }, [totalPrice, formData.email, formData.licensePlate]);
  
    const handleChange = (field) => (e) =>
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  
    const { days, hours } = calculateDuration(
      searchData?.dropOffDate,
      searchData?.dropOffTime,
      searchData?.pickupDate,
      searchData?.pickupTime
    );

  const bookingSummary = (
    <Card className="shadow-lg rounded-xl ">
      <CardBody className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">Booking Summary</h3>
        <Divider />
        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex justify-between mb-4">
            <span>Airport:</span>
            <span className="font-medium">{searchData?.airport || "Not selected"}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Parking:</span>
            <span className="font-medium">{selectedParking}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>From:</span>
            <span className="font-medium">{formatDateTime(mergeDateTime(searchData?.dropOffDate, searchData?.dropOffTime))}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>To:</span>
            <span className="font-medium">{formatDateTime(mergeDateTime(searchData?.pickupDate, searchData?.pickupTime))}</span>
          </div>
          <Divider />
          <div className="flex justify-between pt-2">
            <span>Total:</span>
            <div className="text-right">
              <p className="text-lg font-bold text-black">£{totalPrice.toFixed(2)}</p>
              {searchData && (() => {
                const { days, hours } = calculateDuration(
                  searchData?.dropOffDate,
                  searchData?.dropOffTime,
                  searchData?.pickupDate,
                  searchData?.pickupTime
                );
                return (
                  <div className="text-xs text-gray-500">
                    For {days} day{days !== 1 ? "s" : ""} {hours} hour{hours !== 1 ? "s" : ""}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <div className="bg-blue-400">
      <Navbarcmp />
      <main className="px-4 md:px-16 py-8 bg-gray-50 min-h-screen mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
          <section className="w-full lg:w-2/3">
            <Card className="shadow-lg rounded-xl border border-gray-100 overflow-hidden">
              <CardBody className="p-8 space-y-8">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">Your Details</h3>
                  <p className="text-gray-500">We'll use this information for your booking confirmation</p>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <Input 
                        label="First Name" 
                        value={formData.firstName} 
                        onChange={handleChange("firstName")}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <Input 
                        label="Last Name" 
                        value={formData.lastName} 
                        onChange={handleChange("lastName")}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Input 
                      label="Email Address" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleChange("email")}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <Input 
                      label="Confirm Email Address" 
                      type="email" 
                      value={formData.confirmEmail} 
                      onChange={handleChange("confirmEmail")}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="flex gap-3">
                      <select 
                        className="w-1/4 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                        value={formData.phoneCountry} 
                        onChange={handleChange("phoneCountry")}
                      >
                        {countries.map(c => (
                          <option key={c.code} value={c.code}>
                            {c.label} ({c.code})
                          </option>
                        ))}
                      </select>
                      <Input 
                        className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        value={formData.phone} 
                        onChange={handleChange("phone")} 
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Input 
                      label="License Plate" 
                      value={formData.licensePlate} 
                      onChange={handleChange("licensePlate")}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="e.g. AB12 CDE"
                    />
                  </div>
                </div>
              </CardBody>
            </Card>

            {clientSecret && (
              <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm
                    formData={formData}
                    selectedParking={selectedParking}
                    clientSecret={clientSecret}
                    searchData={searchData}
                    totalPrice={totalPrice}
                  />
                </Elements>
              </div>
            )}
          </section>

            <aside className="hidden lg:block w-full lg:w-1/3 sticky top-24">
              {bookingSummary}
            </aside>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Summary with animation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white shadow-lg border-t border-gray-200">
        <div
          className="flex justify-between items-center px-4 py-4 cursor-pointer bg-blue-600 active:bg-blue-700 transition-colors duration-200 rounded-t-lg"
          onClick={() => setShowMobileSummary(prev => !prev)}
        >
          <span className="text-white font-semibold text-lg">£{totalPrice?.toFixed(2) || "0.00"}</span>
          <span className="text-white font-semibold flex items-center space-x-2">
            <span>Booking Summary</span>
            <span className="text-white transform transition-transform duration-200">
              {showMobileSummary ? "↓" : "↑"}
            </span>
          </span>
        </div>
        <AnimatePresence>
          {showMobileSummary && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-white">{bookingSummary}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
