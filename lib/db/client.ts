import { drizzle as drizzleSQLite, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzlePostgres, VercelPgDatabase } from 'drizzle-orm/vercel-postgres';
import Database from 'better-sqlite3';
import { sql as vercelSql } from '@vercel/postgres';
import { eq } from 'drizzle-orm';
import * as schema from './schema';

const isDevelopment = process.env.NODE_ENV !== 'production';
const usePostgres = process.env.POSTGRES_URL && !isDevelopment;

// Initialize database and tables based on environment
type SQLiteDb = BetterSQLite3Database<typeof schema>;
type PostgresDb = VercelPgDatabase<typeof schema>;

let _db: SQLiteDb | PostgresDb;
let _tables: {
  prompts: typeof schema.promptsSQLite | typeof schema.promptsPostgres;
  records: typeof schema.recordsSQLite | typeof schema.recordsPostgres;
};

if (usePostgres) {
  _db = drizzlePostgres(vercelSql, { schema });
  _tables = { prompts: schema.promptsPostgres, records: schema.recordsPostgres };
} else {
  const databasePath = process.env.DATABASE_URL?.replace('file:', '') || './local.db';
  const sqlite = new Database(databasePath);
  _db = drizzleSQLite(sqlite, { schema });
  _tables = { prompts: schema.promptsSQLite, records: schema.recordsSQLite };
}

export const isPostgres = usePostgres;

// Type-safe query helpers that abstract the database implementation
export const queries = {
  // Records
  getAllRecords: (): Promise<schema.Record[]> => {
    if (usePostgres) {
      const db = _db as PostgresDb;
      return db.select().from(schema.recordsPostgres);
    }
    const db = _db as SQLiteDb;
    return db.select().from(schema.recordsSQLite);
  },

  getRecordsByPromptId: (promptId: number): Promise<schema.Record[]> => {
    if (usePostgres) {
      const db = _db as PostgresDb;
      return db.select().from(schema.recordsPostgres).where(eq(schema.recordsPostgres.promptId, promptId));
    }
    const db = _db as SQLiteDb;
    return db.select().from(schema.recordsSQLite).where(eq(schema.recordsSQLite.promptId, promptId));
  },

  insertRecords: (values: schema.InsertRecord[]): Promise<unknown> => {
    if (usePostgres) {
      const db = _db as PostgresDb;
      return db.insert(schema.recordsPostgres).values(values);
    }
    const db = _db as SQLiteDb;
    return db.insert(schema.recordsSQLite).values(values);
  },

  updateRecord: (id: number, data: { title?: string | null; description: string }): Promise<schema.Record[]> => {
    if (usePostgres) {
      const db = _db as PostgresDb;
      return db.update(schema.recordsPostgres).set(data).where(eq(schema.recordsPostgres.id, id)).returning();
    }
    const db = _db as SQLiteDb;
    return db.update(schema.recordsSQLite).set(data).where(eq(schema.recordsSQLite.id, id)).returning();
  },

  deleteRecord: (id: number): Promise<unknown> => {
    if (usePostgres) {
      const db = _db as PostgresDb;
      return db.delete(schema.recordsPostgres).where(eq(schema.recordsPostgres.id, id));
    }
    const db = _db as SQLiteDb;
    return db.delete(schema.recordsSQLite).where(eq(schema.recordsSQLite.id, id));
  },

  deleteAllRecords: (): Promise<unknown> => {
    if (usePostgres) {
      const db = _db as PostgresDb;
      return db.delete(schema.recordsPostgres);
    }
    const db = _db as SQLiteDb;
    return db.delete(schema.recordsSQLite);
  },

  // Prompts
  getAllPrompts: (): Promise<schema.Prompt[]> => {
    if (usePostgres) {
      const db = _db as PostgresDb;
      return db.select().from(schema.promptsPostgres);
    }
    const db = _db as SQLiteDb;
    return db.select().from(schema.promptsSQLite);
  },

  insertPrompt: (content: string): Promise<schema.Prompt[]> => {
    if (usePostgres) {
      const db = _db as PostgresDb;
      return db.insert(schema.promptsPostgres).values({ content }).returning();
    }
    const db = _db as SQLiteDb;
    return db.insert(schema.promptsSQLite).values({ content }).returning();
  },

  deleteAllPrompts: (): Promise<unknown> => {
    if (usePostgres) {
      const db = _db as PostgresDb;
      return db.delete(schema.promptsPostgres);
    }
    const db = _db as SQLiteDb;
    return db.delete(schema.promptsSQLite);
  },
};
