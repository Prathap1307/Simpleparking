import { createItem, getAllItems, updateItem, deleteItem } from "@/lib/Database/Utils-db";

const TABLE_NAME = process.env.TodaysBooking_table;

// GET - Fetch all customer bookings
export async function GET() {
  try {
    const bookings = await getAllItems(TABLE_NAME);
    return new Response(JSON.stringify(bookings), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Error fetching customer bookings:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch customer bookings' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST - Create new customer booking
export async function POST(request) {
  try {
    const bookingData = await request.json();

    if (!bookingData.ParkingName || !bookingData.Location) {
      return new Response(JSON.stringify({ error: 'ParkingName and Location are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    bookingData.id = String(bookingData.id || Date.now());  // Ensure unique ID if not passed
    bookingData.createdAt = new Date().toISOString();
    bookingData.updatedAt = new Date().toISOString();

    const newBooking = await createItem(TABLE_NAME, bookingData);

    return new Response(JSON.stringify(newBooking), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error creating customer booking:', err);
    return new Response(JSON.stringify({ error: 'Failed to create customer booking' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// PUT - Update customer booking
export async function PUT(request) {
  try {
    const { id, ...updateData } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: 'Booking ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stringId = String(id);
    updateData.updatedAt = new Date().toISOString();

    const updatedBooking = await updateItem(TABLE_NAME, stringId, updateData);
    return new Response(JSON.stringify(updatedBooking), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Error updating customer booking:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// DELETE - Delete customer booking by ID only
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: 'Booking ID is required for deletion' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await deleteItem(TABLE_NAME, id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Error deleting customer booking:', err);
    return new Response(JSON.stringify({ error: 'Failed to delete customer booking' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
