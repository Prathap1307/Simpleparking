// lib/aws-config.js
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const REGION = 'eu-north-1'; // Your AWS region

const ddbClient = new DynamoDBClient({ 
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

export { ddbClient };



