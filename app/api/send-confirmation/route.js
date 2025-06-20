// app/api/send-confirmation/route.js
import nodemailer from 'nodemailer';

export async function POST(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const { bookingData, customerDetails, searchData, paymentMethod } = await req.json();

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com", // Microsoft's SMTP server
      port: 587,
      secure: false, // Use STARTTLS (not SSL)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        ciphers: "SSLv3", // Helps with Microsoft's strict security
      },
    });

    // Generate HTML email using template strings
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your Parking Booking Confirmation</title>
        <style>
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
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img 
              src="https://yourdomain.com/logo.png" 
              alt="Parking Company Logo" 
              class="logo"
            />
            <h1>Booking Confirmation</h1>
          </div>

          <div class="content">
            <div class="section">
              <p>Dear ${customerDetails.firstName} ${customerDetails.lastName},</p>
              <p>Thank you for booking with us! Here are your booking details:</p>
            </div>

            <div class="section">
              <h2 class="title">Booking Summary</h2>
              <p><strong>Airport:</strong> ${searchData.airport || 'N/A'}</p>
              <p><strong>Parking Location:</strong> ${bookingData.title}</p>
              <p><strong>From:</strong> ${new Date(searchData.dropOffDate).toLocaleString('en-GB')}</p>
              <p><strong>To:</strong> ${new Date(searchData.pickupDate).toLocaleString('en-GB')}</p>
            </div>

            <div class="section">
              <h2 class="title">Customer Details</h2>
              <p><strong>Name:</strong> ${customerDetails.firstName} ${customerDetails.lastName}</p>
              <p><strong>Email:</strong> ${customerDetails.email}</p>
              <p><strong>Phone:</strong> ${customerDetails.phoneCountry} ${customerDetails.phone}</p>
              <p><strong>Vehicle:</strong> ${customerDetails.licensePlate}</p>
            </div>

            <div class="section">
              <h2 class="title">Payment Information</h2>
              <p><strong>Payment Method:</strong> ${paymentMethod}</p>
              <p><strong>Amount Paid:</strong> £${bookingData.totalPrice.toFixed(2)}</p>
              <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>

            <a href="https://yourdomain.com/invoice/${bookingData.id}" class="button">
              Download Invoice
            </a>
          </div>

          <div class="footer">
            <p>© ${new Date().getFullYear()} Your Parking Company. All rights reserved.</p>
            <p>
              <a href="https://yourdomain.com/contact">Contact Us</a> | 
              <a href="https://yourdomain.com/terms"> Terms & Conditions</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Email options
    const mailOptions = {
      from: `"Parking Company" <${process.env.EMAIL_USERNAME}>`,
      to: customerDetails.email,
      subject: `Your Parking Booking Confirmation #${bookingData.id}`,
      html: emailHtml,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ message: 'Email sent successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ message: 'Failed to send email' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}