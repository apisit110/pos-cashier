import { IStaffSyncGateway, SyncStaffRequestDTO, SyncStaffResponseDTO } from '../../domain/repositories/IStaffSyncGateway';

export class HttpStaffSyncGatewayImpl implements IStaffSyncGateway {
  private readonly centerUrl = 'http://localhost:4002/v1/sync/users';

  async syncStaffs(data: SyncStaffRequestDTO): Promise<SyncStaffResponseDTO> {
    try {
      const response = await fetch(this.centerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users: data.staffs }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to sync staffs: ${response.status} ${errorText}`);
      }

      return (await response.json()) as SyncStaffResponseDTO;
    } catch (error) {
      console.error('[HttpStaffSyncGatewayImpl] Error syncing staffs:', error);
      throw error;
    }
  }
}
