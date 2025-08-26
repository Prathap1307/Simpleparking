'use client';

import { useState, useEffect } from 'react';
import { Button, Spinner } from "@heroui/react";
import jsPDF from 'jspdf';
import { motion } from 'framer-motion';
import { formatDate } from '@/utils/formatting';
import { formatTime } from '@/utils/formatting';
import Navbarcmp from '@/components/Navbar';
import Footer from '@/components/Footer';

const ManageBooking = () => {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(true);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setBookingData(null);

    try {
      const response = await fetch('/api/Todaysbooking');
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const allBookings = await response.json();
      const foundBooking = allBookings.find(booking => {
        const bookingIdMatches = String(booking.OrderId).trim().toLowerCase() === orderId.trim().toLowerCase();
        const emailMatches = String(booking.CustomerEmail).trim().toLowerCase() === email.trim().toLowerCase();
        return bookingIdMatches && emailMatches;
      });

      if (foundBooking) {
        const transformedBooking = {
          id: foundBooking.OrderId,
          Airport: foundBooking.Airport,
          bookingDate: foundBooking.bookingDate,
          bookingTime: foundBooking.bookingTime,
          CarNumber: foundBooking.CarNumber,
          createdAt: foundBooking.createdAt,
          CustomerEmail: foundBooking.CustomerEmail,
          CustomerPhone: foundBooking.CustomerPhone,
          DepartureFlightNumber: foundBooking.DepartureFlightNumber,
          DepartureTerminal: foundBooking.DepartureTerminal,
          FromDate: foundBooking.FromDate,
          FromTime: foundBooking.FromTime,
          Location: foundBooking.Location,
          OrderId: foundBooking.OrderId,
          PaidAmount: foundBooking.PaidAmount,
          ParkingName: foundBooking.ParkingName,
          ParkingSlot: foundBooking.ParkingSlot,
          PaymentMethod: foundBooking.PaymentMethod,
          ReturnFlightNumber: foundBooking.ReturnFlightNumber,
          ReturnTerminal: foundBooking.ReturnTerminal,
          Status: foundBooking.Status,
          ToDate: foundBooking.ToDate,
          ToTime: foundBooking.ToTime,
          updatedAt: foundBooking.updatedAt,
          // Add coupon/offer fields
          HasDiscount: foundBooking.HasDiscount || false,
          CouponApplied: foundBooking.CouponApplied || false,
          OfferApplied: foundBooking.OfferApplied || false,
          CouponDetails: foundBooking.CouponDetails || '',
          OfferDetails: foundBooking.OfferDetails || '',
          OriginalPrice: foundBooking.OriginalPrice || foundBooking.PaidAmount,
          TotalSavings: foundBooking.TotalSavings || '0.00'
        };
        
        setBookingData(transformedBooking);
        setShowForm(false);
      } else {
        setError('No booking found with the provided details. Please check your order ID and email.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error retrieving booking information. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!bookingData) return;

    setPdfLoading(true); 

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Add logo
    const logoUrl = '/simpleparkingnewlogo.png';
    const logoResponse = await fetch(logoUrl);
    const logoBlob = await logoResponse.blob();
    const logoDataUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(logoBlob);
    });

    doc.addImage(logoDataUrl, 'PNG', 50, 40, 110, 110);

    // Overlay a semi-transparent white rectangle
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(255, 255, 255);
    doc.setGState(new doc.GState({ opacity: 0.8 }));
    doc.rect(50, 40, 110, 110, 'F');
    doc.setGState(new doc.GState({ opacity: 1 }));

    // Set styles
    const primaryColor = [40, 103, 248];
    const secondaryColor = [100, 100, 100];
    const darkColor = [30, 30, 30];

    // Header section
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setFontSize(22);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.rect(2, 2, 206, 26, 'F');
    doc.text('PARKING INVOICE', 105, 20, { align: 'center' });

    // Invoice details
    doc.setFontSize(10);
    doc.setTextColor(...secondaryColor);
    doc.text(`Invoice #: ${bookingData.OrderId || 'N/A'}`, 15, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 45);
    
    doc.setFontSize(10);
    doc.setTextColor(...darkColor);
    doc.text('BILL TO:', 150, 40);
    doc.text(bookingData.ParkingName || 'N/A', 150, 45);
    doc.text(bookingData.CustomerEmail || 'N/A', 150, 50);
    doc.text(bookingData.CustomerPhone || 'N/A', 150, 55);

    // Line separator
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(15, 60, 195, 60);

    // Booking details header
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text('Booking Details', 15, 70);

    // Booking information table
    const bookingDetails = [
      { label: 'Parking Location', value: bookingData.Location || 'N/A' },
      { label: 'Airport', value: bookingData.Airport || 'N/A' },
      { label: 'Parking Type', value: bookingData.ParkingSlot || 'N/A' },
      { label: 'Vehicle Number', value: bookingData.CarNumber || 'N/A' },
      { label: 'Drop-off Date', value: `${formatDate(bookingData.FromDate)} at ${formatTime(bookingData.FromTime)}` },
      { label: 'Pick-up Date', value: `${formatDate(bookingData.ToDate)} at ${formatTime(bookingData.ToTime)}` },
      { label: 'Departure Terminal', value: bookingData.DepartureTerminal || 'N/A' },
      { label: 'Departure Flight', value: bookingData.DepartureFlightNumber || 'N/A' },
      { label: 'Return Terminal', value: bookingData.ReturnTerminal || 'N/A' },
      { label: 'Return Flight', value: bookingData.ReturnFlightNumber || 'N/A' }
    ];

    let yPos = 80;
    bookingDetails.forEach((item, index) => {
      doc.setFontSize(10);
      doc.setTextColor(...secondaryColor);
      doc.text(`${item.label}:`, 20, yPos);
      doc.setTextColor(...darkColor);
      doc.text(item.value, 60, yPos);
      yPos += 7;
    });

    // Discount information if applicable
    if (bookingData.HasDiscount) {
      doc.setFontSize(12);
      doc.setTextColor(...primaryColor);
      doc.text('Discount Information', 15, yPos + 10);
      yPos += 15;

      if (bookingData.CouponApplied) {
        doc.setFontSize(10);
        doc.setTextColor(...secondaryColor);
        doc.text('Coupon Applied:', 20, yPos);
        doc.setTextColor(...darkColor);
        doc.text(bookingData.CouponDetails || 'N/A', 60, yPos);
        yPos += 7;
      }

      if (bookingData.OfferApplied) {
        doc.setFontSize(10);
        doc.setTextColor(...secondaryColor);
        doc.text('Offer Applied:', 20, yPos);
        doc.setTextColor(...darkColor);
        doc.text(bookingData.OfferDetails || 'N/A', 60, yPos);
        yPos += 7;
      }

      doc.setFontSize(10);
      doc.setTextColor(...secondaryColor);
      doc.text('Original Price:', 20, yPos);
      doc.setTextColor(...darkColor);
      doc.text(`£${parseFloat(bookingData.OriginalPrice || bookingData.PaidAmount || 0).toFixed(2)}`, 60, yPos);
      yPos += 7;

      doc.setFontSize(10);
      doc.setTextColor(...secondaryColor);
      doc.text('Total Savings:', 20, yPos);
      doc.setTextColor(0, 150, 0);
      doc.text(`£${parseFloat(bookingData.TotalSavings || 0).toFixed(2)}`, 60, yPos);
      yPos += 10;
    }

    // Payment details header
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text('Payment Information', 15, yPos + 10);

    // Payment information table
    const paymentDetails = [
      { label: 'Payment Method', value: bookingData.PaymentMethod || 'Credit Card' },
      { label: 'Amount Paid', value: `£${parseFloat(bookingData.PaidAmount || 0).toFixed(2)}` },
      { label: 'Booking Status', value: bookingData.Status || 'Confirmed' },
      { label: 'Booking Date', value: `${formatDate(bookingData.bookingDate)} at ${formatTime(bookingData.bookingTime)}` }
    ];

    yPos += 20;
    paymentDetails.forEach((item, index) => {
      doc.setFontSize(10);
      doc.setTextColor(...secondaryColor);
      doc.text(`${item.label}:`, 20, yPos);
      doc.setTextColor(...darkColor);
      if (item.label === 'Amount Paid') {
        doc.setTextColor(0, 150, 0);
        doc.setFont('helvetica', 'bold');
      }
      doc.text(item.value, 60, yPos);
      doc.setTextColor(...darkColor);
      doc.setFont('helvetica', 'normal');
      yPos += 7;
    });

    // Total amount section
    doc.setFontSize(12);
    doc.setTextColor(...darkColor);
    doc.setFont('helvetica', 'bold');
    
    if (bookingData.HasDiscount) {
      doc.text('Original Price:', 140, yPos + 5);
      doc.text(`£${parseFloat(bookingData.OriginalPrice || bookingData.PaidAmount || 0).toFixed(2)}`, 170, yPos + 5);
      
      doc.text('Discounts Applied:', 140, yPos + 12);
      doc.setTextColor(220, 0, 0);
      doc.text(`-£${parseFloat(bookingData.TotalSavings || 0).toFixed(2)}`, 170, yPos + 12);
      
      doc.setDrawColor(200, 200, 200);
      doc.line(140, yPos + 15, 190, yPos + 15);
      
      doc.setTextColor(0, 150, 0);
      doc.text('Final Amount:', 140, yPos + 22);
      doc.text(`£${parseFloat(bookingData.PaidAmount || 0).toFixed(2)}`, 170, yPos + 22);
    } else {
      doc.text('Total Amount:', 140, yPos + 10);
      doc.setTextColor(0, 150, 0);
      doc.text(`£${parseFloat(bookingData.PaidAmount || 0).toFixed(2)}`, 170, yPos + 10);
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(...secondaryColor);
    doc.text('Thank you for choosing our parking services!', 105, 280, { align: 'center' });
    doc.text('For any inquiries, please contact support@simpleparking.com', 105, 285, { align: 'center' });

    // Save the PDF
    doc.save(`Parking-Invoice-${bookingData.OrderId || new Date().getTime()}.pdf`);
    setPdfLoading(false);
  };

  const resetSearch = () => {
    setShowForm(true);
    setOrderId('');
    setEmail('');
    setBookingData(null);
  };

  const scrollToSearch = () => {
    const searchSection = document.getElementById('Searchfrom');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderDiscountInfo = () => {
    if (!bookingData.HasDiscount) return null;

    return (
      <div className="bg-gray-900/50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-4 text-indigo-400">Discount Information</h3>
        <div className="space-y-3">
          {bookingData.CouponApplied && (
            <div>
              <p className="text-gray-400 text-sm">Coupon Applied</p>
              <p className="font-medium text-green-400">{bookingData.CouponDetails || 'N/A'}</p>
            </div>
          )}
          {bookingData.OfferApplied && (
            <div>
              <p className="text-gray-400 text-sm">Offer Applied</p>
              <p className="font-medium text-green-400">{bookingData.OfferDetails || 'N/A'}</p>
            </div>
          )}
          <div>
            <p className="text-gray-400 text-sm">Original Price</p>
            <p className="font-medium">£{parseFloat(bookingData.OriginalPrice || bookingData.PaidAmount || 0).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Savings</p>
            <p className="font-medium text-xl text-green-400">
              £{parseFloat(bookingData.TotalSavings || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className='w-full'>
        <Navbarcmp onFindParkingClick={scrollToSearch} />
      </div>
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 mt-10">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Manage Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Parking Booking</span>
          </motion.h1>
          <motion.p 
            className="text-gray-400 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Retrieve your booking details by entering your order ID and email address
          </motion.p>
        </div>

        {/* Search Form */}
        {showForm && (
          <motion.div 
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            id="Searchfrom"
          >
            <form onSubmit={handleSearch}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="orderId" className="block text-sm font-medium text-gray-300 mb-2">
                    Booking reference (check your email for booking ref)
                  </label>
                  <input
                    id="orderId"
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter your booking reference"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg font-medium text-white flex items-center justify-center transition-all duration-300"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Searching...
                      </div>
                    ) : (
                      "Find My Booking"
                    )}
                  </button>
                </div>
                
                {error && (
                  <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-center">
                    <p className="text-red-300">{error}</p>
                  </div>
                )}
              </div>
            </form>
          </motion.div>
        )}

        {/* Booking Details */}
        {bookingData && (
          <motion.div 
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Booking Found!</h2>
              <p className="text-gray-400">Here are the details of your parking reservation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-900/50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4 text-indigo-400">Booking Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">Order ID</p>
                    <p className="font-medium">{bookingData.OrderId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Parking Location</p>
                    <p className="font-medium">{bookingData.Location || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Airport</p>
                    <p className="font-medium">{bookingData.Airport || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Parking Type</p>
                    <p className="font-medium">{bookingData.ParkingSlot || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Departure Terminal</p>
                    <p className="font-medium">{bookingData.DepartureTerminal || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Departure Flight</p>
                    <p className="font-medium">{bookingData.DepartureFlightNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4 text-indigo-400">Date & Time</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">Drop-off</p>
                    <p className="font-medium">{formatDate(bookingData.FromDate) || 'N/A'} at {formatTime(bookingData.FromTime) || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Pick-up</p>
                    <p className="font-medium">{formatDate(bookingData.ToDate) || 'N/A'} at {formatTime(bookingData.ToTime) || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Booking Date</p>
                    <p className="font-medium">{formatDate(bookingData.bookingDate) || 'N/A'} at {formatTime(bookingData.bookingTime) || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Return Terminal</p>
                    <p className="font-medium">{bookingData.ReturnTerminal || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Return Flight</p>
                    <p className="font-medium">{bookingData.ReturnFlightNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4 text-indigo-400">Customer Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">Name</p>
                    <p className="font-medium">{bookingData.ParkingName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="font-medium">{bookingData.CustomerEmail || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="font-medium">{bookingData.CustomerPhone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Vehicle</p>
                    <p className="font-medium">{bookingData.CarNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4 text-indigo-400">Payment Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">Payment Method</p>
                    <p className="font-medium">{bookingData.PaymentMethod || 'Credit Card'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Amount Paid</p>
                    <p className="font-medium text-xl text-green-400">
                      £{parseFloat(bookingData.PaidAmount || 0).toFixed(2)}
                    </p>
                  </div>
                  {bookingData.HasDiscount && (
                    <>
                      <div>
                        <p className="text-gray-400 text-sm">Original Price</p>
                        <p className="font-medium">£{parseFloat(bookingData.OriginalPrice || bookingData.PaidAmount || 0).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Total Savings</p>
                        <p className="font-medium text-green-400">
                          £{parseFloat(bookingData.TotalSavings || 0).toFixed(2)}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Discount Information Section */}
              {bookingData.HasDiscount && (
                <div className="bg-gray-900/50 p-6 rounded-xl col-span-1 md:col-span-2">
                  <h3 className="text-lg font-semibold mb-4 text-indigo-400">Discount Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookingData.CouponApplied && (
                      <div className="bg-green-900/20 p-4 rounded-lg border border-green-800/50">
                        <p className="text-gray-400 text-sm">Coupon Applied</p>
                        <p className="font-medium text-green-400">{bookingData.CouponDetails || 'N/A'}</p>
                      </div>
                    )}
                    {bookingData.OfferApplied && (
                      <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-800/50">
                        <p className="text-gray-400 text-sm">Offer Applied</p>
                        <p className="font-medium text-blue-400">{bookingData.OfferDetails || 'N/A'}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <button
                onClick={generatePDF}
                disabled={pdfLoading}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition-all"
              >
                {pdfLoading ? (
                  <>
                    <Spinner size="sm" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Invoice
                  </>
                )}
              </button>
              <button
                onClick={resetSearch}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Search Another Booking
              </button>
            </div>
          </motion.div>
        )}

        {/* Features Section */}
        {showForm && (
          <motion.div 
            className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Booking</h3>
              <p className="text-gray-400">Your parking reservation is protected with bank-level security measures.</p>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="text-gray-400">Our customer service team is available anytime to assist you.</p>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Modifications</h3>
              <p className="text-gray-400">Need to change your booking? We make it simple and hassle-free.</p>
            </div>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ManageBooking;