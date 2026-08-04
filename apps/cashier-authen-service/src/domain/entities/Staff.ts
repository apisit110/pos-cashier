export enum StaffStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum StaffSyncStatus {
  PENDING = 'pending',
  SYNCED = 'synced',
  ERROR = 'error',
}

export class Staff {
  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly roleId: number,
    public readonly fullName: string,
    public readonly status: StaffStatus,
    public readonly syncStatus: StaffSyncStatus,
    public readonly syncId: string | null,
    public readonly updatedAt: Date,
  ) {}
}
