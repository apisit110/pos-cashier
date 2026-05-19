import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StaffRepository } from '../../domain/repositories/StaffRepository';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly staffRepository: StaffRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(username: string, pin: string) {
    const staff = await this.staffRepository.findByUsername(username);

    if (!staff || staff.pinHash !== pin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: staff.id,
      username: staff.username,
      fullName: staff.fullName,
      roleId: staff.roleId,
    };

    return {
      staff: {
        id: staff.id,
        username: staff.username,
        fullName: staff.fullName,
        roleId: staff.roleId,
        status: staff.status,
      },
      accessToken: await this.jwtService.signAsync(payload, { expiresIn: '60m' }),
      refreshToken: await this.jwtService.signAsync(payload, { expiresIn: '30d' }),
    };
  }
}
