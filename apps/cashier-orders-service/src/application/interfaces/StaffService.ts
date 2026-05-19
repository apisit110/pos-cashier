export interface StaffInfo {
  username: string;
  fullName: string;
}

export interface StaffService {
  findById(id: number): Promise<StaffInfo | null>;
}
