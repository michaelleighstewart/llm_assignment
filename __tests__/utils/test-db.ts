import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '@/lib/db/schema';

/**
 * Create an in-memory SQLite database for testing
 */
export function createTestDatabase() {
  const sqlite = new Database(':memory:');
  
  // Create tables
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS prompts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      created_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prompt_id INTEGER NOT NULL,
      title TEXT,
      description TEXT NOT NULL,
      created_at INTEGER,
      FOREIGN KEY (prompt_id) REFERENCES prompts(id) ON DELETE CASCADE
    );
  `);

  const db = drizzle(sqlite, {
    schema: {
      prompts: schema.promptsSQLite,
      records: schema.recordsSQLite,
    },
  });

  return { db, sqlite, tables: { prompts: schema.promptsSQLite, records: schema.recordsSQLite } };
}

/**
 * Clean up test database
 */
export function cleanupTestDatabase(sqlite: Database.Database) {
  sqlite.exec('DELETE FROM records');
  sqlite.exec('DELETE FROM prompts');
}

/**
 * Close test database connection
 */
export function closeTestDatabase(sqlite: Database.Database) {
  sqlite.close();
}

/**
 * Seed test data into the database
 */
export async function seedTestData(
  db: ReturnType<typeof drizzle>,
  tables: { prompts: typeof schema.promptsSQLite; records: typeof schema.recordsSQLite }
) {
  // Insert a test prompt
  const [prompt] = await db
    .insert(tables.prompts)
    .values({ content: 'Test prompt content' })
    .returning();

  // Insert test records
  const records = await db
    .insert(tables.records)
    .values([
      { promptId: prompt.id, title: 'Test Record 1', description: 'Description 1' },
      { promptId: prompt.id, title: 'Test Record 2', description: 'Description 2' },
    ])
    .returning();

  return { prompt, records };
}

