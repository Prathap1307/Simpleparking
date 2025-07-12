// app/api/coupons-and-offers/route.js
import { createItem, getAllItems, updateItem, deleteItem } from "@/lib/Database/Utils-db";

const TABLE_NAME = process.env.CouponsAndOffers_table;

// GET - Fetch all coupons and offers
export async function GET() {
  try {
    const items = await getAllItems(TABLE_NAME);
    return new Response(JSON.stringify(items), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    console.error('Error fetching coupons and offers:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch coupons and offers' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// POST - Create new coupon or offer
export async function POST(request) {
  try {
    const itemData = await request.json();

    // Basic validation
    if (!itemData.type || !itemData.value || !itemData.fromDate || !itemData.toDate) {
      return new Response(JSON.stringify({ 
        error: 'Type, value, fromDate, and toDate are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Additional validation for coupons
    if (itemData.type === 'coupon' && !itemData.couponCode) {
      return new Response(JSON.stringify({ 
        error: 'Coupon code is required for coupon type' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Ensure id is a string
    itemData.id = String(itemData.id);
    itemData.createdAt = new Date().toISOString();
    itemData.updatedAt = new Date().toISOString();
    
    // Calculate initial status based on dates
    itemData.status = new Date(itemData.fromDate) > new Date() ? 'upcoming' : 
                     new Date(itemData.toDate) < new Date() ? 'expired' : 'active';

    const newItem = await createItem(TABLE_NAME, itemData);

    return new Response(JSON.stringify(newItem), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error creating coupon/offer:', err);
    return new Response(JSON.stringify({ error: 'Failed to create coupon/offer' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// PUT - Update coupon or offer
export async function PUT(request) {
  try {
    const { id, ...updateData } = await request.json();
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Add type conversion for ID
    const stringId = String(id);
    
    // Add updated timestamp
    updateData.updatedAt = new Date().toISOString();

    // Recalculate status if dates are being updated
    if (updateData.fromDate || updateData.toDate) {
      const fromDate = updateData.fromDate || (await getItemById(TABLE_NAME, id)).fromDate;
      const toDate = updateData.toDate || (await getItemById(TABLE_NAME, id)).toDate;
      
      updateData.status = new Date(fromDate) > new Date() ? 'upcoming' : 
                         new Date(toDate) < new Date() ? 'expired' : 'active';
    }

    const updatedItem = await updateItem(TABLE_NAME, stringId, updateData);
    return new Response(JSON.stringify(updatedItem), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Error updating coupon/offer:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// DELETE - Remove coupon or offer
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required for deletion' }), {
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
    console.error('Error deleting coupon/offer:', err);
    return new Response(JSON.stringify({ error: 'Failed to delete coupon/offer' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}