import 'dotenv/config';
import { createDatabase } from './infrastructure/database/DatabaseImpl';
import { SqlitePaymentRepositoryImpl } from './infrastructure/repositories/SqlitePaymentRepositoryImpl';
import { ProcessPaymentUseCase } from './domain/use-cases/ProcessPaymentUseCase';
import { createApp } from './presentation/app';

const PORT = process.env.PORT ?? 3003;

const db = createDatabase();
const paymentRepository = new SqlitePaymentRepositoryImpl(db);
const processPaymentUseCase = new ProcessPaymentUseCase(paymentRepository);

const app = createApp(processPaymentUseCase);

app.listen(PORT, () => {
  console.log(`Payment service is running on http://localhost:${PORT}`);
});
