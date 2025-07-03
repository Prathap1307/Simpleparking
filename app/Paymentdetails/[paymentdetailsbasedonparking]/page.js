"use client";

import React, { useEffect, useState } from "react";
import { Card, CardBody, Button, Divider, Spinner } from "@heroui/react";
import { Input } from "@heroui/input";
import Navbarcmp from "@/components/Navbar";
import { useParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { motion, AnimatePresence } from "framer-motion";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const countries = [
  { code: "+44", label: "UK" },
  { code: "+1", label: "USA" },
  { code: "+91", label: "India" },
  { code: "+61", label: "Australia" },
];


  function mergeDateTime(date, time) {
  if (!date || !time) return null;
  
  // Handle different date formats
  const dateObj = new Date(date.includes('T') ? date : `${date}T00:00:00`);
  const [hours, minutes] = time.split(':').map(Number);
  
  dateObj.setHours(hours, minutes, 0, 0);
  return dateObj;
}

const formatDateTime  = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return "N/A";
  
  try {
    // Combine date and time into ISO format
    const dateTime = new Date(`${dateStr}T${timeStr}`);
    return dateTime.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return "N/A";
  }
};

const calculateDuration = (startDate, startTime, endDate, endTime) => {
  try {
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const diffMs = end - start;
    
    // Handle negative duration (invalid date range)
    if (diffMs < 0) return { days: 0, hours: 0 };
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    return {
      days: Math.floor(diffHours / 24),
      hours: diffHours % 24
    };
  } catch {
    return { days: 0, hours: 0 };
  }
};

// Enhanced Checkout Form Component
const CheckoutForm = ({ 
  formData, 
  selectedParking, 
  clientSecret, 
  searchData, 
  totalPrice,
  onProcessingChange 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  // Import or define generateOrderId function here
  const generateOrderId = async () => {
    try {
      const res = await fetch("/api/Todaysbooking");
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const existingBookings = await res.json();

      const now = new Date();
      const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
      const currentYear = String(now.getFullYear()).slice(-2);

      const currentMonthPrefix = `simpleparking${currentMonth}${currentYear}`;
      const currentMonthOrders = existingBookings
        .filter(booking => booking.OrderId?.startsWith(currentMonthPrefix))
        .sort((a, b) => {
          const aNum = parseInt(a.OrderId.split('-')[1] || 0);
          const bNum = parseInt(b.OrderId.split('-')[1] || 0);
          return aNum - bNum;
        });

      const lastOrder = currentMonthOrders[currentMonthOrders.length - 1];
      const nextOrderNum = lastOrder 
        ? parseInt(lastOrder.OrderId.split('-')[1]) + 1 
        : 1;

      return `${currentMonthPrefix}-${String(nextOrderNum).padStart(2, '0')}`;
    } catch (error) {
      console.error("Error generating OrderId:", error);
      // Fallback ID if generation fails
      const now = new Date();
      const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
      const currentYear = String(now.getFullYear()).slice(-2);
      return `simpleparking${currentMonth}${currentYear}-99`;
    }
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    onProcessingChange(true);

    try {
      // 1. Validate form data
      if (!validateForm()) {
        setProcessing(false);
        onProcessingChange(false);
        return;
      }

      // 2. Generate Order ID
      const orderId = await generateOrderId();

      // 3. Prepare booking data
      const now = new Date();
      const bookingData = {
        OrderId: orderId,
        ParkingName: `${formData.firstName} ${formData.lastName}`.trim(),
        CustomerEmail: formData.email,
        CustomerPhone: `${formData.phoneCountry}${formData.phone}`,
        FromDate: searchData.dropOffDate,
        FromTime: searchData.dropOffTime,
        ToDate: searchData.pickupDate,
        ToTime: searchData.pickupTime,
        PaidAmount: totalPrice.toFixed(2),
        PaymentMethod: 'Card',
        CarNumber: formData.licensePlate,
        Location: selectedParking,
        Airport: searchData.airport || 'N/A',
        ParkingSlot: selectedParking,
        Status: 'pending_payment',
        bookingDate: now.toISOString().split('T')[0],
        bookingTime: now.toTimeString().split(' ')[0],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      };

      sessionStorage.setItem('bookingDetails', JSON.stringify(bookingData));
      sessionStorage.setItem('selectedParking', JSON.stringify(selectedParking));
      sessionStorage.setItem('customerDetails', JSON.stringify(formData));
      sessionStorage.setItem('parkingSearchData', JSON.stringify(searchData));

      // 4. First create the booking record
      const createResponse = await fetch('/api/Todaysbooking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });


      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      const createdBooking = await createResponse.json();

      // 5. Process payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
          receipt_email: formData.email,
        },
        redirect: 'if_required'
      });

      if (error) {
        // Update booking status to failed if payment fails
        await fetch(`/api/Todaysbooking?id=${createdBooking.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Status: 'payment_failed',
            updatedAt: new Date().toISOString()
          })
        });
        throw error;
      }

      // 6. If payment succeeded, update booking status
      if (paymentIntent?.status === "succeeded") {
        const updateResponse = await fetch(`/api/Todaysbooking?id=${createdBooking.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Status: 'confirmed',
            paymentIntentId: paymentIntent.id,
            updatedAt: new Date().toISOString()
          })
        });

        if (!updateResponse.ok) {
          throw new Error('Failed to update booking status');
        }

        // Store booking details for success page
        sessionStorage.setItem('bookingDetails', JSON.stringify({
          ...bookingData,
          id: createdBooking.id,
          paymentIntentId: paymentIntent.id,
          Status: 'confirmed'
        }));
        

      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(`Payment failed: ${error.message}`);
    } finally {
      setProcessing(false);
      onProcessingChange(false);
    }
  };


  const validateForm = () => {
    if (formData.email !== formData.confirmEmail) {
      alert('Email addresses do not match');
      return false;
    }
    if (!formData.licensePlate) {
      alert('Please enter your license plate number');
      return false;
    }
    return true;
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mt-6 shadow-md">
        <CardBody className="space-y-4">
          <PaymentElement options={{ layout: 'tabs' }} />
          <Button 
            color="primary" 
            className="w-full mt-4" 
            type="submit" 
            disabled={!stripe || processing}
          >
            {processing ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Processing...
              </>
            ) : 'Pay Now'}
          </Button>
        </CardBody>
      </Card>
    </form>
  );
};

// Main Payment Page Component
export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const [totalPrice, setTotalPrice] = useState(0); // Add this state
  const [processing, setProcessing] = useState(false);
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

  const selectedParking = decodeURIComponent(params?.paymentdetailsbasedonparking || "London Luton Airport");


  useEffect(() => {
    const loadSessionData = () => {
      const storedDetails = sessionStorage.getItem("selectedParking");
      const storedSearch = sessionStorage.getItem("parkingSearchData");
      
      if (storedDetails) {
        const parsedDetails = JSON.parse(storedDetails);
        setSelectedParkingDetails(parsedDetails);
        
        // Ensure totalPrice is set correctly
        if (parsedDetails.totalPrice) {
          setTotalPrice(parsedDetails.totalPrice);
        }
      }
      
      if (storedSearch) {
        const parsedSearch = JSON.parse(storedSearch);
        setSearchData(parsedSearch);
      }
    };

    loadSessionData();
  }, []);

  useEffect(() => {
    if (!totalPrice) return;

    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            licensePlate: formData.licensePlate,
            selectedParking: selectedParkingDetails?.title,
            amount: Math.round(totalPrice * 100),
          }),
        });

        const data = await response.json();
        if (data.clientSecret) setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Payment intent error:", error);
        alert("Failed to initialize payment");
      }
    };

    createPaymentIntent();
  }, [totalPrice, formData.email, formData.licensePlate]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const { days, hours } = calculateDuration(
    searchData?.dropOffDate,
    searchData?.dropOffTime,
    searchData?.pickupDate,
    searchData?.pickupTime
  );

  const bookingSummary = (
    <Card className="shadow-lg rounded-xl">
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
            <span className="font-medium">
              {formatDateTime(searchData?.dropOffDate)} {searchData?.dropOffTime}
            </span>
          </div>
          <div className="flex justify-between mb-4">
            <span>To:</span>
            <span className="font-medium">
              {formatDateTime(mergeDateTime(searchData?.pickupDate, searchData?.pickupTime))}
            </span>
          </div>
          <Divider />
          <div className="flex justify-between pt-2">
            <span>Total:</span>
            <div className="text-right">
              <p className="text-lg font-bold text-black">£{totalPrice.toFixed(2)}</p>
              <div className="text-xs text-gray-500">
                For {days} day{days !== 1 ? "s" : ""} {hours} hour{hours !== 1 ? "s" : ""}
              </div>
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
                    <p className="text-gray-500">
                      We'll use this information for your booking confirmation
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input 
                        label="First Name" 
                        value={formData.firstName} 
                        onChange={handleChange("firstName")}
                        required
                      />
                      <Input 
                        label="Last Name" 
                        value={formData.lastName} 
                        onChange={handleChange("lastName")}
                        required
                      />
                    </div>

                    <Input 
                      label="Email Address" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleChange("email")}
                      required
                    />

                    <Input 
                      label="Confirm Email Address" 
                      type="email" 
                      value={formData.confirmEmail} 
                      onChange={handleChange("confirmEmail")}
                      required
                    />

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <div className="flex gap-3">
                        <select 
                          className="w-1/4 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                          value={formData.phoneCountry} 
                          onChange={handleChange("phoneCountry")}
                          required
                        >
                          {countries.map(c => (
                            <option key={c.code} value={c.code}>
                              {c.label} ({c.code})
                            </option>
                          ))}
                        </select>
                        <Input 
                          className="flex-1"
                          value={formData.phone} 
                          onChange={handleChange("phone")}
                          required
                        />
                      </div>
                    </div>

                    <Input 
                      label="License Plate" 
                      value={formData.licensePlate} 
                      onChange={handleChange("licensePlate")}
                      placeholder="e.g. AB12 CDE"
                      required
                    />
                  </div>
                </CardBody>
              </Card>

              {clientSecret && (
                <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <Elements stripe={stripePromise} options={{ 
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        colorPrimary: '#3b82f6',
                        borderRadius: '8px'
                      }
                    }
                  }}>
                    <CheckoutForm
                      formData={formData}
                      selectedParking={selectedParking}
                      clientSecret={clientSecret}
                      searchData={searchData}
                      totalPrice={totalPrice}
                      setTotalPrice = {setTotalPrice}
                      onProcessingChange={setProcessing}
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

      {/* Mobile Bottom Summary */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white shadow-lg border-t border-gray-200">
        <div
          className="flex justify-between items-center px-4 py-4 cursor-pointer bg-blue-600 active:bg-blue-700 transition-colors duration-200 rounded-t-lg"
          onClick={() => setShowMobileSummary(prev => !prev)}
        >
          <span className="text-white font-semibold text-lg">
            £{totalPrice?.toFixed(2) || "0.00"}
          </span>
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