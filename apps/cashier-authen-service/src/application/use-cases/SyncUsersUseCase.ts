import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/UserRepository';
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
        }

        return {
          posTempId: syncId,
          staffId: user.userId,
          fullName: user.fullName,
          pinHash: user.pinHash,
          roleId: user.roleId,
          branchIds: this.ACCESSIBLE_BRANCH_IDS,
          status: user.status === 'inactive' ? 'inactive' as const : 'active' as const,
          originBranchId: this.ORIGIN_BRANCH_ID,
        };
      }));

      // 3. Send to gateway
      const response = await this.userSyncGateway.syncUsers({
        users: syncUsers,
      });

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
