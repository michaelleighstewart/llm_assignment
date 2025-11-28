import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

const databasePath = process.env.DATABASE_URL?.replace('file:', '') || './local.db';
const sqlite = new Database(databasePath);

const migrationSQL = readFileSync(join(process.cwd(), 'db/migrations/sqlite-init.sql'), 'utf-8');

sqlite.exec(migrationSQL);

console.log('✅ SQLite migrations completed successfully');

