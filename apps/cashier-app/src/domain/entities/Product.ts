export class Product {
  public readonly id: string;
  public readonly barcode: string;
  public readonly name: string;
  public readonly price: number;
  public readonly image?: string;

  constructor(
    id: string,
    barcode: string,
    name: string,
    price: number,
    image?: string
  ) {
    this.id = id;
    this.barcode = barcode;
    this.name = name;
    this.price = price;
    this.image = image;
  }
}
