// app/api/blogs/route.js

import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// GET all blog posts
export async function GET(request) {
  try {
    const results = await query({
      query: "SELECT * FROM Blogpost ORDER BY created_at DESC",
      values: [],
    });
    
    return NextResponse.json({ blogs: results }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST a new blog post
export async function POST(request) {
  try {
    const data = await request.json();
    const { title, excerpt, content, category, imageUrl } = data;
    
    // Get the last blog post ID to generate the next one
    const lastBlog = await query({
      query: "SELECT id FROM Blogpost ORDER BY id DESC LIMIT 1",
      values: [],
    });
    
    let nextId = "01"; // Default starting ID
    if (lastBlog.length > 0) {
      const lastId = lastBlog[0].id;
      const lastNum = parseInt(lastId, 10);
      nextId = (lastNum + 1).toString().padStart(2, '0');
    }
    
    // Insert the new blog post
    const insertResult = await query({
      query: `
        INSERT INTO Blogpost (id, title, excerpt, content, category, image_url, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
      `,
      values: [nextId, title, excerpt, content, category, imageUrl],
    });
    
    return NextResponse.json({ 
      message: "Blog post created successfully",
      id: nextId 
    }, { status: 201 });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT (update) a blog post
export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, title, excerpt, content, category, imageUrl } = data;
    
    const updateResult = await query({
      query: `
        UPDATE Blogpost 
        SET title = ?, excerpt = ?, content = ?, category = ?, image_url = ?, updated_at = NOW()
        WHERE id = ?
      `,
      values: [title, excerpt, content, category, imageUrl, id],
    });
    
    if (updateResult.affectedRows === 0) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: "Blog post updated successfully" 
    }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a blog post
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: "ID parameter is required" }, { status: 400 });
    }
    
    const deleteResult = await query({
      query: "DELETE FROM Blogpost WHERE id = ?",
      values: [id],
    });
    
    if (deleteResult.affectedRows === 0) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: "Blog post deleted successfully" 
    }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}