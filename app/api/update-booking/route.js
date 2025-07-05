// app/api/update-booking/route.js
import { NextResponse } from 'next/server';

export async function PUT(request) {
  try {
    const { id, status, paymentIntentId } = await request.json();
    
    // Add your database update logic here
    // Example (using your DB client):
    // const updatedBooking = await db.booking.update({
    //   where: { id },
    //   data: { 
    //     status,
    //     paymentIntentId 
    //   }
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}