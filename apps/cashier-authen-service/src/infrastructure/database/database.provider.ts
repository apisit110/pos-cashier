import { Provider } from '@nestjs/common';
import Database from 'better-sqlite3';
import { join } from 'path';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema';
import { seedDatabase } from './seed';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const DatabaseProvider: Provider = {
  provide: DATABASE_CONNECTION,
  useFactory: () => {
    const sqlite = new Database(join(process.cwd(), 'cashier-authen-service.db'));
    
    const db = drizzle(sqlite, { schema });

    // Initialize schema using migrations
    migrate(db, { 
      migrationsFolder: join(process.cwd(), 'drizzle') 
    });

    seedDatabase(db);

    return db;
  },
};
