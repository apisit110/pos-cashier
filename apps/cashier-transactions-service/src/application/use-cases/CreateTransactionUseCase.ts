import { Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/entities/Transaction';
import { TransactionRepository } from '../../domain/repositories/TransactionRepository';
import { generateTransactionId } from '../utils/id-generator';
import { SyncQueueService } from '../../infrastructure/queue/SyncQueueService';

export interface CreateTransactionInput {
  orderId: string;
  merchantId: string;
  storeId: string;
  terminalId?: string;
  amount: number;
  paymentMethod: string;
  status: string;
  staffName: string;
}

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly syncQueueService: SyncQueueService,
  ) {}

  async execute(data: CreateTransactionInput): Promise<void> {
    const transactionId = generateTransactionId();

    const transaction = new Transaction(
      transactionId,
      data.orderId,
      data.merchantId,
      data.storeId,
      data.amount,
      data.paymentMethod,
      data.status,
      data.staffName,
      new Date(),
      data.terminalId,
    );

    await this.transactionRepository.save(transaction);
    await this.syncQueueService.addTransactionSyncJob(transaction.id);
  }
}
