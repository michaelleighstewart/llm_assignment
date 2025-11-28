import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { pgTable, text as pgText, integer as pgInteger, serial, timestamp } from 'drizzle-orm/pg-core';

// SQLite Schema
export const promptsSQLite = sqliteTable('prompts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const recordsSQLite = sqliteTable('records', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  promptId: integer('prompt_id').notNull().references(() => promptsSQLite.id, { onDelete: 'cascade' }),
  title: text('title'),
  description: text('description').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// PostgreSQL Schema
export const promptsPostgres = pgTable('prompts', {
  id: serial('id').primaryKey(),
  content: pgText('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const recordsPostgres = pgTable('records', {
  id: serial('id').primaryKey(),
  promptId: pgInteger('prompt_id').notNull().references(() => promptsPostgres.id, { onDelete: 'cascade' }),
  title: pgText('title'),
  description: pgText('description').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Type exports
export type Prompt = typeof promptsSQLite.$inferSelect;
export type InsertPrompt = typeof promptsSQLite.$inferInsert;
export type Record = typeof recordsSQLite.$inferSelect;
export type InsertRecord = typeof recordsSQLite.$inferInsert;

