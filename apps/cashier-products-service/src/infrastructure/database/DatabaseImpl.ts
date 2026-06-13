import Database from 'better-sqlite3';
import { join } from 'path';
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema';

export function createDatabase(): BetterSQLite3Database<typeof schema> {
  const sqlite = new Database(join(process.cwd(), 'pos-cashier-products-service.db'));
  const db = drizzle(sqlite, { schema });
  migrate(db, { migrationsFolder: join(process.cwd(), 'drizzle') });
  return db;
}
