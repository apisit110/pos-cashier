import { Injectable } from '@nestjs/common';
import { StaffRepository } from '../../domain/repositories/StaffRepository';

@Injectable()
export class CreateStaffUseCase {
  constructor(private readonly staffRepository: StaffRepository) {}

  async execute(staffData: { fullName: string; roleId: number; pin: string }) {
    const mid = process.env.MID!;
    const count = await this.staffRepository.countAll();
    const running = String(count + 1).padStart(4, '0');
    const username = `${mid}${running}`;

    return this.staffRepository.create({
      username,
      fullName: staffData.fullName,
      roleId: staffData.roleId,
      pinHash: staffData.pin,
      status: 'pending_sync',
    });
  }
}
