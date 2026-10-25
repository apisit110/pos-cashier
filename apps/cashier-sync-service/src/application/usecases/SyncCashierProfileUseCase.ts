import { ROLE_ID } from '@lightning-pos/model';
import { IStaffRepository } from '../../domain/repositories/IStaffRepository';
import { ISyncMetadataRepository } from '../../domain/repositories/ISyncMetadataRepository';
import { ICashierProfileGateway, CashierProfileStaffDTO } from '../../domain/repositories/ICashierProfileGateway';

export class SyncCashierProfileUseCase {
  constructor(
    private readonly staffRepository: IStaffRepository,
    private readonly syncMetadataRepository: ISyncMetadataRepository,
    private readonly cashierProfileGateway: ICashierProfileGateway,
  ) {}

  /**
   * Pulls the staffs of the merchant from pos-center (cashier profile) and upserts them with their pin hash by username
   */
  async execute(): Promise<{ success: boolean; results: { userId: string; status: string }[] }> {
    const profile = await this.cashierProfileGateway.pullCashierProfile();

    const results = [];
    for (const centerStaff of profile.staffs) {
      try {
        await this.staffRepository.upsertWithPin({
          username: centerStaff.username,
          fullName: centerStaff.full_name || centerStaff.username,
          roleId: this.toRoleId(centerStaff.roles),
          status: centerStaff.status === 'ACTIVE' ? 'active' : 'inactive',
          syncId: centerStaff.uid,
          pinHash: centerStaff.pin_hash || null,
        });
        results.push({ userId: centerStaff.username, status: 'synced' });
      } catch (error) {
        console.error(`[SyncCashierProfileUseCase] Failed to save staff ${centerStaff.username}:`, error);
        results.push({ userId: centerStaff.username, status: 'error' });
      }
    }

    // keep the version only when every staff is saved, otherwise the next sync-pull pulls again
    if (results.every((result) => result.status === 'synced')) {
      await this.syncMetadataRepository.upsert({ profileVersion: profile.profile_version });
    }

    return { success: true, results };
  }

  private toRoleId(roles: CashierProfileStaffDTO['roles']): number {
    return roles.some((role) => role.toLowerCase() === 'manager') ? ROLE_ID.MANAGER : ROLE_ID.CASHIER;
  }
}
