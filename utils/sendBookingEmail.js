import axios from 'axios';
import { formatDate } from './formatting';
import { formatTime } from './formatting';


const sendBookingEmail = async (bookingDetails) => {
  // Validate critical parameters
  const brevoApiKey = process.env.brevoApiKey;
  const brevoTemplateId = process.env.brevoTemplateId;
  const brevoSenderEmail = process.env.brevoSenderEmail;
  
  if (!brevoApiKey) throw new Error('Brevo API key is missing');
  if (!brevoTemplateId) throw new Error('Template ID is missing');
  if (!brevoSenderEmail) throw new Error('Sender email is required');

  // Format all dates consistently
  const formattedBookingDate = formatDate(bookingDetails.bookingDate);
  const formattedFromDate = formatDate(bookingDetails.fromDate);
  const formattedToDate = formatDate(bookingDetails.toDate);
  const formattedFromTime = formatTime(bookingDetails.fromTime);
  const formattedToTime = formatTime(bookingDetails.toTime);

  const emailPayload = {
    sender: {
      email: brevoSenderEmail,
      name: 'Simple Parking'
    },
    to: [{
      email: bookingDetails.customerEmail,
      name: bookingDetails.customerName || 'Customer'
    }],
    templateId: brevoTemplateId,
    params: {
      customerName: bookingDetails.customerName,
      orderId: bookingDetails.orderId,
      bookingDate: formattedBookingDate,
      fromDate: formattedFromDate,
      fromTime: formattedFromTime,
      toDate: formattedToDate,
      toTime: formattedToTime,
      airport: bookingDetails.airport,
      carNumber: bookingDetails.carNumber,
      parkingSlot: bookingDetails.parkingSlot,
      paidAmount: bookingDetails.paidAmount,
      paymentMethod: bookingDetails.paymentMethod,
      Departure_Terminal: bookingDetails.Departure_Terminal,
      Departure_Flight: bookingDetails.Departure_Flight,
      Arrival_Terminal: bookingDetails.Arrival_Terminal,
      Arrival_Flight: bookingDetails.Arrival_Flight
    },
    headers: {
      'X-Mailin-custom': 'booking-transactional',
    },
  };

  try {
    console.log('Attempting to send email with formatted dates:', {
      bookingDate: formattedBookingDate,
      fromDate: formattedFromDate,
      fromTime: formattedFromTime,
      toDate: formattedToDate,
      toTime: formattedToTime
    });

    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      emailPayload,
      {
        headers: {
          'api-key': brevoApiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    console.log('✅ Email sent successfully');
    return response.data;
  } catch (error) {
    console.error('❌ Brevo API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw new Error(`Failed to send email: ${error.response?.data?.message || error.message}`);
  }
};

export default sendBookingEmail;