export class SyncProductsResponseDto {
  private constructor(
    readonly success: boolean,
    readonly count: number,
  ) {}

  static fromResult(result: { success: boolean; count: number }): SyncProductsResponseDto {
    return new SyncProductsResponseDto(result.success, result.count);
  }

  toJSON() {
    return { success: this.success, count: this.count };
  }
}
