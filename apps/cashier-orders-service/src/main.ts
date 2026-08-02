import 'dotenv/config';

if (!process.env.JWT_SECRET) {
  console.error('Missing required environment variable: JWT_SECRET');
  process.exit(1);
}

import { createDatabase } from '@lightning-pos/database';
import { createApp } from './presentation/app';

const PORT = process.env.PORT ?? 3002;

const db = createDatabase();
const app = createApp(db);

app.listen(PORT, () => {
  console.log(`cashier-orders-service running on port ${PORT}`);
});
