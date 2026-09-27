import { Staff } from '../../../domain/entities/Staff';
import { StaffResponseDto } from './StaffResponseDto';

export class GetStaffsResponseDto {
  private constructor(
    readonly staffs: StaffResponseDto[],
    readonly total: number,
  ) {}

  static fromResult(result: { staffs: Staff[]; total: number }): GetStaffsResponseDto {
    return new GetStaffsResponseDto(
      result.staffs.map((staff) => StaffResponseDto.fromEntity(staff)),
      result.total,
    );
  }

  toJSON() {
    return { staffs: this.staffs, total: this.total };
  }
}
