import { getHttpClient } from '../http/axiosInstance';
import { ITransactionSyncGateway } from '../../domain/repositories/ITransactionSyncGateway';

export class HttpTransactionSyncGatewayImpl implements ITransactionSyncGateway {
  async syncTransaction(transaction: any): Promise<void> {
    console.log(`Syncing transaction ${transaction.id} to service center...`);

    const payload = {
      transactions: [
        {
          id: transaction.id,
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
      const response = await getHttpClient().post('/push/transactions', payload);
      console.log(`Service center response: ${JSON.stringify(response.data)}`);

      const result = response.data?.results?.[0];
      if (result?.status === 'error') {
        throw new Error(`pos-center failed to sync transaction ${transaction.id}`);
      }
    } catch (error: any) {
      console.error(`Failed to sync transaction to service center: ${error.message}`);
      if (error.response) {
        console.error(`Error response: ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }
}
