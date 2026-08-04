import { IStaffRepository } from '../repositories/IStaffRepository';
import { IStaffPinRepository } from '../repositories/IStaffPinRepository';

export class CreateStaffUseCase {
  constructor(
    private readonly staffRepository: IStaffRepository,
    private readonly staffPinRepository: IStaffPinRepository,
  ) {}

  async execute(staffData: { fullName: string; roleId: number; pin: string }) {
    const mid = process.env.MID!;
    const count = await this.staffRepository.countAll();
    const running = String(count + 1).padStart(4, '0');
    const username = `${mid}${running}`;

    const staff = await this.staffRepository.create({
      username,
      fullName: staffData.fullName,
      roleId: staffData.roleId,
      status: 'active',
      syncStatus: 'pending',
    });

    await this.staffPinRepository.create({
      userId: staff.id,
      pinHash: staffData.pin,
    });

    return staff;
  }
}
