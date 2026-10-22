export const ROLE_ID = { MANAGER: 1, CASHIER: 2 } as const;

export const STAFF_STATUSES = ['active', 'inactive'] as const;
export const STAFF_STATUS = { ACTIVE: 'active', INACTIVE: 'inactive' } as const satisfies Record<string, (typeof STAFF_STATUSES)[number]>;

export const SYNC_STATUSES = ['pending', 'synced', 'error'] as const;
export const SYNC_STATUS = { PENDING: 'pending', SYNCED: 'synced', ERROR: 'error' } as const satisfies Record<string, (typeof SYNC_STATUSES)[number]>;
