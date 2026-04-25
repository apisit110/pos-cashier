import { Provider } from '@nestjs/common';
import Database from 'better-sqlite3';
import { join } from 'path';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const DatabaseProvider: Provider = {
  provide: DATABASE_CONNECTION,
  useFactory: () => {
    const sqlite = new Database(join(process.cwd(), 'transactions.db'));
    
    // Initialize schema
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_number TEXT NOT NULL UNIQUE,
        amount REAL NOT NULL,
        payment_method TEXT NOT NULL,
        status TEXT NOT NULL,
        staff_name TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
    `);

    // Seed data
    const insertTransaction = sqlite.prepare(`
      INSERT OR IGNORE INTO transactions (order_number, amount, payment_method, status, staff_name, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertTransaction.run('ORD-001', 150.50, 'cash', 'success', 'Admin Manager', Date.now());
    insertTransaction.run('ORD-002', 45.00, 'qr_promptpay', 'success', 'Cashier One', Date.now() - 3600000);
    insertTransaction.run('ORD-003', 220.00, 'credit_card', 'success', 'Admin Manager', Date.now() - 7200000);

    return drizzle(sqlite, { schema });
  },
};
