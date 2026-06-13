import { Payment, PaymentMethod, PaymentStatus } from '../entities/Payment';
import { IPaymentRepository } from '../repositories/IPaymentRepository';

export interface ProcessPaymentDto {
  orderId: string;
  amount: number;
  method: PaymentMethod;
  receivedAmount?: number;
}

export class ProcessPaymentUseCase {
  constructor(private readonly paymentRepository: IPaymentRepository) {}

  async execute(data: ProcessPaymentDto): Promise<Payment> {
    const payment = new Payment(
      Math.random().toString(36).substring(2, 9),
      data.orderId,
      data.amount,
      data.method,
      PaymentStatus.PENDING,
      new Date(),
    );

    if (data.method === PaymentMethod.CASH) {
      if (!data.receivedAmount || data.receivedAmount < data.amount) {
        throw new Error('Insufficient cash received');
      }
      payment.receivedAmount = data.receivedAmount;
      payment.changeAmount = data.receivedAmount - data.amount;
      payment.complete();
      console.log(`Cash payment completed for order ${data.orderId}`);
    } else {
      console.log(`Payment initiated via ${data.method} for order ${data.orderId}. Waiting for gateway...`);
    }

    await this.paymentRepository.save(payment);
    return payment;
  }
}
