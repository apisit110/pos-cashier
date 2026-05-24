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
    const sqlite = new Database(join(process.cwd(), 'pos-cashier-products-service.db'));
    
    const db = drizzle(sqlite, { schema });

    // Initialize schema using migrations
    migrate(db, { 
      migrationsFolder: join(process.cwd(), 'drizzle') 
    });

    return db;
  },
};
