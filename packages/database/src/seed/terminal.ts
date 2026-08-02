import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { schema } from '@lightning-pos/model';

export function seedTerminals(db: any) {
  const tid = process.env.TERMINAL_ID;
  const mid = process.env.MERCHANT_ID;
  const sid = process.env.STORE_ID;

  if (!tid || !mid || !sid) {
    throw new Error('TERMINAL_ID, MERCHANT_ID, and STORE_ID must be defined in environment variables');
  }

  db.insert(schema.terminals)
    .values({ tid, mid, sid, isAvailable: true })
    .onConflictDoUpdate({
      target: schema.terminals.tid,
      set: { mid, sid, isAvailable: true },
    })
    .run();
}

export function seedTerminal(db: BetterSQLite3Database<typeof schema>) {
  try {
    db.transaction((tx) => {
      console.log('🌱 Seeding terminal database...');
      seedTerminals(tx);
      console.log('✅ Seeding completed successfully.');
    });
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}
