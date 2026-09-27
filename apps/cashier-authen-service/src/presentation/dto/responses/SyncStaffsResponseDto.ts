interface SyncStaffResult {
  userId: string;
  status: string;
  [key: string]: unknown;
}

export class SyncStaffsResponseDto {
  private constructor(
    readonly success: boolean,
    readonly results: SyncStaffResult[],
  ) {}

  static fromResult(result: { success: boolean; results: SyncStaffResult[] }): SyncStaffsResponseDto {
    return new SyncStaffsResponseDto(result.success, result.results);
  }

  toJSON() {
    return { success: this.success, results: this.results };
  }
}
