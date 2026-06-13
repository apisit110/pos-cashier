import { Payment } from '../../domain/entities/Payment';
import { IPaymentRepository } from '../../domain/repositories/IPaymentRepository';

export class MockPaymentRepositoryImpl implements IPaymentRepository {
  private payments: Payment[] = [];

  async save(payment: Payment): Promise<void> {
    this.payments.push(payment);
    console.log('Payment saved:', payment);
  }

  async findById(id: string): Promise<Payment | null> {
    return this.payments.find((p) => p.id === id) ?? null;
  }

  async update(payment: Payment): Promise<void> {
    const index = this.payments.findIndex((p) => p.id === payment.id);
    if (index !== -1) {
      this.payments[index] = payment;
      console.log('Payment updated:', payment);
    }
  }
}
