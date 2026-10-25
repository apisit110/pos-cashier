export interface CenterTerminal {
  tid: string;
  mid: string;
  sid: string;
}

export interface CenterStaff {
  uid: string;
  username: string;
  fullName: string;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  roles: string[];
  pinHash: string;
}

export interface CenterCashierProfile {
  terminal: CenterTerminal;
  staffs: CenterStaff[];
}

export interface ITerminalCenterGateway {
  /**
   * Returns the cashier profile (terminal and staffs of the merchant) of `tid` from pos-center,
   * null if the terminal is not found or not of the merchant
   */
  pullCashierProfile(tid: string): Promise<CenterCashierProfile | null>;
}
