export type StaffRole = 'manager' | 'cashier';

export interface Staff {
  id: number;
  userId: string;
  fullName: string;
  roleId: number;
  status: 'active' | 'pending_sync' | 'inactive';
}

export interface AuthResponse {
  staff: Staff;
  accessToken: string;
  refreshToken: string;
}
