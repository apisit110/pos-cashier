import { Provider } from '@nestjs/common';
import Database from 'better-sqlite3';
import { join } from 'path';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const DatabaseProvider: Provider = {
  provide: DATABASE_CONNECTION,
  useFactory: () => {
    const sqlite = new Database(join(process.cwd(), 'cashier-authen.db'));
    
    // Initialize schema
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS roles (
        id INTEGER PRIMARY KEY,
        role_name TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL UNIQUE,
        role_id INTEGER NOT NULL,
        full_name TEXT NOT NULL,
        pin_hash TEXT NOT NULL,
        status TEXT NOT NULL,
        sync_id TEXT,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (role_id) REFERENCES roles(id)
      );

      CREATE TABLE IF NOT EXISTS role_permissions (
        role_id INTEGER NOT NULL,
        permission_key TEXT NOT NULL,
        is_granted INTEGER NOT NULL,
        FOREIGN KEY (role_id) REFERENCES roles(id)
      );
    `);

    // Seed data
    const insertRole = sqlite.prepare('INSERT OR REPLACE INTO roles (id, role_name) VALUES (?, ?)');
    insertRole.run(1, 'manager');
    insertRole.run(2, 'cashier');

    const insertUser = sqlite.prepare('INSERT OR REPLACE INTO users (user_id, role_id, full_name, pin_hash, status, sync_id, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)');
    insertUser.run('M001', 1, 'Admin Manager', '123456', 'active', '550e8400-e29b-41d4-a716-446655440000', Date.now());



    return drizzle(sqlite, { schema });
  },
};
