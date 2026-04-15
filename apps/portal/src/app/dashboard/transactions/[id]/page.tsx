'use client'

import React from 'react'
import styled from 'styled-components'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '../../../../presentation/components/layout/DashboardLayout'
import { tokens } from '../../../../presentation/styles/tokens'
import { Receipt, ArrowLeft, Download, Eye, FileText, User, CreditCard, Calendar } from 'lucide-react'
import { GetTransactionById } from '../../../../application/use-cases/GetTransactionById'
import { MockTransactionRepository } from '../../../../infrastructure/repositories/MockTransactionRepository'
import { Transaction } from '../../../../domain/entities/Transaction'

const transactionRepository = new MockTransactionRepository()
const getTransactionByIdUseCase = new GetTransactionById(transactionRepository)

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

const Card = styled.div`
  background: ${tokens.card.background};
  border: 1px solid ${tokens.card.border};
  border-radius: ${tokens.borderRadius.container};
  padding: ${tokens.card.padding};
  display: flex;
  flex-direction: column;
  gap: ${tokens.card.gap};
  margin-bottom: ${tokens.spacing.gap.lg};
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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

const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 600;
  width: fit-content;
  background: ${props => {
    switch (props.$status) {
      case 'completed': return '#10b98115'
      case 'failed': return '#ef444415'
      case 'pending': return '#f59e0b15'
      case 'refunded': return '#6366f115'
      default: return tokens.card.border
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'completed': return '#10b981'
      case 'failed': return '#ef4444'
      case 'pending': return '#f59e0b'
      case 'refunded': return '#6366f1'
      default: return tokens.colors.text.muted
    }
  }};
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
  transition: all 0.2s ease;
  
  ${props => props.$variant === 'primary' ? `
    background: ${tokens.colors.primary};
    color: white;
    border: none;
    &:hover { opacity: 0.9; }
  ` : `
    background: ${tokens.card.background};
    color: ${tokens.colors.text.primary};
    border: 1px solid ${tokens.card.border};
    &:hover { background: ${tokens.card.border}; }
  `}
`

export default function TransactionDetailPage () {
  const { id } = useParams()
  const router = useRouter()
  const [tx, setTx] = React.useState<Transaction | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchTx = async () => {
      if (typeof id !== 'string') return
      try {
        const data = await getTransactionByIdUseCase.execute(id)
        setTx(data)
      } catch (error) {
        console.error('Failed to fetch transaction:', error)
      } finally {
        setIsLoading(false)
      }
    }
    void fetchTx()
  }, [id])

  if (isLoading) return <DashboardLayout>Loading...</DashboardLayout>
  if (tx == null) return <DashboardLayout>Transaction not found</DashboardLayout>

  return (
    <DashboardLayout>
      <Header>
        <HeaderLeft>
          <BackButton onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </BackButton>
          <Title>Transaction Details</Title>
        </HeaderLeft>
        <div style={{ display: 'flex', gap: '12px' }}>
          <ActionButton>
            <Download size={18} />
            Download PDF
          </ActionButton>
          <ActionButton $variant="primary">
            <Receipt size={18} />
            Print Receipt
          </ActionButton>
        </div>
      </Header>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <Label>Transaction ID</Label>
            <Title style={{ fontSize: '1.75rem', marginTop: '4px' }}>{tx.id}</Title>
          </div>
          <StatusBadge $status={tx.status}>
            {tx.status.toUpperCase()}
          </StatusBadge>
        </div>

        <Grid>
          <InfoItem>
            <Label>Customer</Label>
            <Value><User size={18} /> Anonymized Guest</Value>
          </InfoItem>
          <InfoItem>
            <Label>Date & Time</Label>
            <Value><Calendar size={18} /> {tx.date}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Payment Method</Label>
            <Value><CreditCard size={18} /> {tx.paymentMethod}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Type</Label>
            <Value style={{ color: tx.type === 'refund' ? '#ef4444' : tokens.colors.primary }}>
              <FileText size={18} /> {tx.type.toUpperCase()}
            </Value>
          </InfoItem>
        </Grid>
      </Card>

      <Card>
        <Label>Payment Summary</Label>
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: tokens.colors.text.muted }}>Subtotal</span>
            <span style={{ fontWeight: 500 }}>{tx.amount}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: tokens.colors.text.muted }}>Tax (0%)</span>
            <span style={{ fontWeight: 500 }}>฿0.00</span>
          </div>
          <div style={{ 
            marginTop: '8px', 
            paddingTop: '16px', 
            borderTop: '1px solid ' + tokens.card.border,
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>Total</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: tokens.colors.primary }}>{tx.amount}</span>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  )
}
