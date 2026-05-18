import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StaffRepository } from '../../domain/repositories/StaffRepository';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly staffRepository: StaffRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(staffId: string, pin: string) {
    const staff = await this.staffRepository.findByStaffId(staffId);

    if (!staff || staff.pinHash !== pin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: staff.id,
      userId: staff.userId,
      fullName: staff.fullName,
      roleId: staff.roleId,
    };

    return {
      staff: {
        id: staff.id,
        userId: staff.userId,
        fullName: staff.fullName,
        roleId: staff.roleId,
        status: staff.status,
      },
      accessToken: await this.jwtService.signAsync(payload, { expiresIn: '60m' }),
      refreshToken: await this.jwtService.signAsync(payload, { expiresIn: '30d' }),
    };
  }
}
