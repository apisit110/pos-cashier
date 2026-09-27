export class ErrorResponseDto {
  readonly name = 'Service Error' as const;

  private constructor(
    readonly res_code: string,
    readonly res_desc: string,
    readonly additional: string | null,
  ) {}

  static of(res_code: string, res_desc: string, additional: string | null = null): ErrorResponseDto {
    return new ErrorResponseDto(res_code, res_desc, additional);
  }

  toJSON() {
    return {
      name: this.name,
      res_code: this.res_code,
      res_desc: this.res_desc,
      additional: this.additional,
    };
  }
}
