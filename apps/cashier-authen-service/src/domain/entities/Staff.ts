export enum StaffStatus {
  ACTIVE = 'active',
  PENDING_SYNC = 'pending_sync',
  INACTIVE = 'inactive',
}

export class Staff {
  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly roleId: number,
    public readonly fullName: string,
    public readonly pinHash: string,
    public readonly status: StaffStatus,
    public readonly syncId: string | null,
    public readonly updatedAt: Date,
  ) {}
}
