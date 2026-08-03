import { IStaffRepository } from '../repositories/IStaffRepository';
import { IStaffPinRepository } from '../repositories/IStaffPinRepository';
import { IStaffSyncGateway } from '../ports/IStaffSyncGateway';
import { StaffStatus } from '../entities/Staff';

export class SyncStaffsUseCase {
  private readonly ORIGIN_BRANCH_ID = 1;
  private readonly ACCESSIBLE_BRANCH_IDS = [1];

  constructor(
    private readonly staffRepository: IStaffRepository,
    private readonly staffPinRepository: IStaffPinRepository,
    private readonly staffSyncGateway: IStaffSyncGateway,
  ) {}

  async execute(): Promise<{ success: boolean; results: any[] }> {
    try {
      const staffs = await this.staffRepository.findAllToSync();

      if (staffs.length === 0) {
        return { success: true, results: [] };
      }

      const syncStaffs = await Promise.all(
        staffs.map(async (staff) => {
          const staffPin = await this.staffPinRepository.findByUserId(staff.id);
          return {
            userId: staff.username,
            fullName: staff.fullName,
            pinHash: staffPin?.pinHash ?? '',
            roleId: staff.roleId,
            branchIds: this.ACCESSIBLE_BRANCH_IDS,
            status: (staff.status === StaffStatus.INACTIVE ? 'inactive' : 'active') as 'active' | 'inactive',
            originBranchId: this.ORIGIN_BRANCH_ID,
          };
        }),
      );

      const response = await this.staffSyncGateway.syncStaffs({ staffs: syncStaffs });

      for (const result of response.results) {
        if (result.status === 'synced' || result.status === 'already_synced') {
          const staffToUpdate = staffs.find((s) => s.username === result.userId);
          if (staffToUpdate) {
            await this.staffRepository.updateSyncStatus(
              staffToUpdate.id,
              staffToUpdate.username,
              staffToUpdate.status === StaffStatus.PENDING_SYNC
                ? StaffStatus.ACTIVE
                : staffToUpdate.status,
            );
          }
        }
      }

      return { success: true, results: response.results };
    } catch (error) {
      console.error('[SyncStaffsUseCase] Error syncing staffs:', error);
      return { success: false, results: [] };
    }
  }
}
