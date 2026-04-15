export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  QR_CODE = 'QR_CODE'
}

export interface PaymentRequest {
  orderId: string;
  amount: number;
  method: PaymentMethod;
  receivedAmount?: number;
}

export interface PaymentResponse {
  id: string;
  status: string;
  changeAmount?: number;
}

export abstract class PaymentService {
  abstract processPayment(request: PaymentRequest): Promise<PaymentResponse>;
}
