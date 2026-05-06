import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

export async function seedRoles(db: BetterSQLite3Database<typeof schema>) {
  const roles = [
    { id: 1, roleName: 'manager' },
    { id: 2, roleName: 'cashier' },
  ];

  for (const role of roles) {
    await db.insert(schema.roles)
      .values(role)
      .onConflictDoUpdate({ 
        target: schema.roles.id, 
        set: { roleName: role.roleName } 
      });
  }
}

export async function seedPermissions(db: BetterSQLite3Database<typeof schema>) {
  const permissions = [
    // Manager permissions
    ...['manage_users', 'manage_products', 'view_transactions', 'void_orders'].map(p => ({
      roleId: 1,
      permissionKey: p,
      isGranted: true,
    })),
    // Cashier permissions
    ...['create_orders', 'view_products'].map(p => ({
      roleId: 2,
      permissionKey: p,
      isGranted: true,
    })),
  ];

  for (const perm of permissions) {
    // For many-to-many or reference tables, we can use onConflictDoNothing or a custom check
    await db.insert(schema.rolePermissions)
      .values(perm)
      .onConflictDoNothing();
  }
}

export async function seedUsers(db: BetterSQLite3Database<typeof schema>) {
  const managerUserId = process.env.MANAGER_USER_ID;
  const managerName = process.env.MANAGER_NAME;
  const managerPin = process.env.MANAGER_PIN;

  if (!managerUserId || !managerName || !managerPin) {
    throw new Error('MANAGER_USER_ID, MANAGER_NAME, and MANAGER_PIN must be defined in environment variables');
  }

  await db.insert(schema.users)
    .values({
      userId: managerUserId,
      roleId: 1,
      fullName: managerName,
      pinHash: managerPin,
      status: 'active',
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: schema.users.userId,
      set: {
        fullName: managerName,
        pinHash: managerPin,
        updatedAt: new Date(),
      },
    });
}

/**
 * Main seed function wrapped in a transaction for safety
 */
export async function seedDatabase(db: BetterSQLite3Database<typeof schema>) {
  try {
    await db.transaction(async (tx) => {
      console.log('🌱 Seeding database...');
      await seedRoles(tx);
      await seedPermissions(tx);
      await seedUsers(tx);
      console.log('✅ Seeding completed successfully.');
    });
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    // In a provider context, we might not want to throw and crash the whole app,
    // but seeding failure is usually a sign of a bigger problem.
  }
}
