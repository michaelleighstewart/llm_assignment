import { sql } from '@vercel/postgres';
import { readFileSync } from 'fs';
import { join } from 'path';

async function runMigration() {
  try {
    console.log('Running Postgres migrations...');
    
    const migrationSQL = readFileSync(join(process.cwd(), 'db/migrations/postgres-init.sql'), 'utf-8');
    
    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    for (const statement of statements) {
      await sql.query(statement);
    }
    
    console.log('✅ Postgres migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  }
}

runMigration();

