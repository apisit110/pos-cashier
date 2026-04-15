'use client'

import React from 'react'
import styled from 'styled-components'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '../../../presentation/components/layout/DashboardLayout'
import { tokens } from '../../../presentation/styles/tokens'
import { Receipt, Search, Filter, Download, MoreVertical, Eye, FileText } from 'lucide-react'
import { GetTransactions } from '../../../application/use-cases/GetTransactions'
import { MockTransactionRepository } from '../../../infrastructure/repositories/MockTransactionRepository'
import { Transaction } from '../../../domain/entities/Transaction'
import { DataTable, Column } from '../../../presentation/components/base/DataTable'

const transactionRepository = new MockTransactionRepository()
const getTransactionsUseCase = new GetTransactions(transactionRepository)

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

const TransactionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const TransactionIcon = styled.div<{ $type: string }>`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${props => {
    switch (props.$type) {
      case 'sale': return '#10b98115'
      case 'refund': return '#ef444415'
      case 'payout': return '#3b82f615'
      default: return tokens.card.border
    }
  }};
  color: ${props => {
    switch (props.$type) {
      case 'sale': return '#10b981'
      case 'refund': return '#ef4444'
      case 'payout': return '#3b82f6'
      default: return tokens.colors.text.muted
    }
  }};
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

export default function TransactionsPage () {
  const router = useRouter()
  const [transactions, setTransactions] = React.useState<Transaction[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  React.useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true)
        const data = await getTransactionsUseCase.execute()
        setTransactions(data)
      } catch (error) {
        console.error('Failed to fetch transactions:', error)
      } finally {
        setIsLoading(false)
      }
    }
    void fetchTransactions()
  }, [])

  const columns: Column<Transaction>[] = [
    {
      header: 'Transaction ID',
      accessor: (tx) => (
        <TransactionInfo>
          <TransactionIcon $type={tx.type}>
            <Receipt size={18} />
          </TransactionIcon>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600 }}>{tx.id}</span>
            <span style={{ fontSize: '0.75rem', color: tokens.colors.text.muted }}>{tx.date}</span>
          </div>
        </TransactionInfo>
      )
    },
    { 
      header: 'Amount', 
      accessor: (tx) => (
        <span style={{ 
          fontWeight: 700, 
          color: tx.type === 'refund' ? '#ef4444' : tokens.colors.text.primary 
        }}>
          {tx.type === 'refund' ? '-' : ''}{tx.amount}
        </span>
      )
    },
    { header: 'Method', accessor: 'paymentMethod' },
    {
      header: 'Status',
      accessor: (tx) => (
        <StatusBadge $status={tx.status}>
          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
        </StatusBadge>
      )
    },
    {
      header: 'Actions',
      align: 'right',
      accessor: () => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <IconButton title="View Details">
            <Eye size={16} />
          </IconButton>
          <IconButton title="Download Receipt">
            <FileText size={16} />
          </IconButton>
          <IconButton>
            <MoreVertical size={16} />
          </IconButton>
        </div>
      )
    }
  ]

  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <DashboardLayout>
      <PageHeader>
        <HeaderLeft>
          <Title>Transactions</Title>
          <Subtitle>View and manage all your store transactions and payments.</Subtitle>
        </HeaderLeft>
        <ActionButtons>
          <Button $variant="secondary">
            <Filter size={18} />
            Filters
          </Button>
          <Button $variant="primary">
            <Download size={18} />
            Export CSV
          </Button>
        </ActionButtons>
      </PageHeader>

      <Toolbar>
        <SearchWrapper>
          <SearchIcon />
          <SearchInput placeholder="Search transaction ID, customer, method..." />
        </SearchWrapper>
      </Toolbar>

      <DataTable
        columns={columns}
        data={paginatedTransactions}
        isLoading={isLoading}
        onRowClick={(tx) => router.push(`/dashboard/transactions/${tx.id}`)}
        pagination={{
          currentPage,
          pageSize,
          totalItems: transactions.length,
          onPageChange: setCurrentPage,
          onPageSizeChange: setPageSize
        }}
      />
    </DashboardLayout>
  )
}
