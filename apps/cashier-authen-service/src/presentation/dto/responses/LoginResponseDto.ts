interface LoginResult {
  staff: {
    id: number;
    username: string;
    fullName: string;
    roleId: number;
    status: string;
  };
  accessToken: string;
  refreshToken: string;
}

export class LoginResponseDto {
  private constructor(
    readonly staff: LoginResult['staff'],
    readonly accessToken: string,
    readonly refreshToken: string,
  ) {}

  static fromResult(result: LoginResult): LoginResponseDto {
    return new LoginResponseDto(result.staff, result.accessToken, result.refreshToken);
  }

  toJSON() {
    return {
      staff: this.staff,
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
    };
  }
}
