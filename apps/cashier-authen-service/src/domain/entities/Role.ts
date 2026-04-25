export type RoleName = 'manager' | 'cashier';

export class Role {
  constructor(
    public readonly id: number,
    public readonly roleName: RoleName,
  ) {}
}
