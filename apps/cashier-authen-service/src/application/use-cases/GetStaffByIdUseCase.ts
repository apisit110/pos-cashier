import { Injectable } from '@nestjs/common';
import { StaffRepository } from '../../domain/repositories/StaffRepository';

@Injectable()
export class GetStaffByIdUseCase {
  constructor(private readonly staffRepository: StaffRepository) {}

  async execute(id: number) {
    return this.staffRepository.findById(id);
  }
}
