'use client'

import React from 'react'
import styled from 'styled-components'
import { tokens } from '../../styles/tokens'
import { Loader2 } from 'lucide-react'
import { Pagination } from './Pagination'

export interface Column<T> {
  header: string
  accessor: keyof T | ((item: T) => React.ReactNode)
  align?: 'left' | 'right' | 'center'
  width?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  pagination?: {
    currentPage: number
    pageSize: number
    totalItems: number
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
    pageSizeOptions?: number[]
  }
  onRowClick?: (item: T) => void
}

const Wrapper = styled.div`
  background: ${tokens.card.background};
  backdrop-filter: blur(10px);
  border: 1px solid ${tokens.card.border};
  border-radius: ${tokens.borderRadius.container};
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    border-color: ${tokens.colors.primary}33;
  }
`

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  min-height: 200px;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`

const Th = styled.th<{ $align?: string; $width?: string }>`
  padding: 16px 24px;
  background: ${tokens.card.background};
  border-bottom: 1px solid ${tokens.card.border};
  color: ${tokens.colors.text.muted};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: ${props => props.$align ?? 'left'};
  width: ${props => props.$width ?? 'auto'};
  white-space: nowrap;
`

const Td = styled.td<{ $align?: string }>`
  padding: 16px 24px;
  border-bottom: 1px solid ${tokens.card.border};
  color: ${tokens.colors.text.primary};
  font-size: 0.875rem;
  vertical-align: middle;
  text-align: ${props => props.$align ?? 'left'};
  transition: background 0.2s ease;
`

const Tr = styled.tr<{ $clickable?: boolean }>`
  cursor: ${props => props.$clickable === true ? 'pointer' : 'default'};
  transition: all 0.2s ease;

  &:hover {
    background: ${tokens.card.border}22;
  }

  &:last-child ${Td} {
    border-bottom: none;
  }
`

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: ${tokens.card.background}cc;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  z-index: 10;
`

const EmptyState = styled.div`
  padding: 48px;
  text-align: center;
  color: ${tokens.colors.text.muted};
  font-size: 0.875rem;
`

export function DataTable<T extends { id: string | number }> ({
  columns,
  data,
  isLoading = false,
  pagination,
  onRowClick
}: DataTableProps<T>) {
  const renderCell = (item: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item)
    }
    return item[column.accessor] as React.ReactNode
  }

  return (
    <Wrapper>
      {isLoading === true && (
        <LoadingOverlay>
          <Loader2 size={32} className="animate-spin" style={{ color: tokens.colors.primary }} />
        </LoadingOverlay>
      )}
      
      <TableContainer>
        <Table>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <Th 
                  key={index} 
                  $align={column.align} 
                  $width={column.width}
                >
                  {column.header}
                </Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <Tr 
                  key={item.id} 
                  $clickable={onRowClick != null}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column, index) => (
                    <Td key={index} $align={column.align}>
                      {renderCell(item, column)}
                    </Td>
                  ))}
                </Tr>
              ))
            ) : isLoading === false && (
              <tr>
                <Td colSpan={columns.length}>
                  <EmptyState>No data available</EmptyState>
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
      </TableContainer>

      {pagination != null && data.length > 0 && (
        <Pagination {...pagination} />
      )}
    </Wrapper>
  )
}
