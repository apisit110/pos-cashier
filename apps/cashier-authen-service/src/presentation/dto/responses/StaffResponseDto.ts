import { Staff } from '../../../domain/entities/Staff';

export class StaffResponseDto {
  private constructor(
    readonly id: number,
    readonly username: string,
    readonly fullName: string,
    readonly roleId: number,
    readonly status: string,
    readonly syncStatus: string,
  ) {}

  static fromEntity(staff: Staff): StaffResponseDto {
    return new StaffResponseDto(
      staff.id,
      staff.username,
      staff.fullName,
      staff.roleId,
      staff.status,
      staff.syncStatus,
    );
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      fullName: this.fullName,
      roleId: this.roleId,
      status: this.status,
      syncStatus: this.syncStatus,
    };
  }
}
