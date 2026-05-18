import { Inject, Injectable } from '@nestjs/common';
import { StaffRepository } from '../../domain/repositories/StaffRepository';
import { StaffStatus } from '../../domain/entities/Staff';
import type { StaffSyncGateway } from '../interfaces/StaffSyncGateway';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SyncStaffsUseCase {
  private readonly ORIGIN_BRANCH_ID = 1;
  private readonly ACCESSIBLE_BRANCH_IDS = [1];

  constructor(
    @Inject(StaffRepository)
    private readonly staffRepository: StaffRepository,
    @Inject('StaffSyncGateway')
    private readonly staffSyncGateway: StaffSyncGateway,
  ) {}

  async execute(): Promise<{ success: boolean; results: any[] }> {
    try {
      const staffs = await this.staffRepository.findAllToSync();

      if (staffs.length === 0) {
        return { success: true, results: [] };
      }

      const syncStaffs = await Promise.all(staffs.map(async (staff) => {
        let syncId = staff.syncId;
        if (!syncId) {
          syncId = uuidv4();
          await this.staffRepository.updateSyncId(staff.id, syncId);
          (staff as any).syncId = syncId;
        }

        return {
          posTempId: syncId,
          userId: staff.userId,
          fullName: staff.fullName,
          pinHash: staff.pinHash,
          roleId: staff.roleId,
          branchIds: this.ACCESSIBLE_BRANCH_IDS,
          status: (staff.status === StaffStatus.INACTIVE ? 'inactive' : 'active') as 'active' | 'inactive',
          originBranchId: this.ORIGIN_BRANCH_ID,
        };
      }));

      const response = await this.staffSyncGateway.syncStaffs({
        staffs: syncStaffs,
      });

      for (const result of response.results) {
        if (result.status === 'synced' || result.status === 'already_synced') {
          const staffToUpdate = staffs.find(s => s.syncId === result.posTempId);
          if (staffToUpdate) {
            await this.staffRepository.updateSyncStatus(
              staffToUpdate.id,
              result.userId || staffToUpdate.userId,
              staffToUpdate.status === StaffStatus.PENDING_SYNC ? StaffStatus.ACTIVE : staffToUpdate.status,
            );
          }
        }
      }

      return {
        success: true,
        results: response.results,
      };
    } catch (error) {
      console.error('[SyncStaffsUseCase] Error syncing staffs:', error);
      return {
        success: false,
        results: [],
      };
    }
  }
}
