import 'dotenv/config';
import { createDatabase } from '../createDatabase';
import { seedAuth } from '../seed/auth';
import { seedTerminal } from '../seed/terminal';

const seeders: Record<string, (db: ReturnType<typeof createDatabase>) => void> = {
  auth: seedAuth,
  terminal: seedTerminal,
};

const target = process.argv[2];

if (!target || (!seeders[target] && target !== 'all')) {
  console.error(`Usage: pnpm db:seed <${[...Object.keys(seeders), 'all'].join('|')}>`);
  process.exit(1);
}

const db = createDatabase();

if (target === 'all') {
  for (const seed of Object.values(seeders)) {
    seed(db);
  }
} else {
  seeders[target](db);
}
