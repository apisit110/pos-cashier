import jwt from 'jsonwebtoken';
import { IStaffRepository } from '../repositories/IStaffRepository';

const JWT_SECRET = process.env.JWT_SECRET as string;

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class LoginUseCase {
  constructor(private readonly staffRepository: IStaffRepository) {}

  async execute(username: string, pin: string) {
    const staff = await this.staffRepository.findByUsername(username);

    if (!staff || staff.pinHash !== pin) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const payload = {
      sub: staff.id,
      username: staff.username,
      fullName: staff.fullName,
      roleId: staff.roleId,
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '60m' });
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });

    return {
      staff: {
        id: staff.id,
        username: staff.username,
        fullName: staff.fullName,
        roleId: staff.roleId,
        status: staff.status,
      },
      accessToken,
      refreshToken,
    };
  }
}
