import { Module } from '@nestjs/common';
import { TransactionController } from './presentation/controllers/TransactionController';
import { InternalTransactionController } from './presentation/controllers/InternalTransactionController';
import { GetTransactionsUseCase } from './application/use-cases/GetTransactionsUseCase';
import { GetTransactionByIdUseCase } from './application/use-cases/GetTransactionByIdUseCase';
import { CreateTransactionUseCase } from './application/use-cases/CreateTransactionUseCase';
import { MarkTransactionSyncedUseCase } from './application/use-cases/MarkTransactionSyncedUseCase';
import { TransactionRepository } from './domain/repositories/TransactionRepository';
import { SqliteTransactionRepository } from './infrastructure/repositories/SqliteTransactionRepository';
import { DatabaseProvider } from './infrastructure/database/database.provider';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './presentation/interceptors/LoggingInterceptor';

@Module({
  imports: [],
  controllers: [TransactionController, InternalTransactionController],
  providers: [
    DatabaseProvider,
    {
      provide: TransactionRepository,
      useClass: SqliteTransactionRepository,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    GetTransactionsUseCase,
    GetTransactionByIdUseCase,
    CreateTransactionUseCase,
    MarkTransactionSyncedUseCase,
  ],
})
export class AppModule {}
