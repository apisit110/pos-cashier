import { RolePermission } from '../entities/RolePermission';

export interface IPermissionRepository {
  findByRoleId(roleId: number): Promise<RolePermission[]>;
}
