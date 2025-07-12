import { createItem, getAllItems, updateItem, deleteItem, getItemById } from "@/lib/Database/Utils-db";

const TABLE_NAME = process.env.SEOSettings_table;

// GET - Fetch all SEO settings or by pageType
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageType = searchParams.get('pageType');
    const pageSlug = searchParams.get('pageSlug');
    
    let items;
    if (pageType && pageSlug) {
      // Get specific page settings
      items = await getItemById(TABLE_NAME, `${pageType}-${pageSlug}`);
    } else if (pageType) {
      // Get all settings for a page type
      items = await getAllItems(TABLE_NAME);
      items = items.filter(item => item.pageType === pageType);
    } else {
      // Get all settings
      items = await getAllItems(TABLE_NAME);
    }
    
    return new Response(JSON.stringify(items), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Error fetching SEO settings:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch SEO settings' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST - Create new SEO settings
export async function POST(request) {
  try {
    const itemData = await request.json();

    // Basic validation
    if (!itemData.pageType || !itemData.title || !itemData.description) {
      return new Response(JSON.stringify({ 
        error: 'pageType, title, and description are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate ID
    itemData.id = itemData.pageSlug 
      ? `${itemData.pageType}-${itemData.pageSlug}`
      : itemData.pageType;
      
    itemData.createdAt = new Date().toISOString();
    itemData.updatedAt = new Date().toISOString();
    
    const newItem = await createItem(TABLE_NAME, itemData);

    return new Response(JSON.stringify(newItem), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error creating SEO settings:', err);
    return new Response(JSON.stringify({ error: 'Failed to create SEO settings' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// PUT - Update SEO settings
export async function PUT(request) {
  try {
    const { id, ...updateData } = await request.json();
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    updateData.updatedAt = new Date().toISOString();

    const updatedItem = await updateItem(TABLE_NAME, id, updateData);
    return new Response(JSON.stringify(updatedItem), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Error updating SEO settings:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// DELETE - Remove SEO settings
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
    console.error('Error deleting SEO settings:', err);
    return new Response(JSON.stringify({ error: 'Failed to delete SEO settings' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}