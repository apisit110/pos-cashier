import { Transaction } from '../entities/Transaction';
import { ITransactionRepository } from '../repositories/ITransactionRepository';
import { IIdGenerator } from '../ports/IIdGenerator';

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

export class CreateTransactionUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(data: CreateTransactionInput): Promise<string> {
    const transactionId = this.idGenerator.generate(data.terminalId);

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
    return transaction.id;
  }
}
