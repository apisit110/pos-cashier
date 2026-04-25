import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StaffRepository } from '../../domain/repositories/StaffRepository';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly staffRepository: StaffRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(email: string, password: string) {
    const staff = await this.staffRepository.findByEmail(email);

    if (!staff || staff.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { 
      sub: staff.id, 
      email: staff.email, 
      name: staff.name, 
      role: staff.role 
    };

    return {
      user: {
        id: staff.id,
        email: staff.email,
        name: staff.name,
        role: staff.role,
      },

      accessToken: await this.jwtService.signAsync(payload, { expiresIn: '60m' }),
      refreshToken: await this.jwtService.signAsync(payload, { expiresIn: '30d' }),
    };
  }
}
