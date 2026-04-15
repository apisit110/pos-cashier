import { Module } from '@nestjs/common';
import { PaymentController } from './presentation/controllers/PaymentController';
import { ProcessPaymentUseCase } from './application/use-cases/ProcessPaymentUseCase';
import { DatabaseProvider } from './infrastructure/database/database.provider';
import { SqlitePaymentRepository } from './infrastructure/repositories/SqlitePaymentRepository';

@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [
    DatabaseProvider,
    {
      provide: 'PaymentRepository',
      useClass: SqlitePaymentRepository,
    },
    ProcessPaymentUseCase,
  ],
})
export class AppModule {}
