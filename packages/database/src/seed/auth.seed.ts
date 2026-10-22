import { schema, ROLE_ID, STAFF_STATUS, SYNC_STATUS } from '@lightning-pos/model';

const OFFLINE_STAFFS = [
  { username: '00010001', fullName: 'ผู้จัดการ ทดสอบ', roleId: ROLE_ID.MANAGER, pin: '123456' },
  { username: '00010002', fullName: 'แคชเชียร์ ทดสอบ', roleId: ROLE_ID.CASHIER, pin: '123456' },
];

const MANAGER_PERMISSIONS = [
  'dashboard:view',
  'sell:create',
  'transaction:view',
  'products:view',
  'product:create',
  'product:edit',
  'products:sync',
  'staff:view',
  'staff:create',
];

const CASHIER_PERMISSIONS = ['sell:create'];

/**
 * Seeds roles, role permissions, and (in offline mode only) the default manager and cashier accounts with their PINs
 */
export function seedAuth(db: any) {
  console.log('🌱 Seeding auth...');

  const roles = [
    { id: ROLE_ID.MANAGER, roleName: 'manager' },
    { id: ROLE_ID.CASHIER, roleName: 'cashier' },
  ];

  for (const role of roles) {
    db.insert(schema.roles)
      .values(role)
      .onConflictDoUpdate({
        target: schema.roles.id,
        set: { roleName: role.roleName },
      })
      .run();
  }

  const permissions = [
    ...MANAGER_PERMISSIONS.map((permissionKey) => ({ roleId: ROLE_ID.MANAGER, permissionKey, isGranted: true })),
    ...CASHIER_PERMISSIONS.map((permissionKey) => ({ roleId: ROLE_ID.CASHIER, permissionKey, isGranted: true })),
  ];

  for (const perm of permissions) {
    db.insert(schema.rolePermissions).values(perm).onConflictDoNothing().run();
  }

  if (process.env.APP_MODE !== 'offline') {
    console.log('ℹ️ APP_MODE is not offline, skipping staff seed');
    return;
  }

  for (const { pin, ...staff } of OFFLINE_STAFFS) {
    const [row] = db.insert(schema.staffs)
      .values({
        ...staff,
        status: STAFF_STATUS.ACTIVE,
        syncStatus: SYNC_STATUS.PENDING,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: schema.staffs.username,
        set: {
          fullName: staff.fullName,
          roleId: staff.roleId,
          updatedAt: new Date(),
        },
      })
      .returning()
      .all();

    db.insert(schema.staffPins)
      .values({
        userId: row.id,
        pinHash: pin,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: schema.staffPins.userId,
        set: { pinHash: pin, updatedAt: new Date() },
      })
      .run();
  }
}
