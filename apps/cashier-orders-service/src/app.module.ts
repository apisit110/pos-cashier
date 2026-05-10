import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bullmq';
import { OrderController } from './presentation/controllers/OrderController';
import { CalculateOrderUseCase } from './application/use-cases/CalculateOrderUseCase';
import { CheckoutUseCase } from './application/use-cases/CheckoutUseCase';
import { CreateOrderUseCase } from './application/use-cases/CreateOrderUseCase';
import { UpdateOrderStatusUseCase } from './application/use-cases/UpdateOrderStatusUseCase';
import { DatabaseProvider } from './infrastructure/database/database.provider';
import { SqliteOrderRepository } from './infrastructure/repositories/SqliteOrderRepository';
import { PaymentService } from './application/interfaces/PaymentService';
import { ApiPaymentService } from './infrastructure/services/ApiPaymentService';
import { TransactionService } from './application/interfaces/TransactionService';
import { ApiTransactionService } from './infrastructure/services/ApiTransactionService';
import { SyncQueueService } from './infrastructure/queue/SyncQueueService';
import { GetOrderByIdUseCase } from './application/use-cases/GetOrderByIdUseCase';
import { MarkOrderSyncedUseCase } from './application/use-cases/MarkOrderSyncedUseCase';
import { SYNC_QUEUE_NAME } from './infrastructure/queue/sync-queue.constants';

import { InternalOrderController } from './presentation/controllers/InternalOrderController';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: 'pos-staff-secret-key',
      signOptions: { expiresIn: '60m' },
    }),
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
  controllers: [OrderController, InternalOrderController],
  providers: [
    DatabaseProvider,
    {
      provide: 'OrderRepository',
      useClass: SqliteOrderRepository,
    },
    {
      provide: 'PaymentService',
      useClass: ApiPaymentService
    },
    {
      provide: 'TransactionService',
      useClass: ApiTransactionService
    },
    CreateOrderUseCase,
    UpdateOrderStatusUseCase,
    CheckoutUseCase,
    CalculateOrderUseCase,
    SyncQueueService,
    GetOrderByIdUseCase,
    MarkOrderSyncedUseCase,
  ],
})
export class AppModule {}
