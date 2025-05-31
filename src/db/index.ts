import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// For migrations and direct database access
const connectionString = process.env.DATABASE_URL!;

// For query purposes
const queryClient = postgres(connectionString, {
  ssl: 'require',
  connect_timeout: 30,
  idle_timeout: 30,
  max_lifetime: 60 * 30,
  max: 10, // Maximum number of connections in the pool
  prepare: true,
  connection: {
    application_name: 'whop-user-directory',
  },
  onnotice: () => {}, // Suppress notice messages
});

export const db = drizzle(queryClient, { schema });

// For migrations
export const migrationClient = postgres(connectionString, {
  max: 1,
  ssl: 'require',
  connect_timeout: 30,
  idle_timeout: 30,
  max_lifetime: 60 * 30,
}); 