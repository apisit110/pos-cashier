import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { OrderController } from './presentation/controllers/OrderController';
import { CalculateOrderUseCase } from './application/use-cases/CalculateOrderUseCase';
import { CheckoutUseCase } from './application/use-cases/CheckoutUseCase';
import { CreateOrderUseCase } from './application/use-cases/CreateOrderUseCase';
import { UpdateOrderStatusUseCase } from './application/use-cases/UpdateOrderStatusUseCase';
import { DatabaseProvider } from './infrastructure/database/database.provider';
import { SqliteOrderRepository } from './infrastructure/repositories/SqliteOrderRepository';
import { PaymentService } from './application/interfaces/PaymentService';
import { ApiPaymentService } from './infrastructure/services/ApiPaymentService';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'pos-staff-secret-key',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [OrderController],
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
    CreateOrderUseCase,
    UpdateOrderStatusUseCase,
    CheckoutUseCase,
    CalculateOrderUseCase,
  ],
})
export class AppModule {}
