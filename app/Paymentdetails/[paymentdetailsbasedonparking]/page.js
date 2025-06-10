"use client";

import React, { useEffect, useState } from "react";
import { Card, CardBody, Button, Divider } from "@heroui/react";
import { Input } from "@heroui/input";
import Navbarcmp from "@/components/Navbar";
import { useParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

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

    // Set the hours and minutes from time picker
    d.setHours(t.getHours());
    d.setMinutes(t.getMinutes());
    d.setSeconds(0);
    d.setMilliseconds(0);

    return d;
  }


function formatDateTime(dateObj) {
  if (!dateObj || isNaN(new Date(dateObj))) return "N/A";

  const date = new Date(dateObj);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}



function CheckoutForm({ formData, selectedParking, clientSecret, searchData, totalPrice }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required",
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      const fromDateTime = mergeDateTime(searchData?.dropOffDate, searchData?.dropOffTime);
      const toDateTime = mergeDateTime(searchData?.pickupDate, searchData?.pickupTime);

      const formatLocalISO = (date) => {
        if (!date) return "";
        const pad = (n) => n.toString().padStart(2, "0");
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
      };

      // 🆕 Generate OrderId
      let newOrderId = "";
      try {
        const bookingsRes = await fetch("/api/Todaysbooking", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const bookings = await bookingsRes.json();

        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear().toString().slice(-2);
        const prefix = `Simplepark-0${String(currentMonth).padStart(2, "0")}${currentYear}`;

        const lastOrderNumbers = bookings
          .map(b => b.OrderId)
          .filter(id => id?.startsWith(prefix))
          .map(id => parseInt(id?.slice(-2))) // assumes last 2 digits are order number
          .filter(n => !isNaN(n))
          .sort((a, b) => b - a);

        const nextNumber = lastOrderNumbers.length > 0 ? lastOrderNumbers[0] + 1 : 1;
        newOrderId = `${prefix}${String(nextNumber).padStart(2, "0")}`;
      } catch (fetchError) {
        console.warn("Failed to generate OrderId, fallback to default.");
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear().toString().slice(-2);
        newOrderId = `Simplepark-0${String(currentMonth).padStart(2, "0")}${currentYear}01`;
      }

      // 🆕 Combine first and last name
      const customerFullName = `${formData.firstName || ""} ${formData.lastName || ""}`.trim();

      // 📝 Booking payload
      const payload = {
        Airport: searchData?.airport || 'Unknown',
        CarNumber: formData.licensePlate || '',
        createdAt: new Date().toISOString(),
        CustomerEmail: formData.email || '',
        CustomerPhone: `${formData.phoneCountry}${formData.phone}` || '',
        CustomerName: customerFullName, // 🆕 Save full name
        FromDateTime: fromDateTime ? formatLocalISO(fromDateTime) : '',
        ToDateTime: toDateTime ? formatLocalISO(toDateTime) : '',
        Location: searchData?.location || 'Unknown',
        PaidAmount: totalPrice || 0,
        ParkingName: selectedParking || 'N/A',
        ParkingSlot: searchData?.selectedSlot || 'N/A',
        PaymentMethod: 'Stripe',
        Status: 'Confirmed',
        OrderId: newOrderId, // 🆕 Save OrderId
      };

      try {
        const res = await fetch("/api/Todaysbooking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result?.error || "Booking save failed");

        alert("Payment and booking successful!");
        router.push("/success");
      } catch (err) {
        console.error("Booking API error:", err.message);
        alert("Payment succeeded but booking failed.");
      }
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
  const router = useRouter();
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
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const storedDetails = sessionStorage.getItem("selectedParkingDetails");
    if (storedDetails) {
      try {
        const parsed = JSON.parse(storedDetails);
        setTotalPrice(parsed.totalPrice || 0);
      } catch (error) {
        console.error("Invalid parking details in session storage:", error);
      }
    }
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem("parkingSearchData");
    if (stored) setSearchData(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!totalPrice) return;

    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        licensePlate: formData.licensePlate,
        selectedParking,
        amount: Math.round(totalPrice * 100),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        }
      });
  }, [totalPrice, formData.email, formData.licensePlate, selectedParking]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="bg-blue-400">
      <Navbarcmp />
      <main className="px-4 md:px-16 py-8 bg-white min-h-screen">
        <div className="flex flex-col lg:flex-row gap-10">
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

            {clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm
                  formData={formData}
                  selectedParking={selectedParking}
                  clientSecret={clientSecret}
                  searchData={searchData}
                  totalPrice={totalPrice}
                />
              </Elements>
            )}
          </section>

          <aside className="w-full lg:w-1/3">
            <Card className="shadow-md">
              <CardBody className="space-y-4">
                <h3 className="text-lg font-semibold">Booking Summary</h3>
                <Divider />
                <div className="text-sm space-y-2">
                  <p><strong>Airport:</strong> {searchData?.airport || "Not selected"}</p>
                  <p><strong>Parking:</strong> {selectedParking}</p>
                  <p><strong>From:</strong> {formatDateTime(mergeDateTime(searchData?.dropOffDate, searchData?.dropOffTime))}</p>
                  <p><strong>To:</strong> {formatDateTime(mergeDateTime(searchData?.pickupDate, searchData?.pickupTime))}</p>
                  <p><strong>Booking Fee:</strong> £0</p>
                  <Divider />
                  <p className="text-lg font-bold">Total : £{totalPrice?.toFixed(2) || "0.00"}</p>
                </div>
              </CardBody>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
