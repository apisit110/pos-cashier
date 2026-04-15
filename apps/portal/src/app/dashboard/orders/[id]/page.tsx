'use client'

import React from 'react'
import styled from 'styled-components'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '../../../../presentation/components/layout/DashboardLayout'
import { tokens } from '../../../../presentation/styles/tokens'
import { ShoppingBag, ArrowLeft, Printer, Truck, User, Calendar, CheckCircle2, ChevronRight } from 'lucide-react'
import { GetOrderById } from '../../../../application/use-cases/GetOrderById'
import { MockOrderRepository } from '../../../../infrastructure/repositories/MockOrderRepository'
import { Order } from '../../../../domain/entities/Order'

const orderRepository = new MockOrderRepository()
const getOrderByIdUseCase = new GetOrderById(orderRepository)

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${tokens.spacing.section};
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.gap.md};
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

const StatusBadge = styled.span<{ $status: string }>`
  padding: 6px 16px;
  border-radius: 99px;
  font-size: 0.875rem;
  font-weight: 700;
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

const Card = styled.div`
  background: ${tokens.card.background};
  border: 1px solid ${tokens.card.border};
  border-radius: ${tokens.borderRadius.container};
  padding: ${tokens.card.padding};
  margin-bottom: ${tokens.spacing.gap.lg};
`

const Timeline = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 32px 0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 15px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${tokens.card.border};
    z-index: 0;
  }
`

const TimelineStep = styled.div<{ $completed?: boolean; $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 1;
  background: ${tokens.colors.background};
  padding: 0 16px;

  .icon-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${props => props.$completed ? tokens.colors.primary : tokens.card.background};
    border: 2px solid ${props => props.$completed || props.$active ? tokens.colors.primary : tokens.card.border};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.$completed ? 'white' : props.$active ? tokens.colors.primary : tokens.colors.text.muted};
  }

  span {
    font-size: 0.75rem;
    font-weight: 600;
    color: ${props => props.$active ? tokens.colors.text.primary : tokens.colors.text.muted};
  }
`

const OrderDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid ${tokens.card.border};
`

const Label = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${tokens.colors.text.muted};
  text-transform: uppercase;
`

const Value = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: ${tokens.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 8px;
`

const ActionButton = styled.button<{ $variant?: 'primary' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  
  ${props => props.$variant === 'primary' ? `
    background: ${tokens.colors.primary};
    color: white;
    border: none;
  ` : `
    background: ${tokens.card.background};
    color: ${tokens.colors.text.primary};
    border: 1px solid ${tokens.card.border};
  `}
`

export default function OrderDetailPage () {
  const { id } = useParams()
  const router = useRouter()
  const [order, setOrder] = React.useState<Order | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchOrder = async () => {
      if (typeof id !== 'string') return
      try {
        const data = await getOrderByIdUseCase.execute(id)
        setOrder(data)
      } catch (error) {
        console.error('Failed to fetch order:', error)
      } finally {
        setIsLoading(false)
      }
    }
    void fetchOrder()
  }, [id])

  if (isLoading) return <DashboardLayout>Loading...</DashboardLayout>
  if (order == null) return <DashboardLayout>Order not found</DashboardLayout>

  const steps = ['Pending', 'Processing', 'Delivered']

  const statusMap: Record<string, string> = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Processing',
    delivered: 'Delivered'
  }

  const currentStatusLabel = statusMap[order.status] || order.status
  const currentStepIndex = steps.indexOf(currentStatusLabel)

  return (
    <DashboardLayout>
      <Header>
        <HeaderLeft>
          <BackButton onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </BackButton>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Title>Order {order.id}</Title>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: tokens.card.border, padding: '4px 12px', borderRadius: '99px' }}>
                {order.type === 'delivery' ? <Truck size={14} /> : <User size={14} />}
                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{order.type.toUpperCase()}</span>
              </div>
              <StatusBadge $status={order.status}>
                {currentStatusLabel}
              </StatusBadge>
            </div>
            <p style={{ fontSize: '0.875rem', color: tokens.colors.text.muted, marginTop: '4px' }}>
              Placed on {order.createdAt}
            </p>
          </div>
        </HeaderLeft>
        <div style={{ display: 'flex', gap: '12px' }}>
          <ActionButton>
            <Printer size={18} />
            Print Invoice
          </ActionButton>
          <ActionButton $variant="primary">
            Update Status
          </ActionButton>
        </div>
      </Header>

      <Card>
        <Timeline>
          {steps.map((step, index) => (
            <TimelineStep 
              key={step} 
              $completed={index < currentStepIndex || order.status === 'delivered'} 
              $active={index === currentStepIndex && order.status !== 'delivered'}
            >
              <div className="icon-circle">
                {index < currentStepIndex || order.status === 'delivered' ? <CheckCircle2 size={16} /> : index + 1}
              </div>
              <span>{step}</span>
            </TimelineStep>
          ))}
        </Timeline>
      </Card>

      <OrderDetailsGrid>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card>
            <Label style={{ display: 'block', marginBottom: '16px' }}>Order Items</Label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[...Array(order.itemCount)].map((_, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', background: tokens.card.border, borderRadius: '8px' }} />
                    <div>
                      <div style={{ fontWeight: 600 }}>Sample Product Item #{i + 1}</div>
                      <div style={{ fontSize: '0.75rem', color: tokens.colors.text.muted }}>Quantity: 1</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 600 }}>฿{parseFloat(order.totalAmount.replace(/[^\d.]/g, '')) / order.itemCount}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid ' + tokens.card.border }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: tokens.colors.text.muted }}>Subtotal</span>
                <span>{order.totalAmount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800 }}>
                <span>Total</span>
                <span style={{ color: tokens.colors.primary }}>{order.totalAmount}</span>
              </div>
            </div>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card>
            <Label style={{ display: 'block', marginBottom: '16px' }}>Customer Info</Label>
            <InfoItem>
              <Value><User size={18} /> Anonymized Guest</Value>
              <p style={{ fontSize: '0.875rem', color: tokens.colors.text.muted }}>No individual data collected</p>
            </InfoItem>
          </Card>
          <Card>
            <Label style={{ display: 'block', marginBottom: '16px' }}>{order.type === 'delivery' ? 'Shipping' : 'Fulfillment'}</Label>
            <InfoItem>
              <Value>
                {order.type === 'delivery' ? <Truck size={18} /> : <User size={18} />}
                {order.type === 'delivery' ? 'Standard Delivery' : 'In-Store Pickup'}
              </Value>
              <p style={{ fontSize: '0.875rem', color: tokens.colors.text.muted }}>
                {order.type === 'delivery' ? '123 Mock Street, Bangkok, Thailand' : 'Counter #1 - Main Branch'}
              </p>
            </InfoItem>
          </Card>
        </div>
      </OrderDetailsGrid>
    </DashboardLayout>
  )
}
