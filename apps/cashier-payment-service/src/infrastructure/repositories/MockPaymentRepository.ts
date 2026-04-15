import { Injectable } from '@nestjs/common';
import { Payment } from '../../domain/entities/Payment';
import { PaymentRepository } from '../../application/interfaces/PaymentRepository';

@Injectable()
export class MockPaymentRepository implements PaymentRepository {
  private payments: Payment[] = [];

  async save(payment: Payment): Promise<void> {
    this.payments.push(payment);
    console.log('Payment saved:', payment);
  }

  async findById(id: string): Promise<Payment | null> {
    const payment = this.payments.find((p) => p.id === id);
    return payment || null;
  }

  async update(payment: Payment): Promise<void> {
    const index = this.payments.findIndex((p) => p.id === payment.id);
    if (index !== -1) {
      this.payments[index] = payment;
      console.log('Payment updated:', payment);
    }
  }
}
