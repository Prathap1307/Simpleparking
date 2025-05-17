import { createItem, getAllItems, updateItem, deleteItem } from "@/lib/Database/Utils-db";

const TABLE_NAME = process.env.Location_table;

// GET - Fetch all locations
export async function GET() {
  try {
    const locations = await getAllItems(TABLE_NAME);
    return new Response(JSON.stringify(locations), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Error fetching locations:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch locations' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST - Create new location
export async function POST(request) {
  try {
    const locationData = await request.json();

    if (!locationData.Location_name || !locationData.Airport_name) {
      return new Response(JSON.stringify({ 
        error: 'Location name and Airport name are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Ensure ID is numeric
    locationData.id = parseInt(locationData.id);
    if (isNaN(locationData.id)) {
      return new Response(JSON.stringify({ error: 'Invalid numeric ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    locationData.createdAt = new Date().toISOString();
    locationData.updatedAt = new Date().toISOString();

    const newLocation = await createItem(TABLE_NAME, locationData);

    return new Response(JSON.stringify(newLocation), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Error creating location:', err);
    return new Response(JSON.stringify({ error: 'Failed to create location' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// PUT - Update location
export async function PUT(request) {
  try {
    const { id, ...updateData } = await request.json();

    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return new Response(JSON.stringify({ error: 'Invalid numeric ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    updateData.updatedAt = new Date().toISOString();

    const updatedLocation = await updateItem(TABLE_NAME, numericId, updateData);
    return new Response(JSON.stringify(updatedLocation), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Error updating location:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// DELETE - Remove location
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return new Response(JSON.stringify({ error: 'Invalid numeric ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await deleteItem(TABLE_NAME, numericId);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Error deleting location:', err);
    return new Response(JSON.stringify({ error: 'Failed to delete location' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
