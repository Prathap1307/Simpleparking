// app/api/airports/route.js
import { getAirports } from "@/lib/Database/airports-db";

export async function GET() {
  try {
    const airports = await getAirports();
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