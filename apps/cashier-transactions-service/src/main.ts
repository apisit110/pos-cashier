import 'dotenv/config';
import { createDatabase } from './infrastructure/database/DatabaseImpl';
import { SqliteTransactionRepositoryImpl } from './infrastructure/repositories/SqliteTransactionRepositoryImpl';
import { ApiOrderServiceImpl } from './infrastructure/services/ApiOrderServiceImpl';
import { ApiProductServiceImpl } from './infrastructure/services/ApiProductServiceImpl';
import { TransactionIdGeneratorImpl } from './infrastructure/utils/TransactionIdGeneratorImpl';
import { GetTransactionsUseCase } from './domain/use-cases/GetTransactionsUseCase';
import { GetTransactionByIdUseCase } from './domain/use-cases/GetTransactionByIdUseCase';
import { CreateTransactionUseCase } from './domain/use-cases/CreateTransactionUseCase';
import { MarkTransactionSyncedUseCase } from './domain/use-cases/MarkTransactionSyncedUseCase';
import { createApp } from './presentation/app';

const PORT = process.env.PORT ?? 3006;

const db = createDatabase();
const transactionRepository = new SqliteTransactionRepositoryImpl(db);
const orderService = new ApiOrderServiceImpl();
const productService = new ApiProductServiceImpl();
const idGenerator = new TransactionIdGeneratorImpl();

const getTransactionsUseCase = new GetTransactionsUseCase(transactionRepository);
const getTransactionByIdUseCase = new GetTransactionByIdUseCase(transactionRepository, orderService, productService);
const createTransactionUseCase = new CreateTransactionUseCase(transactionRepository, idGenerator);
const markTransactionSyncedUseCase = new MarkTransactionSyncedUseCase(transactionRepository);

const app = createApp(
  getTransactionsUseCase,
  getTransactionByIdUseCase,
  createTransactionUseCase,
  markTransactionSyncedUseCase,
);

app.listen(PORT, () => {
  console.log(`Transactions Service is running on: http://localhost:${PORT}`);
});
