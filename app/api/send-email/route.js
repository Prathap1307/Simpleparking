// app/api/brevo/send-email/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  const body = await req.json();
  const { to, subject, templateId, content, params } = body;

  try {
    const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
      to: [{ email: to }],
      sender: {
        name: 'Simple Parking',
        email: 'support@simpleparking.uk',
      },
      ...(templateId
        ? {
            templateId: Number(templateId),
            params: params || {},
          }
        : {
            subject: subject || 'No Subject',
            htmlContent: content,
          }),
    }, {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error sending email:', error.response?.data || error.message);
    return NextResponse.json(
      { success: false, error: error?.response?.data || error.message },
      { status: 500 }
    );
  }
}
