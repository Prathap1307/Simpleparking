import { createItem, getAllItems, updateItem, deleteItem } from "@/lib/Database/Utils-db";

const TABLE_NAME = process.env.CustomerList_table;

// GET - Fetch all customers (keep this unchanged)
export async function GET() {
  try {
    const customers = await getAllItems(TABLE_NAME);
    return new Response(JSON.stringify(customers), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Error fetching customer list:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch customer list' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(request) {
  try {
    const customerData = await request.json();

    // Basic validation
    if (!customerData.CustomerEmail) {
      return new Response(JSON.stringify({ error: 'Customer email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Ensure required fields are arrays
    const fieldsToArray = ['CustomerPhone', 'CarNumber', 'Airport', 'OrderId'];
    fieldsToArray.forEach(field => {
      if (customerData[field] && !Array.isArray(customerData[field])) {
        customerData[field] = [customerData[field]]; // Convert to array if not already
      } else if (!customerData[field]) {
        customerData[field] = []; // Default to empty array if missing
      }
    });

    // Auto-generate ID if missing
    customerData.id = customerData.id || Date.now().toString();
    customerData.createdAt = new Date().toISOString();
    customerData.updatedAt = new Date().toISOString();

    const newCustomer = await createItem(TABLE_NAME, customerData);

    return new Response(JSON.stringify(newCustomer), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error creating customer:', err);
    return new Response(JSON.stringify({ error: 'Failed to create customer' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// PUT - Update customer
export async function PUT(request) {
  try {
    const { id, ...updateData } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: 'Customer ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stringId = String(id);
    updateData.updatedAt = new Date().toISOString();

    const updatedCustomer = await updateItem(TABLE_NAME, stringId, updateData);
    return new Response(JSON.stringify(updatedCustomer), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Error updating customer:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// DELETE - Delete customer by ID
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: 'Customer ID is required for deletion' }), {
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
    console.error('Error deleting customer:', err);
    return new Response(JSON.stringify({ error: 'Failed to delete customer' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}