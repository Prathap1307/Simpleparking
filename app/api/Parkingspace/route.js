// app/api/parkingspace/route.js
import { createItem , getAllItems , updateItem , deleteItem , getItemById } from "@/lib/Database/Utils-db";

const TABLE_NAME = process.env.Parkingspace_table

// GET - Fetch all parking spaces
export async function GET() {
  try {
    const parkingSpaces = await getAllItems(TABLE_NAME);
    return new Response(JSON.stringify(parkingSpaces), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    console.error('Error fetching parking spaces:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch parking spaces' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

export async function POST(request) {
  try {
    const parkingData = await request.json();

    if (!parkingData.ParkingName || !parkingData.Location) {
      return new Response(JSON.stringify({ error: 'ParkingName and Location are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Ensure id is a string (no object)
    parkingData.id = String(parkingData.id);
    parkingData.createdAt = new Date().toISOString();
    parkingData.updatedAt = new Date().toISOString();

    const newParkingSpace = await createItem(TABLE_NAME, parkingData);

    return new Response(JSON.stringify(newParkingSpace), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error creating parking space:', err);
    return new Response(JSON.stringify({ error: 'Failed to create parking space' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
// PUT - Update parking space
// app/api/Parkingspace/route.js
export async function PUT(request) {
  try {
    const { id, ...updateData } = await request.json();
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'Parking space ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Add type conversion for ID
    const stringId = String(id);
    
    // Add updated timestamp
    updateData.updatedAt = new Date().toISOString();

    const updatedParkingSpace = await updateItem(TABLE_NAME, stringId, updateData);
    return new Response(JSON.stringify(updatedParkingSpace), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Error updating parking space:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// DELETE - Remove parking space
export async function DELETE(request) {
  try {
    const { id, Space } = await request.json();

    if (!id || !Space) {
      return new Response(JSON.stringify({ error: 'Both id and Space are required for deletion' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await deleteItem(TABLE_NAME, id, Space);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Error deleting parking space:', err);
    return new Response(JSON.stringify({ error: 'Failed to delete parking space' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
