import 'dotenv/config';
import { createDatabase } from './infrastructure/database/DatabaseImpl';
import { createApp } from './presentation/app';

const PORT = process.env.PORT ?? 3002;

const db = createDatabase();
const app = createApp(db);

app.listen(PORT, () => {
  console.log(`cashier-orders-service running on port ${PORT}`);
});
