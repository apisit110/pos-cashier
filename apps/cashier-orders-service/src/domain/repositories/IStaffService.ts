export interface StaffInfo {
  username: string;
  fullName: string;
}

export interface IStaffService {
  findById(id: number): Promise<StaffInfo | null>;
}
