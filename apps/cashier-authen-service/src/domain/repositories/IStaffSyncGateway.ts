export interface CashierProfileStaffDTO {
  uid: string;
  username: string;
  full_name: string;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  roles: string[];
  pin_hash: string;
  updated_at: string;
}

export interface CashierProfileDTO {
  message: string;
  merchant: { uid: string; partner_id: string; name_en: string; name_th: string };
  store: { uid: string; sid: string; name_en: string; name_th: string };
  terminal: { uid: string; tid: string; name_en: string; name_th: string };
  staffs: CashierProfileStaffDTO[];
}

export interface IStaffSyncGateway {
  pullCashierProfile(): Promise<CashierProfileDTO>;
}
