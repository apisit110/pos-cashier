export class Product {
  constructor(
    public readonly id: string,
    public readonly barcode: string,
    public readonly name: string,
    public readonly price: number,
    public readonly imageUrl?: string | null,
    public readonly unitName?: string | null,
    public readonly brand?: string | null,
  ) {}
}
