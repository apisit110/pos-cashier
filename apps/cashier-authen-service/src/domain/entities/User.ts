export enum UserStatus {
  ACTIVE = 'active',
  PENDING_SYNC = 'pending_sync',
  INACTIVE = 'inactive',
}

export class User {
  constructor(
    public readonly id: number,
    public readonly staffId: string,
    public readonly roleId: number,
    public readonly fullName: string,
    public readonly pinHash: string,
    public readonly status: UserStatus,
    public readonly updatedAt: Date,
  ) {}
}
