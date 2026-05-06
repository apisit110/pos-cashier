import { Provider } from '@nestjs/common';
import Database from 'better-sqlite3';
import { join } from 'path';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const DatabaseProvider: Provider = {
  provide: DATABASE_CONNECTION,
  useFactory: () => {
    const sqlite = new Database(join(process.cwd(), 'products.db'));
    
    const db = drizzle(sqlite, { schema });

    // Initialize schema using migrations
    migrate(db, { 
      migrationsFolder: join(process.cwd(), 'drizzle') 
    });

    // Seed data if empty
    const count = sqlite.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
    if (count.count === 0) {
      const insert = sqlite.prepare('INSERT INTO products (id, barcode, name, price, unit_name) VALUES (?, ?, ?, ?, ?)');
      insert.run('P001', '1234567890', 'Coca Cola', 15, 'can');
      insert.run('P002', '2345678901', 'Pepsi', 15, 'can');
      insert.run('P003', '3456789012', 'Water Bottle', 7, 'bottle');
      insert.run('P004', '4567890123', 'Lays Chips', 20, 'bag');
      insert.run('P005', '5678901234', 'KitKat', 12, 'bar');
    }

    return db;
  },
};
