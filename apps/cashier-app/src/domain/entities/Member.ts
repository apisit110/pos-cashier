export class Member {
  public readonly id: string;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly points: number;

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    points: number
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.points = points;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
