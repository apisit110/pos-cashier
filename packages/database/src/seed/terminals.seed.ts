import { schema } from '@lightning-pos/model';

const OFFLINE_MERCHANT_ID = '0001';
const OFFLINE_STORE_ID = '00010001';
const OFFLINE_TERMINAL_ID = '0001000101';

export function seedTerminals(db: any) {
  if (process.env.APP_MODE !== 'offline') {
    console.log('ℹ️ APP_MODE is not offline, skipping terminal seed');
    return;
  }

  const tid = OFFLINE_TERMINAL_ID;
  const mid = OFFLINE_MERCHANT_ID;
  const sid = OFFLINE_STORE_ID;

  db.insert(schema.terminals)
    .values({ tid, mid, sid, isAvailable: true })
    .onConflictDoUpdate({
      target: schema.terminals.tid,
      set: { mid, sid, isAvailable: true },
    })
    .run();
}
