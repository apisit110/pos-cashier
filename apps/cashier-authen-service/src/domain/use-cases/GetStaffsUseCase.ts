import { IStaffRepository } from '../repositories/IStaffRepository';

export class GetStaffsUseCase {
  constructor(private readonly staffRepository: IStaffRepository) {}

  async execute(page: number, limit: number) {
    return this.staffRepository.findAll(page, limit);
  }
}
