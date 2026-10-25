import { getHttpClient } from '../http/axiosInstance';
import { ICashierProfileGateway, CashierProfileDTO } from '../../domain/repositories/ICashierProfileGateway';

export class HttpCashierProfileGatewayImpl implements ICashierProfileGateway {
  async pullCashierProfile(): Promise<CashierProfileDTO> {
    try {
      const response = await getHttpClient().post<CashierProfileDTO>('/pull/cashier-profile');
      return response.data;
    } catch (error: any) {
      console.error('[HttpCashierProfileGatewayImpl] Error pulling cashier profile:', error.message);
      throw error;
    }
  }
}
