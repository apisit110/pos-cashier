import Database from 'better-sqlite3';
import { join } from 'path';
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema';
import { seedDatabase } from './seed';

export function createDatabase(): BetterSQLite3Database<typeof schema> {
  const sqlite = new Database(join(process.cwd(), 'pos-cashier-authen-service.db'));
  const db = drizzle(sqlite, { schema });
  migrate(db, { migrationsFolder: join(process.cwd(), 'drizzle') });
  seedDatabase(db);
  return db;
}
