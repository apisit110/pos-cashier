'use client'

import React from 'react'
import styled from 'styled-components'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '../../../presentation/components/layout/DashboardLayout'
import { tokens } from '../../../presentation/styles/tokens'
import { ShoppingBag, Search, Filter, Plus, MoreVertical, Eye, Printer, Truck, User } from 'lucide-react'
import { GetOrders } from '../../../application/use-cases/GetOrders'
import { MockOrderRepository } from '../../../infrastructure/repositories/MockOrderRepository'
import { Order } from '../../../domain/entities/Order'
import { DataTable, Column } from '../../../presentation/components/base/DataTable'

const orderRepository = new MockOrderRepository()
const getOrdersUseCase = new GetOrders(orderRepository)

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

const OrderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const OrderIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${tokens.colors.primary}15;
  color: ${tokens.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`

const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => {
    switch (props.$status) {
      case 'delivered': return '#10b98115'
      case 'processing': return '#3b82f615'
      case 'pending': return '#f59e0b15'
      case 'shipped': return '#6366f115'
      case 'cancelled': return '#ef444415'
      default: return tokens.card.border
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'delivered': return '#10b981'
      case 'processing': return '#3b82f6'
      case 'pending': return '#f59e0b'
      case 'shipped': return '#6366f1'
      case 'cancelled': return '#ef4444'
      default: return tokens.colors.text.muted
    }
  }};
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

export default function OrdersPage () {
  const router = useRouter()
  const [orders, setOrders] = React.useState<Order[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        const data = await getOrdersUseCase.execute()
        setOrders(data)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      } finally {
        setIsLoading(false)
      }
    }
    void fetchOrders()
  }, [])

  const columns: Column<Order>[] = [
    {
      header: 'Order ID',
      accessor: (order) => (
        <OrderInfo>
          <OrderIcon>
            <ShoppingBag size={18} />
          </OrderIcon>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600 }}>{order.id}</span>
            <span style={{ fontSize: '0.75rem', color: tokens.colors.text.muted }}>{order.createdAt}</span>
          </div>
        </OrderInfo>
      )
    },
    { 
      header: 'Items', 
      accessor: (order) => <span>{order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}</span> 
    },
    { 
      header: 'Total', 
      accessor: (order) => <span style={{ fontWeight: 600 }}>{order.totalAmount}</span> 
    },
    {
      header: 'Type',
      accessor: (order) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: order.type === 'delivery' ? tokens.colors.primary : tokens.colors.text.primary }}>
          {order.type === 'delivery' ? <Truck size={14} /> : <User size={14} />}
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {order.type.charAt(0).toUpperCase() + order.type.slice(1)}
          </span>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: (order) => {
        const labels: Record<string, string> = {
          pending: 'Pending',
          processing: 'Processing',
          shipped: 'Processing', // Map shipped to processing for simplicity as requested
          delivered: 'Delivered',
          cancelled: 'Cancelled'
        }

        const label = labels[order.status] || order.status

        return (
          <StatusBadge $status={order.status}>
            {label}
          </StatusBadge>
        )
      }
    },
    {
      header: 'Actions',
      align: 'right',
      accessor: () => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <IconButton title="View Details">
            <Eye size={16} />
          </IconButton>
          <IconButton title="Print Invoice">
            <Printer size={16} />
          </IconButton>
          <IconButton>
            <MoreVertical size={16} />
          </IconButton>
        </div>
      )
    }
  ]

  const paginatedOrders = orders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <DashboardLayout>
      <PageHeader>
        <HeaderLeft>
          <Title>Orders</Title>
          <Subtitle>Manage and track all customer orders and fulfillment status.</Subtitle>
        </HeaderLeft>
        <ActionButtons>
          <Button $variant="secondary">
            <Filter size={18} />
            Filters
          </Button>
          <Button $variant="primary">
            <Plus size={18} />
            Create Order
          </Button>
        </ActionButtons>
      </PageHeader>

      <Toolbar>
        <SearchWrapper>
          <SearchIcon />
          <SearchInput placeholder="Search order ID, customer name..." />
        </SearchWrapper>
      </Toolbar>

      <DataTable
        columns={columns}
        data={paginatedOrders}
        isLoading={isLoading}
        onRowClick={(order) => router.push(`/dashboard/orders/${order.id}`)}
        pagination={{
          currentPage,
          pageSize,
          totalItems: orders.length,
          onPageChange: setCurrentPage,
          onPageSizeChange: setPageSize
        }}
      />
    </DashboardLayout>
  )
}
