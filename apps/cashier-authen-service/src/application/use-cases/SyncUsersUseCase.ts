import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { UserStatus } from '../../domain/entities/User';
import type { UserSyncGateway } from '../interfaces/UserSyncGateway';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SyncUsersUseCase {
  // Constants for this POS node
  private readonly ORIGIN_BRANCH_ID = 1;
  private readonly ACCESSIBLE_BRANCH_IDS = [1];

  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    @Inject('UserSyncGateway')
    private readonly userSyncGateway: UserSyncGateway,
  ) {}

  async execute(): Promise<{ success: boolean; results: any[] }> {
    try {
      // 1. Fetch users to sync
      const users = await this.userRepository.findAllToSync();
      
      if (users.length === 0) {
        return { success: true, results: [] };
      }

      // 2. Prepare payload
      const syncUsers = await Promise.all(users.map(async (user) => {
        let syncId = user.syncId;
        if (!syncId) {
          syncId = uuidv4();
          await this.userRepository.updateSyncId(user.id, syncId);
          // Update the object in memory so we can find it later
          (user as any).syncId = syncId;
        }

        return {
          posTempId: syncId,
          userId: user.userId,
          fullName: user.fullName,
          pinHash: user.pinHash,
          roleId: user.roleId,
          branchIds: this.ACCESSIBLE_BRANCH_IDS,
          status: (user.status === UserStatus.INACTIVE ? 'inactive' : 'active') as 'active' | 'inactive',
          originBranchId: this.ORIGIN_BRANCH_ID,
        };
      }));

      // 3. Send to gateway
      const response = await this.userSyncGateway.syncUsers({
        users: syncUsers,
      });

      // 4. Update local status and user IDs based on response
      for (const result of response.results) {
        if (result.status === 'synced' || result.status === 'already_synced') {
          // Find the local user that matches this posTempId (syncId)
          const userToUpdate = users.find(u => u.syncId === result.posTempId);
          if (userToUpdate) {
            await this.userRepository.updateSyncStatus(
              userToUpdate.id,
              result.userId || userToUpdate.userId,
              userToUpdate.status === UserStatus.PENDING_SYNC ? UserStatus.ACTIVE : userToUpdate.status
            );
          }
        }
      }

      return {
        success: true,
        results: response.results,
      };
    } catch (error) {
      console.error('[SyncUsersUseCase] Error syncing users:', error);
      return {
        success: false,
        results: [],
      };
    }
  }
}
