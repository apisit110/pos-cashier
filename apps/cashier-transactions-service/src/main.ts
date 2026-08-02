import 'dotenv/config';
import { createDatabase } from '@lightning-pos/database';
import { SqliteTransactionRepositoryImpl } from './infrastructure/repositories/SqliteTransactionRepositoryImpl';
import { SqliteOrderServiceImpl } from './infrastructure/services/SqliteOrderServiceImpl';
import { SqliteProductServiceImpl } from './infrastructure/services/SqliteProductServiceImpl';
import { GetTransactionsUseCase } from './domain/use-cases/GetTransactionsUseCase';
import { GetTransactionByIdUseCase } from './domain/use-cases/GetTransactionByIdUseCase';
import { createApp } from './presentation/app';

const PORT = process.env.PORT ?? 3006;

const db = createDatabase();
const transactionRepository = new SqliteTransactionRepositoryImpl(db);
const orderService = new SqliteOrderServiceImpl(db);
const productService = new SqliteProductServiceImpl(db);

const getTransactionsUseCase = new GetTransactionsUseCase(transactionRepository);
const getTransactionByIdUseCase = new GetTransactionByIdUseCase(transactionRepository, orderService, productService);

const app = createApp(getTransactionsUseCase, getTransactionByIdUseCase);

app.listen(PORT, () => {
  console.log(`Transactions Service is running on: http://localhost:${PORT}`);
});
