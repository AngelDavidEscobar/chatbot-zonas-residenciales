import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

config({ path: '.env' }); 


if (!process.env.TURSO_CONNECTION_URL) {
  console.log(`url ${process.env.TURSO_CONNECTION_URL}`);
  throw new Error("Falta TURSO_CONNECTION_URL en .env");
}

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN, 
});

export const db = drizzle(client);