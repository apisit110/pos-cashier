export interface IStaffRepository {
  /** upserts the staff by username, and its pin when `pinHash` is set */
  upsertWithPin(staff: {
    username: string;
    fullName: string;
    roleId: number;
    status: 'active' | 'inactive';
    syncId: string;
    pinHash: string | null;
  }): Promise<void>;
}
