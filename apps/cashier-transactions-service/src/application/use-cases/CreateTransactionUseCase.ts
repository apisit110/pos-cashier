import { Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/entities/Transaction';
import { TransactionRepository } from '../../domain/repositories/TransactionRepository';
import { generateTransactionId } from '../utils/id-generator';

export interface CreateTransactionInput {
  orderId: string;
  amount: number;
  paymentMethod: string;
  status: string;
  staffName: string;
}

@Injectable()
export class CreateTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(data: CreateTransactionInput): Promise<void> {
    const transactionId = generateTransactionId();

    const transaction = new Transaction(
      transactionId,
      data.orderId,
      data.amount,
      data.paymentMethod,
      data.status,
      data.staffName,
      new Date(),
    );

    await this.transactionRepository.save(transaction);
  }
}
