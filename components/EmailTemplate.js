// components/EmailTemplate.jsx
import React from 'react';

function EmailTemplate({ bookingData, customerDetails, searchData, paymentMethod }) {
  const formatDateTime = (dateObj) => {
    if (!dateObj || isNaN(new Date(dateObj))) return "N/A";
    const date = new Date(dateObj);
    return date.toLocaleString('en-GB');
  };

  const mergeDateTime = (date, time) => {
    if (!date || !time) return null;
    const d = new Date(date);
    const t = new Date(time);
    d.setHours(t.getHours(), t.getMinutes(), 0, 0);
    return d;
  };

  return (

    <html>
      <head>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your Parking Booking Confirmation</title>
        <style>
          {`
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 20px 0; }
            .logo { max-width: 200px; height: auto; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 5px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
            .section { margin-bottom: 20px; }
            .title { color: #2c3e50; font-size: 18px; margin-bottom: 10px; }
            .button { 
              display: inline-block; 
              padding: 10px 20px; 
              background: #3498db; 
              color: white; 
              text-decoration: none; 
              border-radius: 5px; 
              margin-top: 15px;
            }
          `}
        </style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <img 
              src="https://yourdomain.com/logo.png" 
              alt="Parking Company Logo" 
              className="logo"
            />
            <h1>Booking Confirmation</h1>
          </div>

          <div className="content">
            <div className="section">
              <p>Dear {customerDetails.firstName} {customerDetails.lastName},</p>
              <p>Thank you for booking with us! Here are your booking details:</p>
            </div>

            <div className="section">
              <h2 className="title">Booking Summary</h2>
              <p><strong>Airport:</strong> {searchData.airport || 'N/A'}</p>
              <p><strong>Parking Location:</strong> {bookingData.title}</p>
              <p><strong>From:</strong> {formatDateTime(mergeDateTime(searchData.dropOffDate, searchData.dropOffTime))}</p>
              <p><strong>To:</strong> {formatDateTime(mergeDateTime(searchData.pickupDate, searchData.pickupTime))}</p>
            </div>

            <div className="section">
              <h2 className="title">Customer Details</h2>
              <p><strong>Name:</strong> {customerDetails.firstName} {customerDetails.lastName}</p>
              <p><strong>Email:</strong> {customerDetails.email}</p>
              <p><strong>Phone:</strong> {customerDetails.phoneCountry} {customerDetails.phone}</p>
              <p><strong>Vehicle:</strong> {customerDetails.licensePlate}</p>
            </div>

            <div className="section">
              <h2 className="title">Payment Information</h2>
              <p><strong>Payment Method:</strong> {paymentMethod}</p>
              <p><strong>Amount Paid:</strong> £{bookingData.totalPrice.toFixed(2)}</p>
              <p><strong>Payment Date:</strong> {new Date().toLocaleDateString()}</p>
            </div>

            <a href={`https://yourdomain.com/invoice/${bookingData.id}`} className="button">
              Download Invoice
            </a>
          </div>

          <div className="footer">
            <p>© {new Date().getFullYear()} Your Parking Company. All rights reserved.</p>
            <p>
              <a href="https://yourdomain.com/contact">Contact Us</a> | 
              <a href="https://yourdomain.com/terms"> Terms & Conditions</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
};

export default EmailTemplate;