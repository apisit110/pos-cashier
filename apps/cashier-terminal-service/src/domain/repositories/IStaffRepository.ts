import { CenterStaff } from './ITerminalCenterGateway';

export interface IStaffRepository {
  /**
   * Upserts the staffs pulled from pos-center by username, with their pin hash
   */
  upsertFromCenter(staffs: CenterStaff[]): Promise<void>;
}
