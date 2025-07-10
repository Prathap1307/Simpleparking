"use client";

import React, { useEffect, useState } from "react";
import { Card, CardBody, Button, Divider, Spinner } from "@heroui/react";
import { Input } from "@heroui/input";
import Navbarcmp from "@/components/Navbar";
import { useParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { motion, AnimatePresence } from "framer-motion";
import { processCustomerData } from "@/utils/customerUtils";
import sendBookingEmail from "@/utils/sendBookingEmail";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const countries = [
  { code: "+44", label: "UK" },
  { code: "+1", label: "USA" },
  { code: "+91", label: "India" },
  { code: "+61", label: "Australia" },
];

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "N/A";
  }
};

const formatTime = (dateString) => {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error("Error formatting time:", error);
    return "N/A";
  }
};

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

  const createBooking = async (bookingData) => {
    try {
      const response = await fetch("/api/Todaysbooking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        throw new Error("Failed to create booking");
      }

      return await response.json();
    } catch (error) {
      console.error("Booking creation error:", error);
      throw error;
    }
  };

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
      if (!validateForm()) return;

      const orderId = await generateOrderId();

      const bookingData = {
        ParkingName: `${formData.firstName} ${formData.lastName}`,
        CustomerEmail: formData.email,
        CustomerPhone: `${formData.phoneCountry}${formData.phone}`,
        FromDate: searchData.dropOffDate,
        FromTime: searchData.dropOffTime,
        ToDate: searchData.pickupDate,
        ToTime: searchData.pickupTime,
        PaidAmount: (totalPrice / 100).toFixed(2),
        PaymentMethod: "card",
        CarNumber: formData.licensePlate,
        Airport: searchData.airport,
        Location: selectedParking,
        Status: "pending_payment",
        OrderId: orderId,
        bookingDate: new Date().toISOString().split('T')[0],
        bookingTime: new Date().toTimeString().split(' ')[0],
        createdAt: new Date().toISOString(),
        DepartureTerminal: formData.departureTerminal,
        DepartureFlightNumber: formData.departureFlightNumber,
        ReturnTerminal: formData.returnTerminal,
        ReturnFlightNumber: formData.returnFlightNumber
      };

      const customerData = {
        ParkingName: bookingData.customerName,
        CustomerEmail: bookingData.CustomerEmail,
        CustomerPhone: bookingData.CustomerPhone,
        CarNumber: bookingData.CarNumber,
        Airport: bookingData.Airport,
        OrderId: bookingData.OrderId
      };

      await processCustomerData(customerData);

      await sendBookingEmail({
        customerName: bookingData.ParkingName,
        customerEmail: bookingData.CustomerEmail,
        orderId: bookingData.OrderId,
        bookingDate: bookingData.bookingDate,
        fromDate: bookingData.FromDate,
        fromTime: bookingData.FromTime,
        toDate: bookingData.ToDate,
        toTime: bookingData.ToTime,
        airport: bookingData.Airport,
        carNumber: bookingData.CarNumber,
        parkingSlot: bookingData.Location,
        paidAmount: bookingData.PaidAmount,
        paymentMethod: bookingData.PaymentMethod,
        Departure_Terminal: bookingData.DepartureTerminal,
        Departure_Flight: bookingData.DepartureFlightNumber,
        Arrival_Terminal: bookingData.ReturnTerminal,
        Arrival_Flight: bookingData.ReturnFlightNumber
        
      });
      
      const bookingResponse = await createBooking(bookingData);
      if (!bookingResponse?.id) throw new Error('Failed to create booking');

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/result`,
        },
        redirect: 'if_required'
      });

      const updateBookingStatus = async (bookingId, status) => {
        try {
          const response = await fetch('/api/update-booking', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: bookingId,
              status: status,
              paymentIntentId: paymentIntent?.id || null
            })
          });

          if (!response.ok) {
            throw new Error('Failed to update booking status');
          }
          return await response.json();
        } catch (err) {
          console.error('Status update error:', err);
          throw err;
        }
      };

      if (error) {
        await updateBookingStatus(bookingResponse.id, 'payment_failed');
        throw error;
      }

      if (paymentIntent?.status === "succeeded") {
        await updateBookingStatus(bookingResponse.id, 'confirmed');
        router.push(`/payment/success?bookingId=${bookingResponse.id}`);
      } else {
        await updateBookingStatus(bookingResponse.id, 'pending');
        router.push(`/payment/pending?bookingId=${bookingResponse.id}`);
      }

    } catch (error) {
      console.error('Payment error:', error);
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

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const [totalPrice, setTotalPrice] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    phoneCountry: "+44",
    phone: "",
    licensePlate: "",
    departureTerminal: "",
    departureFlightNumber: "",
    returnTerminal: "",
    returnFlightNumber: ""
  });
  const [searchData, setSearchData] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [selectedParkingDetails, setSelectedParkingDetails] = useState(null);
  const [showMobileSummary, setShowMobileSummary] = useState(false);
  const [terminals, setTerminals] = useState([]);
  const [loadingTerminals, setLoadingTerminals] = useState(false);

  const selectedParking = decodeURIComponent(params?.paymentdetailsbasedonparking || "London Luton Airport");

  useEffect(() => {
    const loadSessionData = async () => {
      const storedDetails = sessionStorage.getItem("selectedParking");
      const storedSearch = sessionStorage.getItem("parkingSearchData");
      
      if (storedDetails) {
        const parsedDetails = JSON.parse(storedDetails);
        setSelectedParkingDetails(parsedDetails);
        
        if (parsedDetails.totalPrice) {
          setTotalPrice(parsedDetails.totalPrice);
        }
      }
      
      if (storedSearch) {
        const parsedSearch = JSON.parse(storedSearch);
        setSearchData(parsedSearch);
        
        // Fetch terminals when search data is available
        if (parsedSearch.airport) {
          fetchTerminals(parsedSearch.airport);
        }
      }
    };

    loadSessionData();
  }, []);

  const fetchTerminals = async (airportName) => {
    try {
      setLoadingTerminals(true);
      const response = await fetch(`/api/airports?name=${encodeURIComponent(airportName)}`);
      if (!response.ok) throw new Error('Failed to fetch airport data');
      
      const data = await response.json();
      
      // Handle both numeric terminals (5) and array formats
      let terminalOptions = [];
      
      if (data && data.Terminals) {
        // If Terminals is a number (like 5)
        if (!isNaN(data.Terminals)) {
          const terminalCount = parseInt(data.Terminals);
          terminalOptions = Array.from({ length: terminalCount }, (_, i) => ({
            value: `Terminal ${i + 1}`,
            label: `Terminal ${i + 1}`
          }));
        } 
        // If Terminals is already an array of objects
        else if (Array.isArray(data.Terminals)) {
          terminalOptions = data.Terminals.map(terminal => ({
            value: terminal.value || terminal.name || `Terminal ${terminal.id}`,
            label: terminal.label || terminal.name || `Terminal ${terminal.id}`
          }));
        }
      }
      
      // If no terminals found, create default options
      if (terminalOptions.length === 0) {
        terminalOptions = Array.from({ length: 5 }, (_, i) => ({
          value: `Terminal ${i + 1}`,
          label: `Terminal ${i + 1}`
        }));
      }
      
      setTerminals(terminalOptions);
    } catch (error) {
      console.error('Error fetching terminals:', error);
      // Fallback to 5 terminals if API fails
      setTerminals(Array.from({ length: 5 }, (_, i) => ({
        value: `Terminal ${i + 1}`,
        label: `Terminal ${i + 1}`
      })));
    } finally {
      setLoadingTerminals(false);
    }
  };

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

  const handleSelectChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

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
              {formatDate(searchData?.dropOffDate)} {formatTime(searchData?.dropOffTime)}
            </span>
          </div>
          <div className="flex justify-between mb-4">
            <span>To:</span>
            <span className="font-medium">
               {formatDate(searchData?.pickupDate)} {formatTime(searchData?.pickupTime)}
            </span>
          </div>
          <Divider />
          <div className="flex justify-between pt-2">
            <span>Total:</span>
            <div className="text-right">
              <p className="text-lg font-bold text-black">£{totalPrice.toFixed(2)}</p>
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

                    {/* Travel Details Section */}
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Travel Details</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Departure Terminal
                          </label>
                          <select
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                            value={formData.departureTerminal}
                            onChange={handleSelectChange("departureTerminal")}
                            required
                            disabled={loadingTerminals}
                          >
                            <option value="">Select Terminal</option>
                            {terminals.map((terminal) => (
                              <option key={terminal.value} value={terminal.value}>
                                {terminal.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <Input
                            label="Departure Flight Number"
                            value={formData.departureFlightNumber}
                            onChange={handleChange("departureFlightNumber")}
                            placeholder="e.g. BA123"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Return Terminal
                          </label>
                          <select
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                            value={formData.returnTerminal}
                            onChange={handleSelectChange("returnTerminal")}
                            required
                            disabled={loadingTerminals}
                          >
                            <option value="">Select Terminal</option>
                            {terminals.map((terminal) => (
                              <option key={terminal.value} value={terminal.value}>
                                {terminal.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <Input
                            label="Return Flight Number"
                            value={formData.returnFlightNumber}
                            onChange={handleChange("returnFlightNumber")}
                            placeholder="e.g. BA124"
                            required
                          />
                        </div>
                      </div>
                    </div>
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
                      setTotalPrice={setTotalPrice}
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