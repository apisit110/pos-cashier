import type { Staff, StaffRepository } from '../../domain/repositories/StaffRepository';

export class GetStaffsUseCase {
  private staffRepository: StaffRepository;

  constructor(staffRepository: StaffRepository) {
    this.staffRepository = staffRepository;
  }

  async execute(page: number, limit: number): Promise<{ staffs: Staff[]; total: number }> {
    return this.staffRepository.getStaffs(page, limit);
  }
}
