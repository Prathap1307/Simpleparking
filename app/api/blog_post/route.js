// app/api/blog_post/route.js
import { createItem, getAllItems, updateItem, deleteItem, getItemById } from "@/lib/Database/Utils-db";

const TABLE_NAME = process.env.BlogPost_table;

// GET - Fetch all blog posts
export async function GET() {
  try {
    const blogPosts = await getAllItems(TABLE_NAME);
    return new Response(JSON.stringify(blogPosts), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Error fetching blog posts:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch blog posts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(request) {
  try {
    const blogData = await request.json();

    // Basic required field validation
    if (!blogData.Blog_title || !blogData.post_content_part_1) {
      return new Response(
        JSON.stringify({ 
          error: 'Blog title and first content part are required' 
        }), 
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate ID and add timestamps
    blogData.id = String(Date.now()); // Generate unique ID
    blogData.createdAt = new Date().toISOString();
    blogData.updatedAt = new Date().toISOString();

    // Save to database
    const createdPost = await createItem(TABLE_NAME, blogData);

    return new Response(JSON.stringify(createdPost), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error creating blog post:', err);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create blog post',
        details: err.message 
      }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// PUT - Update blog post
export async function PUT(request) {
  try {
    const { id, ...updateData } = await request.json();
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'Blog post ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Add updated timestamp
    updateData.updatedAt = new Date().toISOString();

    const updatedPost = await updateItem(TABLE_NAME, String(id), updateData);
    return new Response(JSON.stringify(updatedPost), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Error updating blog post:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// DELETE - Remove blog post
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: 'Blog post ID is required for deletion' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await deleteItem(TABLE_NAME, String(id));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Error deleting blog post:', err);
    return new Response(JSON.stringify({ error: 'Failed to delete blog post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}