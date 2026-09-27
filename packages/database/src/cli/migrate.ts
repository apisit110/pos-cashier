import 'dotenv/config';
import { join } from 'path';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { createDatabase } from '../createDatabase';

const db = createDatabase();

migrate(db, { migrationsFolder: join(__dirname, '../../drizzle') });

console.log('Migrations applied');
