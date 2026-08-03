import { IStaffRepository } from '../repositories/IStaffRepository';
import { IStaffPinRepository } from '../repositories/IStaffPinRepository';
import { IPermissionRepository } from '../repositories/IPermissionRepository';
import { generateTokenPair } from '../../infrastructure/auth/TokenService';

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class LoginUseCase {
  constructor(
    private readonly staffRepository: IStaffRepository,
    private readonly staffPinRepository: IStaffPinRepository,
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(username: string, pin: string) {
    const staff = await this.staffRepository.findByUsername(username);

    if (!staff) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const staffPin = await this.staffPinRepository.findByUserId(staff.id);

    if (!staffPin || staffPin.pinHash !== pin) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const permissions = await this.permissionRepository.findByRoleId(staff.roleId);
    const scope = permissions
      .filter((permission) => permission.isGranted)
      .map((permission) => permission.permissionKey)
      .join(' ');

    const payload = {
      username: staff.username,
      fullName: staff.fullName,
      roleId: staff.roleId,
      scope,
    };

    const { accessToken, refreshToken } = generateTokenPair(String(staff.id), payload);

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
