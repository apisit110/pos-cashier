import { Module } from '@nestjs/common';
import { OrderController } from './presentation/controllers/OrderController';
import { CreateOrderUseCase } from './application/use-cases/CreateOrderUseCase';
import { UpdateOrderStatusUseCase } from './application/use-cases/UpdateOrderStatusUseCase';
import { CalculateOrderUseCase } from './application/use-cases/CalculateOrderUseCase';
import { CheckoutUseCase } from './application/use-cases/CheckoutUseCase';
import { MockOrderRepository } from './infrastructure/repositories/MockOrderRepository';
import { PaymentService } from './application/interfaces/PaymentService';
import { ApiPaymentService } from './infrastructure/services/ApiPaymentService';

import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'pos-staff-secret-key',
    }),
  ],
  controllers: [OrderController],
  providers: [
    {
      provide: 'OrderRepository',
      useClass: MockOrderRepository,
    },
    {
      provide: CreateOrderUseCase,
      useFactory: (orderRepository: MockOrderRepository) => {
        return new CreateOrderUseCase(orderRepository);
      },
      inject: ['OrderRepository'],
    },
    {
      provide: UpdateOrderStatusUseCase,
      useFactory: (orderRepository: MockOrderRepository) => {
        return new UpdateOrderStatusUseCase(orderRepository);
      },
      inject: ['OrderRepository'],
    },
    {
      provide: PaymentService,
      useClass: ApiPaymentService
    },
    {
      provide: CheckoutUseCase,
      useFactory: (orderRepository: MockOrderRepository, paymentService: PaymentService) => {
        return new CheckoutUseCase(orderRepository, paymentService);
      },
      inject: ['OrderRepository', PaymentService],
    },
    CalculateOrderUseCase,
  ],
})
export class AppModule {}
