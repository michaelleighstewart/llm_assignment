import { drizzle as drizzleSQLite, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzlePostgres, VercelPgDatabase } from 'drizzle-orm/vercel-postgres';
import Database from 'better-sqlite3';
import { sql as vercelSql } from '@vercel/postgres';
import * as schema from './schema';

const isDevelopment = process.env.NODE_ENV !== 'production';
const usePostgres = process.env.POSTGRES_URL && !isDevelopment;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: BetterSQLite3Database<any> | VercelPgDatabase<any>;

if (usePostgres) {
  // Use Vercel Postgres for production
  db = drizzlePostgres(vercelSql, { 
    schema: {
      prompts: schema.promptsPostgres,
      records: schema.recordsPostgres,
    }
  }) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
} else {
  // Use SQLite for local development and Docker
  const databasePath = process.env.DATABASE_URL?.replace('file:', '') || './local.db';
  const sqlite = new Database(databasePath);
  db = drizzleSQLite(sqlite, {
    schema: {
      prompts: schema.promptsSQLite,
      records: schema.recordsSQLite,
    }
  }) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export { db };
export const isPostgres = usePostgres;

// Helper to get the correct tables based on the database type
export const getTables = () => {
  if (usePostgres) {
    return {
      prompts: schema.promptsPostgres,
      records: schema.recordsPostgres,
    };
  }
  return {
    prompts: schema.promptsSQLite,
    records: schema.recordsSQLite,
  };
};

