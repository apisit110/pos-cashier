import axios from 'axios';
import { createSyncClient, syncConfigFromEnv } from '@lightning-pos/sync-client';
import { CenterTerminal, ITerminalCenterGateway } from '../../domain/repositories/ITerminalCenterGateway';

interface CashierProfileResponse {
  merchant: { partner_id: string };
  store: { sid: string };
  terminal: { tid: string };
}

export class HttpTerminalCenterGatewayImpl implements ITerminalCenterGateway {
  async findByTid(tid: string): Promise<CenterTerminal | null> {
    // the sync token belongs to one terminal, so request it for the tid the cashier entered
    const client = createSyncClient({ ...syncConfigFromEnv(), tid });

    try {
      const response = await client.post<CashierProfileResponse>('/pull/cashier-profile');
      const { merchant, store, terminal } = response.data;
      return { tid: terminal.tid, mid: merchant.partner_id, sid: store.sid };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      console.error('[HttpTerminalCenterGatewayImpl] Error pulling cashier profile:', (error as Error).message);
      throw error;
    }
  }
}
