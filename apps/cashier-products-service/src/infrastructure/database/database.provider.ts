import { Provider } from '@nestjs/common';
import Database from 'better-sqlite3';
import { join } from 'path';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const DatabaseProvider: Provider = {
  provide: DATABASE_CONNECTION,
  useFactory: () => {
    const sqlite = new Database(join(process.cwd(), 'products.db'));
    
    // Initialize schema
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        barcode TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        image_url TEXT,
        unit_name TEXT,
        brand TEXT
      );
    `);

    // Seed data if empty
    const count = sqlite.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
    if (count.count === 0) {
      const insert = sqlite.prepare('INSERT INTO products (id, barcode, name, price) VALUES (?, ?, ?, ?)');
      insert.run('1', '8850029016149', 'Singha Water 600ml', 10);
      insert.run('2', '8850029016156', 'Chang Water 600ml', 9);
      insert.run('3', '1234567890', 'Test Product', 20);
    }

    return drizzle(sqlite, { schema });
  },
};
