import { StaffPin } from '../entities/StaffPin';

export interface IStaffPinRepository {
  findByUserId(userId: number): Promise<StaffPin | null>;
  create(data: { userId: number; pinHash: string }): Promise<StaffPin>;
}
