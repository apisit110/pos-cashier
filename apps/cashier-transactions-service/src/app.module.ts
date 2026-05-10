import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TransactionController } from './presentation/controllers/TransactionController';
import { GetTransactionsUseCase } from './application/use-cases/GetTransactionsUseCase';
import { GetTransactionByIdUseCase } from './application/use-cases/GetTransactionByIdUseCase';
import { CreateTransactionUseCase } from './application/use-cases/CreateTransactionUseCase';
import { TransactionRepository } from './domain/repositories/TransactionRepository';
import { SqliteTransactionRepository } from './infrastructure/repositories/SqliteTransactionRepository';
import { DatabaseProvider } from './infrastructure/database/database.provider';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './presentation/interceptors/LoggingInterceptor';
import { SyncQueueService } from './infrastructure/queue/SyncQueueService';
import { MarkTransactionSyncedUseCase } from './application/use-cases/MarkTransactionSyncedUseCase';
import { SYNC_QUEUE_NAME } from './infrastructure/queue/sync-queue.constants';
import { InternalTransactionController } from './presentation/controllers/InternalTransactionController';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: SYNC_QUEUE_NAME,
    }),
  ],
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
    SyncQueueService,
    MarkTransactionSyncedUseCase,
  ],
})
export class AppModule {}
