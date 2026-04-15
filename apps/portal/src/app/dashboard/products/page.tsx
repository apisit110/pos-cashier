'use client'

import React from 'react'
import styled from 'styled-components'
import { DashboardLayout } from '../../../presentation/components/layout/DashboardLayout'
import { tokens } from '../../../presentation/styles/tokens'
import { Package, Search, Filter, Plus, MoreVertical, Edit2, Trash2, Loader2 } from 'lucide-react'
import { GetProducts } from '../../../application/use-cases/GetProducts'
import { ApiProductRepository } from '../../../infrastructure/repositories/ApiProductRepository'
import { Product } from '../../../domain/entities/Product'

import { useRouter } from 'next/navigation'
import { DataTable, Column } from '../../../presentation/components/base/DataTable'

const productRepository = new ApiProductRepository()
const getProductsUseCase = new GetProducts(productRepository)

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${tokens.spacing.section};
`

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${tokens.colors.text.primary};
  font-family: ${tokens.fonts.heading};
`

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${tokens.colors.text.muted};
`

const ActionButtons = styled.div`
  display: flex;
  gap: ${tokens.spacing.gap.md};
`

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
  
  ${props => props.$variant === 'primary' ? `
    background: ${tokens.colors.primary};
    color: white;
    border: none;
    &:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }
  ` : `
    background: ${tokens.card.background};
    color: ${tokens.colors.text.primary};
    border: 1px solid ${tokens.card.border};
    &:hover {
      background: ${tokens.card.border};
    }
  `}
`

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${tokens.spacing.gap.lg};
  gap: ${tokens.spacing.gap.lg};
`

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
`

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 44px;
  background: ${tokens.card.background};
  border: 1px solid ${tokens.card.border};
  border-radius: 12px;
  color: ${tokens.colors.text.primary};
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${tokens.colors.primary};
    box-shadow: 0 0 0 4px ${tokens.colors.primary}15;
  }
`

const SearchIcon = styled(Search)`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${tokens.colors.text.muted};
  width: 18px;
  height: 18px;
`

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const ProductIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${tokens.colors.primary}15;
  color: ${tokens.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const BrandBadge = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${tokens.colors.text.muted};
  background: ${tokens.colors.glass.hover};
  padding: 2px 8px;
  border-radius: 6px;
  border: 1px solid ${tokens.card.border};
`

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: ${tokens.colors.text.muted};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${tokens.card.border};
    color: ${tokens.colors.text.primary};
  }
`

export default function ProductsPage () {
  const router = useRouter()
  const [products, setProducts] = React.useState<Product[]>([])
  const [totalItems, setTotalItems] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(true)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const offset = (currentPage - 1) * pageSize
        const { items, total } = await getProductsUseCase.execute(pageSize, offset)
        setProducts(items)
        setTotalItems(total)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setIsLoading(false)
      }
    }
    void fetchProducts()
  }, [currentPage, pageSize])

  const columns: Column<Product>[] = [
    {
      header: 'Product',
      accessor: (product) => (
        <ProductInfo>
          <ProductIcon>
            {product.imageUrls[0] != null ? <img src={product.imageUrls[0]} alt={product.nameEn} /> : <Package size={18} />}
          </ProductIcon>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600 }}>{product.nameEn}</span>
            <span style={{ fontSize: '0.75rem', color: tokens.colors.text.muted }}>{product.nameTh}</span>
          </div>
        </ProductInfo>
      )
    },
    { 
      header: 'Brand', 
      accessor: (product) => <BrandBadge>{product.brandEn}</BrandBadge>
    },
    { 
      header: 'Base Price', 
      accessor: (product) => <span style={{ fontWeight: 700, color: tokens.colors.primary }}>฿{product.basePrice.toLocaleString()}</span> 
    },
    { header: 'Unit', accessor: (product) => product.unitName },
    { 
      header: 'Barcode', 
      accessor: (product) => <code style={{ fontSize: '0.75rem', color: tokens.colors.text.muted }}>{product.barcode}</code>
    },
    {
      header: 'Availability',
      accessor: (product) => (
        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
          {product.stores.length} Stores
        </span>
      )
    },
    {
      header: 'Actions',
      align: 'right',
      accessor: () => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <IconButton>
            <Edit2 size={16} />
          </IconButton>
          <IconButton>
            <Trash2 size={16} />
          </IconButton>
          <IconButton>
            <MoreVertical size={16} />
          </IconButton>
        </div>
      )
    }
  ]

  return (
    <DashboardLayout>
      <PageHeader>
        <HeaderLeft>
          <Title>Product Inventory</Title>
          <Subtitle>Manage and track your store products across all locations.</Subtitle>
        </HeaderLeft>
        <ActionButtons>
          <Button $variant="secondary">
            <Filter size={18} />
            Filters
          </Button>
          <Button $variant="primary">
            <Plus size={18} />
            Add Product
          </Button>
        </ActionButtons>
      </PageHeader>

      <Toolbar>
        <SearchWrapper>
          <SearchIcon />
          <SearchInput placeholder="Search products, categories, SKU..." />
        </SearchWrapper>
      </Toolbar>

      <DataTable
        columns={columns}
        data={products}
        isLoading={isLoading}
        onRowClick={(product) => router.push(`/dashboard/products/${product.id}`)}
        pagination={{
          currentPage,
          pageSize,
          totalItems,
          onPageChange: setCurrentPage,
          onPageSizeChange: setPageSize
        }}
      />
    </DashboardLayout>
  )
}

