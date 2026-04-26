export interface SyncUserRequestDTO {
  users: {
    posTempId: string;
    userId: string;
    fullName: string;
    pinHash: string;
    roleId: number;
    branchIds: number[];
    status: 'active' | 'inactive';
    originBranchId: number;
  }[];
}

export interface SyncUserResponseDTO {
  message: string;
  results: {
    posTempId: string;
    globalUserId: string;
    userId: string;
    status: 'synced' | 'already_synced' | 'error';
  }[];
}

export interface UserSyncGateway {
  syncUsers(data: SyncUserRequestDTO): Promise<SyncUserResponseDTO>;
}
