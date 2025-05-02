// lib/airports-db.js
import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { ddbClient } from '../aws-config';

export async function getAirports() {
  try {
    const params = {
      TableName: process.env.NEXT_PUBLIC_AWS_DYNAMODB_TABLE,
    };

    const data = await ddbClient.send(new ScanCommand(params));
    return data.Items ? data.Items.map(item => unmarshall(item)) : [];
  } catch (err) {
    console.error('Error fetching airports:', err);
    return [];
  }
}