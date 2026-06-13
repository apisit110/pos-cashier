import axios from 'axios';
import { ITransactionSyncGateway } from '../../domain/repositories/ITransactionSyncGateway';

export class HttpTransactionSyncGatewayImpl implements ITransactionSyncGateway {
  private readonly serviceCenterUrl = 'http://localhost:4002/v1/sync/transactions';

  async syncTransaction(transaction: any): Promise<void> {
    console.log(`Syncing transaction ${transaction.id} to service center...`);

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
      console.log(`Service center response: ${JSON.stringify(response.data)}`);
    } catch (error: any) {
      console.error(`Failed to sync transaction to service center: ${error.message}`);
      if (error.response) {
        console.error(`Error response: ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }
}
