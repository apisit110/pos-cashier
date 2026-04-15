import { Provider } from '@nestjs/common';
import Database from 'better-sqlite3';
import { join } from 'path';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const DatabaseProvider: Provider = {
  provide: DATABASE_CONNECTION,
  useFactory: () => {
    const sqlite = new Database(join(process.cwd(), 'members.db'));
    
    // Initialize schema
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS members (
        id TEXT PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        points INTEGER NOT NULL DEFAULT 0
      );
    `);

    // Seed data if empty
    const count = sqlite.prepare('SELECT COUNT(*) as count FROM members').get() as { count: number };
    if (count.count === 0) {
      const insert = sqlite.prepare('INSERT INTO members (id, first_name, last_name, points) VALUES (?, ?, ?, ?)');
      insert.run('M001', 'Alice', 'Johnson', 1500);
      insert.run('M002', 'Bob', 'Smith', 450);
      insert.run('M003', 'Charlie', 'Brown', 50);
      insert.run('0987654321', 'Somchai', 'Jaidi', 1250);
    }

    return drizzle(sqlite, { schema });
  },
};
