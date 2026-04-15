'use client'

import React from 'react'
import styled from 'styled-components'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '../../../../presentation/components/layout/DashboardLayout'
import { tokens } from '../../../../presentation/styles/tokens'
import { 
  Package, 
  ArrowLeft, 
  Edit2, 
  Trash2, 
  Tag, 
  Calendar, 
  Database, 
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { GetProductById } from '../../../../application/use-cases/GetProductById'
import { ApiProductRepository } from '../../../../infrastructure/repositories/ApiProductRepository'
import { Product } from '../../../../domain/entities/Product'
import { Barcode } from '../../../../presentation/components/base/Barcode'

const productRepository = new ApiProductRepository()
const getProductByIdUseCase = new GetProductById(productRepository)

const GalleryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 400px;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    width: 100%;
  }
`

const MainImageWrapper = styled.div`
  aspect-ratio: 1;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid ${tokens.card.border};
  background: ${tokens.card.background};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`

const NavButton = styled.button<{ $position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.$position === 'left' ? 'left: 12px;' : 'right: 12px;'}
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 2;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-50%) scale(1.1);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`

const ThumbnailList = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 4px;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${tokens.card.border};
    border-radius: 10px;
  }
`

const Thumbnail = styled.div<{ $active?: boolean }>`
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid ${props => props.$active ? tokens.colors.error : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${tokens.card.background};

  &:hover {
    border-color: ${props => props.$active ? tokens.colors.error : tokens.card.border};
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const StoreCard = styled.div`
  background: ${tokens.colors.glass.hover};
  border: 1px solid ${tokens.card.border};
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const TierBadge = styled.span`
  font-size: 0.65rem;
  font-weight: 700;
  color: ${tokens.colors.primary};
  background: ${tokens.colors.primary}15;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
`

const TierGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`

const PriceValue = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${tokens.colors.primary};
`

const Label = styled.div`
  font-size: 0.75rem;
  color: ${tokens.colors.text.muted};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.gap.md};
  margin-bottom: ${tokens.spacing.section};
`

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${tokens.card.background};
  border: 1px solid ${tokens.card.border};
  color: ${tokens.colors.text.primary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${tokens.card.border};
    transform: translateX(-4px);
  }
`

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${tokens.colors.text.primary};
  font-family: ${tokens.fonts.heading};
`

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const Card = styled.div`
  background: ${tokens.card.background};
  border: 1px solid ${tokens.card.border};
  border-radius: ${tokens.borderRadius.container};
  padding: ${tokens.card.padding};
  height: 100%;
`

const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const InfoValue = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${tokens.colors.text.primary};
`

const InfoLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${tokens.colors.text.muted};
  text-transform: uppercase;
  margin-bottom: 12px;
`

const ActionButton = styled.button<{ $variant?: 'primary' | 'danger' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  
  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: ${tokens.colors.primary};
        color: white;
        border: none;
        &:hover { opacity: 0.9; transform: translateY(-2px); }
      `
    }
    if (props.$variant === 'danger') {
      return `
        background: #ef444415;
        color: #ef4444;
        border: 1px solid #ef444430;
        &:hover { background: #ef444425; transform: translateY(-2px); }
      `
    }
    return `
      background: ${tokens.card.background};
      color: ${tokens.colors.text.primary};
      border: 1px solid ${tokens.card.border};
      &:hover { background: ${tokens.card.border}; transform: translateY(-2px); }
    `
  }}
`

export default function ProductDetailPage () {
  const { id } = useParams()
  const router = useRouter()
  const [product, setProduct] = React.useState<Product | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0)

  React.useEffect(() => {
    const fetchProduct = async () => {
      if (typeof id !== 'string') return
      try {
        const data = await getProductByIdUseCase.execute(id)
        setProduct(data)
      } catch (error) {
        console.error('Failed to fetch product:', error)
      } finally {
        setIsLoading(false)
      }
    }
    void fetchProduct()
  }, [id])

  if (isLoading) return <DashboardLayout>Loading...</DashboardLayout>
  if (product == null) return <DashboardLayout>Product not found</DashboardLayout>

  return (
    <DashboardLayout>
      <Header>
        <BackButton onClick={() => router.back()}>
          <ArrowLeft size={20} />
        </BackButton>
        <Title>Product Details</Title>
      </Header>

      <ContentGrid>
        <Card>
          <div style={{ display: 'flex', gap: '40px', marginBottom: '40px', alignItems: 'flex-start' }}>
            <GalleryContainer>
              <MainImageWrapper>
                {product.imageUrls.length > 0 ? (
                  <>
                    <img src={product.imageUrls[selectedImageIndex]} alt={product.nameEn} />
                    {product.imageUrls.length > 1 && (
                      <>
                        <NavButton 
                          $position="left" 
                          onClick={() => setSelectedImageIndex(prev => Math.max(0, prev - 1))}
                          disabled={selectedImageIndex === 0}
                        >
                          <ChevronLeft size={24} />
                        </NavButton>
                        <NavButton 
                          $position="right" 
                          onClick={() => setSelectedImageIndex(prev => Math.min(product.imageUrls.length - 1, prev + 1))}
                          disabled={selectedImageIndex === product.imageUrls.length - 1}
                        >
                          <ChevronRight size={24} />
                        </NavButton>
                      </>
                    )}
                  </>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: tokens.colors.text.muted }}>
                    <Package size={80} />
                  </div>
                )}
              </MainImageWrapper>

              {product.imageUrls.length > 0 && (
                <ThumbnailList>
                  {product.imageUrls.map((url, i) => (
                    <Thumbnail 
                      key={i} 
                      $active={selectedImageIndex === i}
                      onClick={() => setSelectedImageIndex(i)}
                    >
                      <img src={url} alt={`${product.nameEn} thumbnail ${i + 1}`} />
                    </Thumbnail>
                  ))}
                </ThumbnailList>
              )}
            </GalleryContainer>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <Title style={{ fontSize: '2rem', marginBottom: '4px' }}>{product.nameEn}</Title>
                  <Subtitle style={{ fontSize: '1.25rem', marginBottom: '16px' }}>{product.nameTh}</Subtitle>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Label>Brand</Label>
                  <InfoValue>{product.brandEn} / {product.brandTh}</InfoValue>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginTop: '16px' }}>
                <InfoGroup>
                  <Label>Base Price</Label>
                  <PriceValue>฿{product.basePrice.toLocaleString()}</PriceValue>
                </InfoGroup>
                <InfoGroup>
                  <Label>Unit</Label>
                  <InfoValue>{product.unitName}</InfoValue>
                </InfoGroup>
                <InfoGroup>
                  <Label>SKU / ID</Label>
                  <InfoValue>{product.id}</InfoValue>
                </InfoGroup>
              </div>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${tokens.card.border}`, paddingTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Database size={20} color={tokens.colors.primary} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Store Availability & Pricing</h3>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {product.stores.map((store, i) => (
                <StoreCard key={i}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{store.nameEn}</div>
                    <div style={{ fontSize: '0.875rem', color: tokens.colors.text.muted }}>{store.nameTh}</div>
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                    {store.brandNameEn} ({store.brandNameTh})
                  </div>
                  <div style={{ borderTop: `1px solid ${tokens.card.border}`, paddingTop: '8px' }}>
                    <div style={{ fontSize: '0.75rem', color: tokens.colors.text.muted, marginBottom: '8px' }}>Price Tiers</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {store.priceTiers.map((tier, j) => (
                        <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <TierBadge>Tier {tier.tier}</TierBadge>
                            <span style={{ fontSize: '0.875rem' }}>{tier.minQty}-{tier.maxQty} {product.unitName}</span>
                          </div>
                          <div style={{ fontWeight: 700 }}>฿{tier.unitPrice.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </StoreCard>
              ))}
              {product.stores.length === 0 && (
                <div style={{ gridColumn: 'span 2', padding: '40px', textAlign: 'center', background: tokens.colors.glass.hover, borderRadius: '16px', color: tokens.colors.text.muted }}>
                  No store-specific pricing defined.
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card style={{ height: 'fit-content' }}>
          <InfoLabel>Codes & Identifiers</InfoLabel>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: '16px 0' }}>
            <div style={{ textAlign: 'center', padding: '16px', background: 'white', borderRadius: '12px', minHeight: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
               <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>BARCODE: {product.barcode}</div>
               <Barcode 
                 value={product.barcode} 
                 format={product.barcode.length === 13 ? 'EAN13' : 'CODE128'}
                 height={60}
                 width={1.5}
               />
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: 'white', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>QR CODE: {product.qrcode}</div>
               <div style={{ width: '120px', height: '120px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <div style={{ width: '100px', height: '100px', border: '1px solid #000' }}></div>
               </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <ActionButton $variant="primary">
              <Edit2 size={18} />
              Edit Product
            </ActionButton>
            <ActionButton>
              <Tag size={18} />
              Print Label
            </ActionButton>
            <ActionButton $variant="danger">
              <Trash2 size={18} />
              Archive Product
            </ActionButton>
          </div>
        </Card>
      </ContentGrid>
    </DashboardLayout>
  )
}

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${tokens.colors.text.muted};
`
