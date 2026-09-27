import { Member } from '../../../domain/entities/Member';

export class MemberResponseDto {
  private constructor(
    readonly id: string,
    readonly firstName: string,
    readonly lastName: string,
    readonly fullName: string,
    readonly points: number,
  ) {}

  static fromEntity(member: Member): MemberResponseDto {
    return new MemberResponseDto(member.id, member.firstName, member.lastName, member.fullName, member.points);
  }

  toJSON() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      points: this.points,
    };
  }
}
