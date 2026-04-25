import { Injectable } from '@nestjs/common';
import { UserSyncGateway, SyncUserRequestDTO, SyncUserResponseDTO } from '../../application/interfaces/UserSyncGateway';

@Injectable()
export class HttpUserSyncGateway implements UserSyncGateway {
  private readonly centerUrl = 'http://localhost:4002/v1/sync/users';

  async syncUsers(data: SyncUserRequestDTO): Promise<SyncUserResponseDTO> {
    try {
      const response = await fetch(this.centerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to sync users: ${response.status} ${errorText}`);
      }

      return await response.json() as SyncUserResponseDTO;
    } catch (error) {
      console.error('[HttpUserSyncGateway] Error syncing users:', error);
      throw error;
    }
  }
}
