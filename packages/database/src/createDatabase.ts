import Database from 'better-sqlite3';
import { join, resolve } from 'path';
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { schema } from '@lightning-pos/model';

export function createDatabase(): BetterSQLite3Database<typeof schema> {
  const dbPath = process.env.DATABASE_PATH
    ? resolve(process.cwd(), process.env.DATABASE_PATH)
    : resolve(__dirname, '../../../pos-cashier.db');

  const sqlite = new Database(dbPath);
  sqlite.pragma('journal_mode = WAL');

  const db = drizzle(sqlite, { schema });
  migrate(db, { migrationsFolder: join(__dirname, '../drizzle') });
  return db;
}
