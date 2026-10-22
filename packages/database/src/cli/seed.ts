import 'dotenv/config';
import { createDatabase } from '../createDatabase';
import { seedAuth } from '../seed/auth.seed';
import { seedTerminals } from '../seed/terminals.seed';

function seed() {
  console.log('🌱 Setting up initial system data...');

  const db = createDatabase();

  try {
    db.transaction((tx) => {
      // seed auth
      seedAuth(tx);

      // seed terminal
      seedTerminals(tx);
    });

    console.log('✅ System setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ System setup failed:', error);
    process.exit(1);
  }
}

seed();
