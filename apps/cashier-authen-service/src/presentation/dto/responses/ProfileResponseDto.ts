interface TokenPayload {
  username: string;
  fullName: string;
  roleId: number;
  scope: string;
}

export class ProfileResponseDto {
  private constructor(
    readonly username: string,
    readonly fullName: string,
    readonly roleId: number,
    readonly scope: string,
  ) {}

  static fromTokenPayload(payload: TokenPayload): ProfileResponseDto {
    return new ProfileResponseDto(payload.username, payload.fullName, payload.roleId, payload.scope);
  }

  toJSON() {
    return {
      username: this.username,
      fullName: this.fullName,
      roleId: this.roleId,
      scope: this.scope,
    };
  }
}
