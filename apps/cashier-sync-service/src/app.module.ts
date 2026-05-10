import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SyncProcessor } from './infrastructure/queue/SyncProcessor';
import { HttpOrderSyncRepository } from './infrastructure/repositories/HttpOrderSyncRepository';
import { HttpTransactionSyncRepository } from './infrastructure/repositories/HttpTransactionSyncRepository';
import { SyncOrderUseCase } from './application/use-cases/SyncOrderUseCase';
import { SyncTransactionUseCase } from './application/use-cases/SyncTransactionUseCase';
import { ApiOrderRepository } from './infrastructure/repositories/ApiOrderRepository';
import { ApiTransactionRepository } from './infrastructure/repositories/ApiTransactionRepository';
import { SYNC_QUEUE_NAME } from './infrastructure/queue/sync-queue.constants';

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
  providers: [
    SyncProcessor,
    SyncOrderUseCase,
    SyncTransactionUseCase,
    {
      provide: 'OrderSyncRepository',
      useClass: HttpOrderSyncRepository,
    },
    {
      provide: 'TransactionSyncRepository',
      useClass: HttpTransactionSyncRepository,
    },
    {
      provide: 'OrderRepository',
      useClass: ApiOrderRepository,
    },
    {
      provide: 'TransactionRepository',
      useClass: ApiTransactionRepository,
    },
  ],
})
export class AppModule {}
