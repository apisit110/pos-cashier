import { Module } from '@nestjs/common';
import { PaymentController } from './presentation/controllers/PaymentController';
import { ProcessPaymentUseCase } from './application/use-cases/ProcessPaymentUseCase';
import { MockPaymentRepository } from './infrastructure/repositories/MockPaymentRepository';

@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [
    {
      provide: 'PaymentRepository',
      useClass: MockPaymentRepository,
    },
    {
      provide: ProcessPaymentUseCase,
      useFactory: (paymentRepository: MockPaymentRepository) => {
        return new ProcessPaymentUseCase(paymentRepository);
      },
      inject: ['PaymentRepository'],
    },
  ],
})
export class AppModule {}
