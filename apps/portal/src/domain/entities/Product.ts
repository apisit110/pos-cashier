export interface PriceTier {
  minQty: number
  maxQty: number
  unitPrice: number
  tier: number
}

export interface StoreProduct {
  nameEn: string
  nameTh: string
  brandNameEn: string
  brandNameTh: string
  priceTiers: PriceTier[]
}

export interface ProductProps {
  id: string
  uid: string
  imageUrls: string[]
  nameEn: string
  nameTh: string
  brandEn: string
  brandTh: string
  basePrice: number
  unitName: string
  barcode: string
  qrcode: string
  companyNameEn: string
  companyNameTh: string
  stores: StoreProduct[]
}

export class Product {
  constructor (
    public readonly id: string,
    public readonly uid: string,
    public readonly imageUrls: string[],
    public readonly nameEn: string,
    public readonly nameTh: string,
    public readonly brandEn: string,
    public readonly brandTh: string,
    public readonly basePrice: number,
    public readonly unitName: string,
    public readonly barcode: string,
    public readonly qrcode: string,
    public readonly companyNameEn: string,
    public readonly companyNameTh: string,
    public readonly stores: StoreProduct[]
  ) {}
}
