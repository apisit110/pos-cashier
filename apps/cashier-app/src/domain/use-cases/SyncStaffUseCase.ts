import type { StaffRepository } from '../../domain/repositories/StaffRepository';

export class SyncStaffUseCase {
  private staffRepository: StaffRepository;

  constructor(staffRepository: StaffRepository) {
    this.staffRepository = staffRepository;
  }

  async execute(): Promise<void> {
    return this.staffRepository.syncStaffs();
  }
}
