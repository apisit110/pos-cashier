export type StaffRole = 'manager' | 'cashier';

export interface Staff {
  id: number;
  username: string;
  fullName: string;
  roleId: number;
  status: 'active' | 'inactive';
}

export interface AuthResponse {
  staff: Staff;
  accessToken: string;
  refreshToken: string;
}
