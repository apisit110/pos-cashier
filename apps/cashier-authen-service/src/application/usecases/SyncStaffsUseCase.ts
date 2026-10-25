import { IStaffRepository } from '../../domain/repositories/IStaffRepository';
import { IStaffPinRepository } from '../../domain/repositories/IStaffPinRepository';
import { IStaffSyncGateway, CashierProfileStaffDTO } from '../../domain/repositories/IStaffSyncGateway';
import { StaffStatus, StaffSyncStatus } from '../../domain/entities/Staff';
import { ROLE_ID } from '@lightning-pos/model';

export class SyncStaffsUseCase {
  constructor(
    private readonly staffRepository: IStaffRepository,
    private readonly staffPinRepository: IStaffPinRepository,
    private readonly staffSyncGateway: IStaffSyncGateway,
  ) {}

  /**
   * Pulls the staffs of the merchant from pos-center (cashier profile) and upserts them with their pin hash by username
   */
  async execute(): Promise<{ success: boolean; results: { userId: string; status: string }[] }> {
    const profile = await this.staffSyncGateway.pullCashierProfile();

    const results = [];
    for (const centerStaff of profile.staffs) {
      try {
        const staff = await this.staffRepository.upsertByUsername({
          username: centerStaff.username,
          fullName: centerStaff.full_name || centerStaff.username,
          roleId: this.toRoleId(centerStaff.roles),
          status: centerStaff.status === 'ACTIVE' ? StaffStatus.ACTIVE : StaffStatus.INACTIVE,
          syncStatus: StaffSyncStatus.SYNCED,
          syncId: centerStaff.uid,
        });

        if (centerStaff.pin_hash) {
          await this.staffPinRepository.upsert({ userId: staff.id, pinHash: centerStaff.pin_hash });
        }

        results.push({ userId: centerStaff.username, status: 'synced' });
      } catch (error) {
        console.error(`[SyncStaffsUseCase] Failed to save staff ${centerStaff.username}:`, error);
        results.push({ userId: centerStaff.username, status: 'error' });
      }
    }

    return { success: true, results };
  }

  private toRoleId(roles: CashierProfileStaffDTO['roles']): number {
    return roles.some((role) => role.toLowerCase() === 'manager') ? ROLE_ID.MANAGER : ROLE_ID.CASHIER;
  }
}
