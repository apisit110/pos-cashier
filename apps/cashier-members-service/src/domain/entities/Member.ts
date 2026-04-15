export class Member {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly points: number
  ) {}

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
