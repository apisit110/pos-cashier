'use client'

import React from 'react'
import styled from 'styled-components'
import { tokens } from '../../styles/tokens'
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from 'lucide-react'

interface PaginationProps {
  currentPage: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  pageSizeOptions?: number[]
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${tokens.spacing.gap.lg};
  padding: ${tokens.spacing.gap.md} ${tokens.spacing.gap.lg};
  color: ${tokens.colors.text.primary};
  font-size: 0.875rem;
`

const RowsPerPageWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.gap.sm};
  color: ${tokens.colors.text.muted};
`

const Select = styled.select`
  background: ${tokens.card.background};
  border: 1px solid ${tokens.card.border};
  border-radius: ${tokens.borderRadius.control};
  color: ${tokens.colors.text.primary};
  padding: 4px 8px;
  cursor: pointer;
  outline: none;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${tokens.colors.primary};
  }
`

const InfoLine = styled.span`
  color: ${tokens.colors.text.muted};
  min-width: 100px;
  text-align: center;
`

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const PageButton = styled.button<{ $active?: boolean; $disabled?: boolean }>`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid ${props => props.$active === true ? tokens.colors.primary : tokens.card.border};
  background: ${props => props.$active === true ? tokens.colors.primary : 'transparent'};
  color: ${props => {
    if (props.$disabled === true) return tokens.colors.text.disabled
    if (props.$active === true) return 'white'
    return tokens.colors.text.primary
  }};
  cursor: ${props => props.$disabled === true ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover:not(:disabled) {
    background: ${props => props.$active === true ? tokens.colors.primary : tokens.card.border};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`

export function Pagination ({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100]
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize)
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  const renderPageNumbers = () => {
    const pages = []
    const visiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2))
    const endPage = Math.min(totalPages, startPage + visiblePages - 1)

    if (endPage - startPage + 1 < visiblePages) {
      startPage = Math.max(1, endPage - visiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PageButton
          key={i}
          $active={currentPage === i}
          onClick={() => onPageChange(i)}
        >
          {i}
        </PageButton>
      )
    }
    return pages
  }

  return (
    <Container>
      <RowsPerPageWrapper>
        <span>Rows per page</span>
        <Select 
          value={pageSize} 
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value))
            onPageChange(1)
          }}
        >
          {pageSizeOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </Select>
      </RowsPerPageWrapper>

      <InfoLine>
        {startItem}-{endItem} of {totalItems}
      </InfoLine>

      <Controls>
        <PageButton 
          $disabled={currentPage === 1} 
          onClick={() => onPageChange(1)}
        >
          <ChevronsLeft size={16} />
        </PageButton>
        <PageButton 
          $disabled={currentPage === 1} 
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={16} />
        </PageButton>
        
        {renderPageNumbers()}

        <PageButton 
          $disabled={currentPage === totalPages} 
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight size={16} />
        </PageButton>
        <PageButton 
          $disabled={currentPage === totalPages} 
          onClick={() => onPageChange(totalPages)}
        >
          <ChevronsRight size={16} />
        </PageButton>
      </Controls>
    </Container>
  )
}
