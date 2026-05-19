import { Injectable } from '@nestjs/common';
import { StaffRepository } from '../../domain/repositories/StaffRepository';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateStaffUseCase {
  constructor(private readonly staffRepository: StaffRepository) {}

  async execute(staffData: { username?: string; fullName: string; roleId: number; pin: string }) {
    const username = staffData.username || `TEMP_${uuidv4().substring(0, 8)}`;

    return this.staffRepository.create({
      username,
      fullName: staffData.fullName,
      roleId: staffData.roleId,
      pinHash: staffData.pin,
      status: 'pending_sync',
    });
  }
}
