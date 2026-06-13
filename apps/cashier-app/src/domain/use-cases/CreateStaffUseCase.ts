import type { Staff, StaffRepository } from '../../domain/repositories/StaffRepository';

export class CreateStaffUseCase {
  private staffRepository: StaffRepository;

  constructor(staffRepository: StaffRepository) {
    this.staffRepository = staffRepository;
  }

  async execute(staffData: { fullName: string; roleId: number; userId?: string; pin: string }): Promise<Staff> {
    return this.staffRepository.createStaff(staffData);
  }
}
