import { IStaffSyncGateway, CashierProfileDTO } from '../../domain/repositories/IStaffSyncGateway';
import { getHttpClient } from '../http/axiosInstance';

export class HttpStaffSyncGatewayImpl implements IStaffSyncGateway {
  async pullCashierProfile(): Promise<CashierProfileDTO> {
    try {
      const response = await getHttpClient().post<CashierProfileDTO>('/pull/cashier-profile');
      return response.data;
    } catch (error: any) {
      console.error('[HttpStaffSyncGatewayImpl] Error pulling cashier profile:', error.message);
      throw error;
    }
  }
}
