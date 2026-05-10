import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const SkeletonBase = styled.div`
  height: 1rem;
  background: linear-gradient(90deg, 
    ${({ theme }) => theme.semantics.colors.border.subtle} 25%, 
    rgba(255, 255, 255, 0.08) 50%, 
    ${({ theme }) => theme.semantics.colors.border.subtle} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite linear;
  border-radius: 4px;
`;

const TableWrapper = styled.div`
  background: ${({ theme }) => theme.semantics.colors.bg.card};
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th, td {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  }

  th {
    background: rgba(255, 255, 255, 0.02);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
  }

  td { font-size: 0.875rem; }

  tr:last-child td { border-bottom: none; }
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border-top: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
`;

const PaginationLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const RowsPerPage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.semantics.colors.text.secondary};
  font-size: 0.875rem;

  select {
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.semantics.colors.text.primary};
    font-weight: 600;
    cursor: pointer;
    outline: none;
    padding: 2px 4px;
    border-radius: 4px;
    appearance: none;
    
    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    option {
      background: #0f172a;
      color: white;
    }
  }

  .dropdown-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    gap: 4px;
    
    svg {
      width: 14px;
      height: 14px;
      color: ${({ theme }) => theme.semantics.colors.text.secondary};
      pointer-events: none;
    }
  }
`;

const PageRange = styled.div`
  color: ${({ theme }) => theme.semantics.colors.text.primary};
  font-size: 0.875rem;
  font-weight: 500;
`;

const PageControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.semantics.colors.text.secondary};
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.05);
    color: ${({ theme }) => theme.semantics.colors.text.primary};
  }

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const PageNumber = styled.button<{ $active?: boolean }>`
  background: ${({ $active, theme }) => $active ? theme.semantics.colors.accent.primary : 'transparent'};
  color: ${({ $active, theme }) => $active ? 'white' : theme.semantics.colors.text.primary};
  border: none;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  font-size: 0.875rem;
  font-weight: 700;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${({ $active, theme }) => $active ? theme.semantics.colors.accent.primary : 'rgba(255, 255, 255, 0.05)'};
  }
`;


export interface Column<T> {
  header: string;
  key: string;
  width?: string;
  textAlign?: 'left' | 'center' | 'right';
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  emptyMessage?: string;
  loadingMessage?: string;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading,
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  emptyMessage = 'No data found.',
  loadingMessage = 'Loading data...',
}: DataTableProps<T>) {
  const totalPages = Math.ceil(totalItems / pageSize);
  
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th 
                key={col.key} 
                style={{ width: col.width, textAlign: col.textAlign || 'left' }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: Math.min(pageSize, 10) }).map((_, rowIndex) => (
              <tr key={`skeleton-${rowIndex}`}>
                {columns.map((col, colIndex) => (
                  <td key={`skeleton-${rowIndex}-${colIndex}`}>
                    <SkeletonBase 
                      style={{ 
                        width: col.width || '80%', 
                        margin: col.textAlign === 'right' ? '0 0 0 auto' : col.textAlign === 'center' ? '0 auto' : '0' 
                      }} 
                    />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id}>
                {columns.map((col) => (
                  <td 
                    key={`${item.id}-${col.key}`} 
                    style={{ textAlign: col.textAlign || 'left' }}
                  >
                    {col.render ? col.render(item) : (item as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td 
                colSpan={columns.length} 
                style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {!isLoading && totalItems > 0 && (
        <PaginationContainer>
          <PaginationLeft>
            <RowsPerPage>
              <span>Rows per page:</span>
              <div className="dropdown-wrapper">
                <select 
                  value={pageSize} 
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                >
                  {[10, 20, 30, 50, 100].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </RowsPerPage>
            <PageRange>
              {startItem}-{endItem} of {totalItems}
            </PageRange>
          </PaginationLeft>

          <PageControls>
            <IconButton 
              onClick={() => onPageChange(1)} 
              disabled={currentPage === 1}
              title="First Page"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="11 17 6 12 11 7"></polyline>
                <polyline points="18 17 13 12 18 7"></polyline>
              </svg>
            </IconButton>
            <IconButton 
              onClick={() => onPageChange(Math.max(1, currentPage - 1))} 
              disabled={currentPage === 1}
              title="Previous Page"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </IconButton>

            {(() => {
              const pages = [];
              let startPage = Math.max(1, currentPage - 1);
              let endPage = Math.min(totalPages, startPage + 2);
              
              if (endPage - startPage < 2) {
                startPage = Math.max(1, endPage - 2);
              }

              for (let i = startPage; i <= endPage; i++) {
                if (i < 1) continue;
                pages.push(
                  <PageNumber 
                    key={i} 
                    $active={currentPage === i}
                    onClick={() => onPageChange(i)}
                  >
                    {i}
                  </PageNumber>
                );
              }
              return pages;
            })()}

            <IconButton 
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} 
              disabled={currentPage === totalPages}
              title="Next Page"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </IconButton>
            <IconButton 
              onClick={() => onPageChange(totalPages)} 
              disabled={currentPage === totalPages}
              title="Last Page"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="13 17 18 12 13 7"></polyline>
                <polyline points="6 17 11 12 6 7"></polyline>
              </svg>
            </IconButton>
          </PageControls>
        </PaginationContainer>
      )}
    </TableWrapper>
  );
}
