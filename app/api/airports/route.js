// app/api/airports/route.js
import { getAllItems } from "@/lib/Database/Utils-db";

export async function GET() {
  const table_name = process.env.Location_table
  try {
    const airports = await getAllItems(table_name);
    return new Response(JSON.stringify(airports), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    console.error('Error fetching airports:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch airports' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}