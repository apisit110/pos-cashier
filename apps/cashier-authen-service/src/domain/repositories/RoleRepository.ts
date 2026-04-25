import { Role } from '../entities/Role';

export abstract class RoleRepository {
  abstract findById(id: number): Promise<Role | null>;
  abstract findAll(): Promise<Role[]>;
}
