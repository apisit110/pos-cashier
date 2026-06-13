import { Role } from '../entities/Role';

export interface IRoleRepository {
  findById(id: number): Promise<Role | null>;
  findAll(): Promise<Role[]>;
}
