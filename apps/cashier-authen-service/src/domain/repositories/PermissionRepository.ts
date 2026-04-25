import { RolePermission } from '../entities/RolePermission';

export abstract class PermissionRepository {
  abstract findByRoleId(roleId: number): Promise<RolePermission[]>;
}
