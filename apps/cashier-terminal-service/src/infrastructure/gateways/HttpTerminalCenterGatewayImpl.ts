import axios from 'axios';
import { createSyncClient, syncConfigFromEnv } from '@lightning-pos/sync-client';
import { CenterCashierProfile, CenterStaff, ITerminalCenterGateway } from '../../domain/repositories/ITerminalCenterGateway';

interface CashierProfileResponse {
  merchant: { partner_id: string };
  store: { sid: string };
  terminal: { tid: string };
  staffs: {
    uid: string;
    username: string;
    full_name: string;
    status: CenterStaff['status'];
    roles: string[];
    pin_hash: string;
  }[];
}

export class HttpTerminalCenterGatewayImpl implements ITerminalCenterGateway {
  async pullCashierProfile(tid: string): Promise<CenterCashierProfile | null> {
    // the sync token belongs to one terminal, so request it for the tid the cashier entered
    const client = createSyncClient({ ...syncConfigFromEnv(), tid });

    try {
      const response = await client.post<CashierProfileResponse>('/pull/cashier-profile');
      const { merchant, store, terminal, staffs = [] } = response.data;
      return {
        terminal: { tid: terminal.tid, mid: merchant.partner_id, sid: store.sid },
        staffs: staffs.map((staff) => ({
          uid: staff.uid,
          username: staff.username,
          fullName: staff.full_name,
          status: staff.status,
          roles: staff.roles ?? [],
          pinHash: staff.pin_hash,
        })),
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      console.error('[HttpTerminalCenterGatewayImpl] Error pulling cashier profile:', (error as Error).message);
      throw error;
    }
  }
}
