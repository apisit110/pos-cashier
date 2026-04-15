import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PaymentService, PaymentRequest, PaymentResponse } from '../../application/interfaces/PaymentService';

@Injectable()
export class ApiPaymentService implements PaymentService {
  private readonly baseUrl = 'http://localhost:3003/v1/payments/internal';
  private readonly INTERNAL_SECRET = 'lightning-pos-internal-shared-secret';

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await axios.post(this.baseUrl, request, {
        headers: {
          'x-internal-secret': this.INTERNAL_SECRET,
        },
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
