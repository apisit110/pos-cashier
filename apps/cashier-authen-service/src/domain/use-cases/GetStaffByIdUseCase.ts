import { IStaffRepository } from '../repositories/IStaffRepository';

export class GetStaffByIdUseCase {
  constructor(private readonly staffRepository: IStaffRepository) {}

  async execute(id: number) {
    return this.staffRepository.findById(id);
  }
}
