import axios from 'axios';
import { IPaymentService, PaymentRequest, PaymentResponse } from '../../domain/repositories/IPaymentService';

const INTERNAL_SECRET = process.env.INTERNAL_SECRET ?? 'lightning-pos-internal-shared-secret';

export class ApiPaymentServiceImpl implements IPaymentService {
  private readonly baseUrl = 'http://localhost:3003/api/v1/payment/internal';

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await axios.post(this.baseUrl, request, {
        headers: { 'x-internal-secret': INTERNAL_SECRET },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Payment Service Error');
      }
      throw new Error('Connection to Payment Service failed');
    }
  }
}
