"use client";

import { useRef } from 'react';
import jsPDF from 'jspdf';

const ParkingBill = () => {
  const billRef = useRef(null);

  const handlePrint = () => {
    const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation
    
    // Page dimensions (A4 landscape)
    const pageWidth = 297;
    const pageHeight = 210;
    const sectionWidth = pageWidth / 3;

    // First section
    doc.setFontSize(16);
    doc.text('Heathrow', 15, 20);
    doc.text('simpleparking.uk', sectionWidth - 15, 20, { align: 'right' });
    doc.setDrawColor(0, 0, 0, 0.7);
    doc.line(15, 25, sectionWidth - 15, 25);
    
    // Customer section
    doc.setFontSize(12);
    doc.text('CUSTOMER', 15, 35);
    doc.rect(15, 40, sectionWidth - 30, 20);
    doc.text('Name: John Doe', 20, 50);
    doc.text('Mobile: 07123456789', 20, 60);
    doc.text('Booking ref: SP123456', 20, 70);
    
    // Vehicle section
    doc.text('VEHICLE', 15, 85);
    doc.rect(15, 90, sectionWidth - 30, 20);
    doc.text('Car Reg: ABC123', 20, 100);
    doc.text('Car model: Toyota Prius', 20, 110);
    doc.text('Colour: Silver', 20, 120);
    
    // Flight details
    doc.text('FLIGHT DETAILS', 15, 135);
    doc.text('Departure: 15/08/2023 14:30 T2', 20, 145);
    doc.text('Return: 30/08/2023 10:15 T2', 20, 155);

    // Second section
    const secondSectionX = sectionWidth + 15;
    
    doc.setFontSize(14);
    doc.text('DATE OF ARRIVAL', secondSectionX, 35);
    doc.rect(secondSectionX, 40, sectionWidth - 30, 20);
    doc.text('15/08/2023', secondSectionX + 10, 55);
    
    doc.text('TIME OF ARRIVAL', secondSectionX, 75);
    doc.rect(secondSectionX, 80, sectionWidth - 30, 20);
    doc.text('12:45', secondSectionX + 10, 95);
    
    doc.text('TERMINAL', secondSectionX, 115);
    doc.rect(secondSectionX, 120, sectionWidth - 30, 20);
    doc.text('2', secondSectionX + 10, 135);

    // Third section
    const thirdSectionX = sectionWidth * 2 + 15;
    
    doc.setFontSize(16);
    doc.text('Heathrow', thirdSectionX, 20);
    doc.text('simpleparking.uk', thirdSectionX + sectionWidth - 30, 20, { align: 'right' });
    
    doc.setFontSize(10);
    doc.text('Once you have collected all your luggage please call', thirdSectionX, 35);
    doc.text('+44 1234 567890', thirdSectionX, 45);
    
    doc.text('Customer relations: support@simpleparking.uk', thirdSectionX, 60);
    doc.text('Amendments/cancellations: 9AM-5PM Mon-Fri', thirdSectionX, 70);
    
    doc.setFontSize(12);
    doc.text('BOOKING DETAILS', thirdSectionX, 90);
    doc.text('Bookref: SP123456', thirdSectionX, 100);
    doc.text('Car reg: ABC123', thirdSectionX, 110);
    doc.text('Model: Toyota Prius', thirdSectionX, 120);
    doc.text('Colour: Silver', thirdSectionX, 130);
    doc.text('Departure: 15/08/2023 14:30 T2', thirdSectionX, 140);
    doc.text('Return: 30/08/2023 10:15 T2', thirdSectionX, 150);

    // Second page
    doc.addPage('l'); // Landscape
    
    // First section of second page
    doc.setFontSize(14);
    doc.text('TERMS AND CONDITIONS', 15, 30);
    doc.setFontSize(10);
    doc.text('1. Parking is at owner\'s risk. No liability for damage/theft.', 15, 40);
    doc.text('2. Vehicles must have valid tax and MOT.', 15, 50);
    doc.text('3. No refunds for early returns.', 15, 60);
    doc.text('4. Maximum stay: 30 days.', 15, 70);
    doc.text('5. Full payment required in advance.', 15, 80);

    // Third section of second page
    doc.setFontSize(12);
    doc.text('Thank you for choosing Simple Parking.', thirdSectionX, 40);
    doc.text('Visit simpleparking.uk for future bookings', thirdSectionX, 50);
    doc.text('Customer service: +44 1234 567890', thirdSectionX, 60);

    doc.save('parking_bill.pdf');
  };

  return (
    <div className="container mx-auto p-4">
      <div ref={billRef} className="bg-white shadow-lg" style={{ 
        width: '297mm', 
        height: '210mm',
        display: 'flex'
      }}>
        {/* First section */}
        <div className="p-4" style={{ width: '33.33%', borderRight: '1px dashed #ccc' }}>
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-bold">Heathrow</h1>
            <h1 className="text-xl font-bold">simpleparking.uk</h1>
          </div>
          <hr className="border-t border-gray-300 opacity-70 my-2" />
          
          <h2 className="text-md font-bold uppercase mb-2">Customer</h2>
          <div className="border p-2 mb-4">
            <p>Name: John Doe</p>
            <p>Mobile: 07123456789</p>
            <p>Booking ref: SP123456</p>
          </div>
          
          <h2 className="text-md font-bold uppercase mb-2">Vehicle</h2>
          <div className="border p-2 mb-4">
            <p>Car Reg: ABC123</p>
            <p>Car model: Toyota Prius</p>
            <p>Colour: Silver</p>
          </div>
          
          <h2 className="text-md font-bold uppercase mb-2">Flight Details</h2>
          <div className="mb-4">
            <p>Departure: 15/08/2023 14:30 T2</p>
            <p>Return: 30/08/2023 10:15 T2</p>
          </div>
        </div>
        
        {/* Second section */}
        <div className="p-4" style={{ width: '33.33%', borderRight: '1px dashed #ccc' }}>
          <h2 className="text-lg font-bold uppercase mb-2">Date of Arrival</h2>
          <div className="border p-4 mb-6 flex items-center justify-center" style={{ height: '60px' }}>
            <p>15/08/2023</p>
          </div>
          
          <h2 className="text-lg font-bold uppercase mb-2">Time of Arrival</h2>
          <div className="border p-4 mb-6 flex items-center justify-center" style={{ height: '60px' }}>
            <p>12:45</p>
          </div>
          
          <h2 className="text-lg font-bold uppercase mb-2">Terminal</h2>
          <div className="border p-4 flex items-center justify-center" style={{ height: '60px' }}>
            <p>2</p>
          </div>
        </div>
        
        {/* Third section */}
        <div className="p-4" style={{ width: '33.33%' }}>
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-bold">Heathrow</h1>
            <h1 className="text-xl font-bold">simpleparking.uk</h1>
          </div>
          
          <div className="mb-4">
            <p className="text-sm">Once you have collected all your luggage please call</p>
            <p className="font-bold">+44 1234 567890</p>
          </div>
          
          <div className="mb-6">
            <p className="text-xs">Customer relations: support@simpleparking.uk</p>
            <p className="text-xs">Amendments/cancellations: 9AM-5PM Mon-Fri</p>
          </div>
          
          <h2 className="text-md font-bold uppercase mb-2">Booking Details</h2>
          <div className="text-sm">
            <p>Bookref: SP123456</p>
            <p>Car reg: ABC123</p>
            <p>Model: Toyota Prius</p>
            <p>Colour: Silver</p>
            <p>Departure: 15/08/2023 14:30 T2</p>
            <p>Return: 30/08/2023 10:15 T2</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <button 
          onClick={handlePrint}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default ParkingBill;