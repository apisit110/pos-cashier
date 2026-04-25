import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../domain/repositories/UserRepository';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(userId: string, pin: string) {
    const user = await this.userRepository.findByUserId(userId);

    // Note: In a real production app, pin/password comparison would use a hashing library like bcrypt/argon2
    if (!user || user.pinHash !== pin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { 
      sub: user.id, 
      userId: user.userId, 
      fullName: user.fullName, 
      roleId: user.roleId 
    };

    return {
      user: {
        id: user.id,
        userId: user.userId,
        fullName: user.fullName,
        roleId: user.roleId,
        status: user.status,
      },
      accessToken: await this.jwtService.signAsync(payload, { expiresIn: '60m' }),
      refreshToken: await this.jwtService.signAsync(payload, { expiresIn: '30d' }),
    };
  }
}
