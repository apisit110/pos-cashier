export class Product {
  constructor(
    public readonly id: string,
    public readonly barcode: string,
    public readonly name: string,
    public readonly price: number
  ) {}
}
