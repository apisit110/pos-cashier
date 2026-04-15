import { Injectable } from '@nestjs/common';
import { Payment, PaymentMethod, PaymentStatus } from '../../domain/entities/Payment';
import type { PaymentRepository } from '../interfaces/PaymentRepository';

export class ProcessPaymentDto {
  orderId: string;
  amount: number;
  method: PaymentMethod;
  receivedAmount?: number;
}

@Injectable()
export class ProcessPaymentUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(data: ProcessPaymentDto): Promise<Payment> {
    const payment = new Payment(
      Math.random().toString(36).substring(2, 9),
      data.orderId,
      data.amount,
      data.method,
      PaymentStatus.PENDING,
      new Date()
    );

    // Process payment based on method
    if (data.method === PaymentMethod.CASH) {
      if (!data.receivedAmount || data.receivedAmount < data.amount) {
        throw new Error('Insufficient cash received');
      }
      payment.receivedAmount = data.receivedAmount;
      payment.changeAmount = data.receivedAmount - data.amount;
      
      // Cash is successful immediately
      payment.complete();
      console.log(`Cash payment completed for order ${data.orderId}`);
    } else {
      // CREDIT or QR remain PENDING until gateway notification
      console.log(`Payment initiated via ${data.method} for order ${data.orderId}. Waiting for gateway...`);
    }

    await this.paymentRepository.save(payment);
    return payment;
  }
}
