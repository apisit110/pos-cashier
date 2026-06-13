export interface SyncStaffRequestDTO {
  staffs: {
    userId: string;
    fullName: string;
    pinHash: string;
    roleId: number;
    branchIds: number[];
    status: 'active' | 'inactive';
    originBranchId: number;
  }[];
}

export interface SyncStaffResponseDTO {
  message: string;
  results: {
    userId: string;
    status: 'synced' | 'already_synced' | 'error';
  }[];
}

export interface IStaffSyncGateway {
  syncStaffs(data: SyncStaffRequestDTO): Promise<SyncStaffResponseDTO>;
}
