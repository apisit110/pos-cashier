interface CalculateOrderResult {
  total: number;
  appliedPromotions: string[];
}

export class CalculateOrderResponseDto {
  private constructor(
    readonly total: number,
    readonly appliedPromotions: string[],
  ) {}

  static fromResult(result: CalculateOrderResult): CalculateOrderResponseDto {
    return new CalculateOrderResponseDto(result.total, result.appliedPromotions);
  }

  toJSON() {
    return { total: this.total, appliedPromotions: this.appliedPromotions };
  }
}
