import { Product, StoreProduct, PriceTier } from '../../domain/entities/Product'

interface RawPriceTier {
  min_qty: number
  max_qty: number
  unit_price: number
  tier: number
}

interface RawStore {
  name_en: string | null
  name_th: string | null
  brand_name_en: string | null
  brand_name_th: string | null
  price_tiers: RawPriceTier[]
}

interface RawProduct {
  id: number
  uid: string
  image_url: string[]
  name_en: string | null
  name_th: string | null
  brand_en: string | null
  brand_th: string | null
  company_name_en: string | null
  company_name_th: string | null
  base_price: number
  unit_name: string
  barcode: string
  qrcode: string | null
  stores: RawStore[]
}

export class ProductMapper {
  static toDomain (raw: RawProduct): Product {
    const stores: StoreProduct[] = (raw.stores || []).map((s: RawStore) => ({
      nameEn: s.name_en || '',
      nameTh: s.name_th || '',
      brandNameEn: s.brand_name_en || '',
      brandNameTh: s.brand_name_th || '',
      priceTiers: (s.price_tiers || []).map((t: RawPriceTier) => ({
        minQty: t.min_qty,
        maxQty: t.max_qty,
        unitPrice: t.unit_price,
        tier: t.tier
      }))
    }))

    return new Product(
      String(raw.uid), // Using uid as id since it's unique
      raw.uid,
      (raw.image_url || []).map((url: string) => url.startsWith('/') ? url : `/${url}`),
      raw.name_en || '',
      raw.name_th || '',
      raw.brand_en || '',
      raw.brand_th || '',
      raw.base_price || 0,
      raw.unit_name || '',
      raw.barcode || '',
      raw.qrcode || '',
      raw.company_name_en || '',
      raw.company_name_th || '',
      stores
    )
  }
}
