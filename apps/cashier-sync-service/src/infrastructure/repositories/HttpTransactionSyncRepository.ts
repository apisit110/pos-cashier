import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { TransactionSyncRepository } from '../../application/interfaces/TransactionSyncRepository';

@Injectable()
export class HttpTransactionSyncRepository implements TransactionSyncRepository {
  private readonly logger = new Logger(HttpTransactionSyncRepository.name);
  private readonly serviceCenterUrl = 'http://localhost:4002/v1/sync/transactions';

  async syncTransaction(transaction: any): Promise<void> {
    this.logger.log(`Syncing transaction ${transaction.id} to service center...`);

    const payload = {
      transactions: [
        {
          order_id: transaction.orderId,
          merchant_id: transaction.merchantId,
          store_id: transaction.storeId,
          terminal_id: transaction.terminalId,
          amount: transaction.amount,
          payment_method: transaction.paymentMethod,
          status: transaction.status,
          staff_name: transaction.staffName,
          created_at: transaction.createdAt,
        },
      ],
    };

    try {
      const response = await axios.post(this.serviceCenterUrl, payload);
      this.logger.log(`Service center response: ${JSON.stringify(response.data)}`);
    } catch (error: any) {
      this.logger.error(`Failed to sync transaction to service center: ${error.message}`);
      if (error.response) {
        this.logger.error(`Error response: ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }
}
