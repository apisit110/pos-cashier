import { getHttpClient } from '../http/axiosInstance';
import { SyncState } from '../../domain/entities/SyncState';
import { ISyncStateGateway } from '../../domain/repositories/ISyncStateGateway';

/** `syncState` of a push response (or pull state body), null when missing */
export function toSyncState(data: any): SyncState | null {
  if (typeof data?.productVersion !== 'number' || typeof data?.profileVersion !== 'string') return null;
  return new SyncState(data.productVersion, data.profileVersion);
}

export class HttpSyncStateGatewayImpl implements ISyncStateGateway {
  async fetchSyncState(): Promise<SyncState> {
    const response = await getHttpClient().post('/pull/state');
    const syncState = toSyncState(response.data);
    if (!syncState) {
      throw new Error(`Invalid pull state response: ${JSON.stringify(response.data)}`);
    }
    return syncState;
  }
}
