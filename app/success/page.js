'use client';

import { useEffect, useState } from 'react';
import { Button, Divider } from "@heroui/react";
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';

export default function SuccessPage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [searchData, setSearchData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Unified data retrieval and validation
  useEffect(() => {
    const loadData = () => {
      try {
        // Try new combined format first
        const combinedData = sessionStorage.getItem('bookingDetails');
        if (combinedData) {
          const parsed = JSON.parse(combinedData);
          setBookingData({
            title: parsed.ParkingSlot,
            totalPrice: parseFloat(parsed.PaidAmount) || 0
          });
          setCustomerDetails({
            firstName: parsed.ParkingName?.split(' ')[0] || 'N/A',
            lastName: parsed.ParkingName?.split(' ')[1] || 'N/A',
            email: parsed.CustomerEmail || 'N/A',
            phone: parsed.CustomerPhone || 'N/A',
            licensePlate: parsed.CarNumber || 'N/A'
          });
          setSearchData({
            dropOffDate: parsed.FromDate,
            dropOffTime: parsed.FromTime,
            pickupDate: parsed.ToDate,
            pickupTime: parsed.ToTime,
            airport: parsed.Airport
          });
        } 
        // Fallback to legacy separate items
        else {
          const parking = JSON.parse(sessionStorage.getItem('selectedParking') || 'null');
          const search = JSON.parse(sessionStorage.getItem('parkingSearchData') || 'null');
          const customer = JSON.parse(sessionStorage.getItem('customerDetails') || 'null');

          if (!parking || !search || !customer) {
            throw new Error('Missing required session data');
          }

          setBookingData(parking);
          setSearchData(search);
          setCustomerDetails(customer);
        }

        setPaymentMethod('Credit Card');
        setLoading(false);
      } catch (error) {
        console.error('Failed to load booking data:', error);
        sessionStorage.clear();
        router.push('/');
      }
    };

    loadData();
  }, [router]);

  
  function mergeDateTime(date, time) {
    if (!date || !time) return null;
    const [hours, minutes] = time.split(':').map(Number);
    const dateObj = new Date(date);
    dateObj.setHours(hours, minutes, 0, 0);
    return dateObj;
  }

  function formatDateTime(dateObj) {
    if (!dateObj || isNaN(new Date(dateObj))) return "N/A";
    const date = new Date(dateObj);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  const generatePDF = () => {
    if (!bookingData || !customerDetails || !searchData) return;

    const doc = new jsPDF();
    
    // Add logo or header
    doc.setFontSize(22);
    doc.setTextColor(40, 103, 248);
    doc.text('Parking Booking Confirmation', 105, 20, { align: 'center' });
    
    // Add customer details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Customer: ${customerDetails.firstName} ${customerDetails.lastName}`, 20, 40);
    doc.text(`Email: ${customerDetails.email}`, 20, 50);
    doc.text(`Phone: ${customerDetails.phoneCountry} ${customerDetails.phone}`, 20, 60);
    
    // Add booking details
    doc.setFontSize(14);
    doc.text('Booking Details', 20, 80);
    doc.setFontSize(12);
    doc.text(`Parking Location: ${bookingData.title}`, 20, 90);
    doc.text(`Vehicle: ${customerDetails.licensePlate}`, 20, 100);
    
    // Add date/time details
    doc.text(`From: ${formatDateTime(mergeDateTime(searchData.dropOffDate, searchData.dropOffTime))}`, 20, 110);
    doc.text(`To: ${formatDateTime(mergeDateTime(searchData.pickupDate, searchData.pickupTime))}`, 20, 120);
    
    // Add payment details
    doc.setFontSize(14);
    doc.text('Payment Information', 20, 140);
    doc.setFontSize(12);
    doc.text(`Payment Method: ${paymentMethod}`, 20, 150);
    doc.text(`Amount Paid: £${bookingData.totalPrice.toFixed(2)}`, 20, 160);
    doc.text(`Payment Date: ${new Date().toLocaleDateString()}`, 20, 170);
    
    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for your booking!', 105, 280, { align: 'center' });
    
    doc.save(`parking-invoice-${new Date().getTime()}.pdf`);
  };


  
  useEffect(() => {
    // Retrieve all stored data
    const storedBooking = sessionStorage.getItem('selectedParking');
    const storedSearch = sessionStorage.getItem('parkingSearchData');
    const storedCustomer = sessionStorage.getItem('customerDetails');

    if (storedBooking && storedSearch && storedCustomer) {
      const booking = JSON.parse(storedBooking);
      const customer = JSON.parse(storedCustomer);
      const search = JSON.parse(storedSearch);

      setBookingData(booking);
      setCustomerDetails(customer);
      setSearchData(search);
      setPaymentMethod('Credit Card');

      // Send confirmation email
      sendConfirmationEmail(booking, customer, search);
    } else {
      router.push('/');
    }
  }, [router]);

  const sendConfirmationEmail = async (booking, customer, search) => {
  try {
    const response = await fetch('/api/send-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingData: booking,
        customerDetails: customer,
        searchData: search,
        paymentMethod: 'Credit Card',
      }),
    });

    if (!response.ok) {
      console.error('Failed to send email:', await response.text()); // Log the error
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

  if (!bookingData || !customerDetails || !searchData) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h1 className="text-3xl font-bold text-green-600 mt-4">Payment Successful!</h1>
            <p className="mt-2 text-gray-600">Your booking has been confirmed. { /* A receipt has been sent to {customerDetails.email} */} </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
            
            <div className="mb-4">
              <p className="text-gray-600">Airport</p>
              <p className="font-medium text-lg">{searchData.airport || 'N/A'}</p>
            </div>

            <div className="mb-4">
              <p className="text-gray-600">Parking Location</p>
              <p className="font-medium text-lg">{bookingData.title}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-600">From</p>
                <p className="font-medium">
                  {formatDateTime(mergeDateTime(searchData.dropOffDate, searchData.dropOffTime))}
                </p>
              </div>
              <div>
                <p className="text-gray-600">To</p>
                <p className="font-medium">
                  {formatDateTime(mergeDateTime(searchData.pickupDate, searchData.pickupTime))}
                </p>
              </div>
            </div>

            <Divider className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Customer Name</p>
                <p className="font-medium">{customerDetails.firstName} {customerDetails.lastName}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{customerDetails.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Phone</p>
                <p className="font-medium">{customerDetails.phoneCountry} {customerDetails.phone}</p>
              </div>
              <div>
                <p className="text-gray-600">Vehicle</p>
                <p className="font-medium">{customerDetails.licensePlate}</p>
              </div>
            </div>

            <Divider className="my-4" />

            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600">Payment Method</p>
                <p className="font-medium">{paymentMethod}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-blue-600">£{bookingData.totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              color="primary" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={generatePDF}
            >
              Download Invoice (PDF)
            </Button>
            <Button 
              color="secondary" 
              className="bg-gray-200 hover:bg-gray-300 text-gray-800"
              onClick={() => router.push('/')}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}