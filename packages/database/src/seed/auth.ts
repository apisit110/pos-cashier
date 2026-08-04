import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { schema } from '@lightning-pos/model';

export function seedRoles(db: any) {
  const roles = [
    { id: 1, roleName: 'manager' },
    { id: 2, roleName: 'cashier' },
  ];

  for (const role of roles) {
    db.insert(schema.roles)
      .values(role)
      .onConflictDoUpdate({
        target: schema.roles.id,
        set: { roleName: role.roleName },
      }).run();
  }
}

export function seedPermissions(db: any) {
  const permissions = [
    // Manager permissions
    ...[
      'dashboard:view',
      'sell:create',
      'transaction:view',
      'products:view',
      'product:create',
      'products:sync',
      'staff:view',
      'staff:create',
    ].map(p => ({
      roleId: 1,
      permissionKey: p,
      isGranted: true,
    })),
    // Cashier permissions
    ...['sell:create'].map(p => ({
      roleId: 2,
      permissionKey: p,
      isGranted: true,
    })),
  ];

  for (const perm of permissions) {
    // For many-to-many or reference tables, we can use onConflictDoNothing or a custom check
    db.insert(schema.rolePermissions)
      .values(perm)
      .onConflictDoNothing()
      .run();
  }
}

export function seedStaffs(db: any) {
  const managerUsername = process.env.MANAGER_USERNAME;
  const managerName = process.env.MANAGER_NAME;
  const managerPin = process.env.MANAGER_PIN;

  if (!managerUsername || !managerName || !managerPin) {
    throw new Error('MANAGER_USERNAME, MANAGER_NAME, and MANAGER_PIN must be defined in environment variables');
  }

  const [manager] = db.insert(schema.staffs)
    .values({
      username: managerUsername,
      roleId: 1,
      fullName: managerName,
      status: 'active',
      syncStatus: 'pending',
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: schema.staffs.username,
      set: {
        fullName: managerName,
        updatedAt: new Date(),
      },
    })
    .returning()
    .all();

  db.insert(schema.staffPins)
    .values({
      userId: manager.id,
      pinHash: managerPin,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: schema.staffPins.userId,
      set: {
        pinHash: managerPin,
        updatedAt: new Date(),
      },
    }).run();
}

/**
 * Seeds roles, permissions, and the initial manager staff account, wrapped in a transaction for safety
 */
export function seedAuth(db: BetterSQLite3Database<typeof schema>) {
  try {
    db.transaction((tx) => {
      console.log('🌱 Seeding auth database...');
      seedRoles(tx);
      seedPermissions(tx);
      seedStaffs(tx);
      console.log('✅ Seeding completed successfully.');
    });
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    // In a provider context, we might not want to throw and crash the whole app,
    // but seeding failure is usually a sign of a bigger problem.
  }
}
