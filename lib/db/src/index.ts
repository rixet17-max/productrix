import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.warn("WARNING: DATABASE_URL is not set. Database features will be unavailable.");
}

export const pool = dbUrl ? new Pool({ connectionString: dbUrl }) : null as any;
export const db = dbUrl ? drizzle(pool, { schema }) : null as any;

export * from "./schema";
