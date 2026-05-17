export class Terminal {
  constructor(
    public readonly tid: string,
    public readonly mid: string,
    public readonly sid: string,
    public readonly isAvailable: boolean,
  ) {}
}
