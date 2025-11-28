import type { Config } from 'drizzle-kit';

const isDevelopment = process.env.NODE_ENV !== 'production';
const usePostgres = process.env.POSTGRES_URL && !isDevelopment;

export default {
  schema: './lib/db/schema.ts',
  out: './db/migrations',
  dialect: usePostgres ? 'postgresql' : 'sqlite',
  dbCredentials: usePostgres
    ? {
        url: process.env.POSTGRES_URL!,
      }
    : {
        url: process.env.DATABASE_URL || 'file:./local.db',
      },
} satisfies Config;

