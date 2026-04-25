export class Staff {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly password: string,
    public readonly role: 'manager' | 'staff',
  ) {}
}
