import { Injectable } from '@nestjs/common';
import { StaffRepository } from '../../domain/repositories/StaffRepository';

@Injectable()
export class GetStaffsUseCase {
  constructor(private readonly staffRepository: StaffRepository) {}

  async execute(page: number, limit: number) {
    return this.staffRepository.findAll(page, limit);
  }
}
