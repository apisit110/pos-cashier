export class SuccessResponseDto<T> {
  private constructor(
    readonly res_code: string,
    readonly res_desc: string,
    readonly data: T,
  ) {}

  static of<T>(data: T, res_desc = 'Success'): SuccessResponseDto<T> {
    return new SuccessResponseDto('0000', res_desc, data);
  }

  toJSON() {
    return {
      res_code: this.res_code,
      res_desc: this.res_desc,
      data: this.data,
    };
  }
}
