export class StaffPin {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly pinHash: string,
    public readonly failedAttempts: number,
    public readonly lockedUntil: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
