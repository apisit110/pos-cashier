export class Product {
  public readonly id: string;
  public readonly barcode: string;
  public readonly name: string;
  public readonly price: number;
  public readonly image?: string;
  public readonly brand?: string | null;

  constructor(
    id: string,
    barcode: string,
    name: string,
    price: number,
    image?: string,
    brand?: string | null
  ) {
    this.id = id;
    this.barcode = barcode;
    this.name = name;
    this.price = price;
    this.image = image;
    this.brand = brand;
  }
}
