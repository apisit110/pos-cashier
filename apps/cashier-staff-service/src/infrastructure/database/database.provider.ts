import { Provider } from '@nestjs/common';
import Database from 'better-sqlite3';
import { join } from 'path';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const DatabaseProvider: Provider = {
  provide: DATABASE_CONNECTION,
  useFactory: () => {
    const sqlite = new Database(join(process.cwd(), 'staff.db'));
    
    // Initialize schema
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS staff (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL
      );
    `);

    // Seed data if empty
    const count = sqlite.prepare('SELECT COUNT(*) as count FROM staff').get() as { count: number };
    if (count.count === 0) {
      const insert = sqlite.prepare('INSERT INTO staff (id, email, name, password, role) VALUES (?, ?, ?, ?, ?)');
      insert.run('staff-67890', 'staff', 'Staff User', 'staff', 'cashier');
      insert.run('admin-12345', 'admin', 'Admin User', 'admin', 'admin');
    }

    return drizzle(sqlite, { schema });
  },
};
