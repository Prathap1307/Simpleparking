// app/api/Customerlist/bulk/route.js
import { createItem } from "@/lib/Database/Utils-db";

const TABLE_NAME = process.env.Bulkdatatable;

export async function POST(request) {
  try {
    const customers = await request.json();

    // Validate the incoming data
    if (!Array.isArray(customers)) {
      return new Response(JSON.stringify({ message: 'Expected an array of customers' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Process each customer and create them
    const createdCustomers = await Promise.all(
      customers.map(async (excelRow) => {
        // Map Excel columns to database fields
        const customerData = {
          customername: excelRow['CustomerName']?.toString() || '', // Column C
          CustomerEmail: excelRow['Email']?.toString() || '', // Add if you have email column
          CustomerPhone: excelRow['PhoneNumber']?.toString() || '', // Column D
          CarNumber: excelRow['RegistrationNumber']?.toString() || '', // Column K
          carmodel: excelRow['carmodel']?.toString() || '', // Add if you have airport column
          id: Date.now().toString(), // Generate unique ID
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        return await createItem(TABLE_NAME, customerData);
      })
    );

    return new Response(JSON.stringify({ 
      message: 'Customers created successfully',
      count: createdCustomers.length,
      sample: createdCustomers[0] // Return first created item for debugging
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating bulk customers:', error);
    return new Response(JSON.stringify({ 
      message: 'Internal server error',
      error: error.message,
      inputData: request.body // Include input data for debugging
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}