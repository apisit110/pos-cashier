import { Product } from '../../domain/entities/Product'

export class ProductMapper {
  static toDomain (raw: any): Product {
    return new Product(
      String(raw.id),
      raw.uid,
      raw.image_url ?? [],
      raw.name_en ?? '',
      raw.name_th ?? '',
      raw.brand_en ?? '',
      raw.brand_th ?? '',
      raw.base_price ?? 0,
      raw.unit_name ?? '',
      raw.barcode ?? '',
      raw.qrcode ?? '',
      raw.company_name_en ?? '',
      raw.company_name_th ?? '',
      (raw.stores ?? []).map((store: any) => ({
        nameEn: store.name_en ?? '',
        nameTh: store.name_th ?? '',
        brandNameEn: store.brand_name_en ?? '',
        brandNameTh: store.brand_name_th ?? '',
        priceTiers: (store.price_tiers ?? []).map((tier: any) => ({
          minQty: tier.min_qty ?? 0,
          maxQty: tier.max_qty ?? 0,
          unitPrice: tier.unit_price ?? 0,
          tier: tier.tier ?? 1
        }))
      }))
    )
  }

  static toResponse (product: Product) {
    return {
      id: product.id,
      uid: product.uid,
      image_url: product.imageUrls,
      name_en: product.nameEn,
      name_th: product.nameTh,
      brand_en: product.brandEn,
      brand_th: product.brandTh,
      base_price: product.basePrice,
      unit_name: product.unitName,
      barcode: product.barcode,
      qrcode: product.qrcode,
      company_name_en: product.companyNameEn,
      company_name_th: product.companyNameTh,
      stores: product.stores.map(store => ({
        name_en: store.nameEn,
        name_th: store.nameTh,
        brand_name_en: store.brandNameEn,
        brand_name_th: store.brandNameTh,
        price_tiers: store.priceTiers.map(tier => ({
          min_qty: tier.minQty,
          max_qty: tier.maxQty,
          unit_price: tier.unitPrice,
          tier: tier.tier
        }))
      }))
    }
  }

  static toResponseList (products: Product[]) {
    return products.map(product => this.toResponse(product))
  }
}
