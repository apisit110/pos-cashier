import { IStaffRepository } from '../../domain/repositories/IStaffRepository';
import { IStaffPinRepository } from '../../domain/repositories/IStaffPinRepository';
import { IPermissionRepository } from '../../domain/repositories/IPermissionRepository';
import { ITerminalRepository } from '../../domain/repositories/ITerminalRepository';
import { generateTokenPair } from '../../infrastructure/auth/TokenService';
import { StaffStatus } from '../../domain/entities/Staff';
import bcrypt from 'bcryptjs';

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
    private readonly terminalRepository: ITerminalRepository,
    private readonly appMode: 'online' | 'offline' = 'online',
  ) {}

  async execute(username: string, pin: string, tid: string) {
    // tid comes from the terminal setup page, mid and sid are always read from the activated terminal record
    const terminal = await this.terminalRepository.findByTid(tid);

    if (!terminal) {
      throw new UnauthorizedError('Terminal is not activated');
    }

    const staff = await this.staffRepository.findByUsername(username);

    if (!staff) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (staff.status === StaffStatus.INACTIVE) {
      throw new UnauthorizedError('Staff account is inactive');
    }

    const staffPin = await this.staffPinRepository.findByUserId(staff.id);

    if (!staffPin || !(await this.verifyPin(pin, staffPin.pinHash))) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const permissions = await this.permissionRepository.findByRoleId(staff.roleId);
    const scope = permissions
      .filter((permission) => permission.isGranted)
      .filter((permission) => !(this.appMode === 'offline' && permission.permissionKey === 'products:sync'))
      .map((permission) => permission.permissionKey)
      .join(' ');

    const payload = {
      username: staff.username,
      fullName: staff.fullName,
      roleId: staff.roleId,
      scope,
      tid: terminal.tid,
      mid: terminal.mid,
      sid: terminal.sid,
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

  // staffs pulled from pos-center have a bcrypt pin hash, staffs created on this POS keep the plain pin
  private async verifyPin(pin: string, pinHash: string): Promise<boolean> {
    if (pinHash.startsWith('$2')) {
      return bcrypt.compare(pin, pinHash);
    }
    return pinHash === pin;
  }
}
