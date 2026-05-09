import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { PageHeader } from '../../components/PageHeader';
import type { GetUsersUseCase } from '../../../application/use-cases/GetUsersUseCase';
import type { User } from '../../../domain/repositories/UserRepository';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.semantics.colors.bg.main};
  color: ${({ theme }) => theme.semantics.colors.text.primary};
  padding: 2rem;

  .total-count {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
    background: rgba(255, 255, 255, 0.05);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
  }
`;

const Content = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const TableWrapper = styled.div`
  background: ${({ theme }) => theme.semantics.colors.bg.card};
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  overflow: hidden;
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

const RoleBadge = styled.span<{ $roleId: number }>`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $roleId }) => $roleId === 1 ? 'rgba(99, 102, 241, 0.1)' : 'rgba(34, 197, 94, 0.1)'};
  color: ${({ $roleId }) => $roleId === 1 ? '#818cf8' : '#4ade80'};
  border: 1px solid ${({ $roleId }) => $roleId === 1 ? 'rgba(99, 102, 241, 0.2)' : 'rgba(34, 197, 94, 0.2)'};
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  text-transform: uppercase;
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;

  .page-info {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
  }

  button {
    background: ${({ theme }) => theme.semantics.colors.bg.card};
    border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
    color: ${({ theme }) => theme.semantics.colors.text.primary};
    padding: 0.5rem 1rem;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    cursor: pointer;
    transition: ${({ theme }) => theme.transitions.default};

    &:hover:not(:disabled) { border-color: ${({ theme }) => theme.semantics.colors.accent.primary}; }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }
`;

const Loader = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: ${({ theme }) => theme.semantics.colors.accent.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  display: inline-block;
  margin-right: 0.75rem;
  vertical-align: middle;
`;

interface UserListPageProps {
  onBack: () => void;
  onNavigateToCreateUser: () => void;
  getUsersUseCase: GetUsersUseCase;
}

export const UserListPage: React.FC<UserListPageProps> = ({ onBack, onNavigateToCreateUser, getUsersUseCase }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 10;

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getUsersUseCase.execute(currentPage, limit);
      setUsers(result.users);
      setTotal(result.total);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getUsersUseCase, currentPage, limit]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const totalPages = Math.ceil(total / limit);

  return (
    <Container>
      <PageHeader
        title="Manage Users"
        onBack={onBack}
        extraContent={
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span className="total-count">Total: {total} Users</span>
            <button 
              onClick={onNavigateToCreateUser}
              style={{
                background: '#6366f1',
                color: 'white',
                border: 'none',
                padding: '0.625rem 1.25rem',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create New User
            </button>
          </div>
        }
      />

      <Content>
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Full Name</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '3rem' }}>
                    <Loader />
                    Loading users...
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{user.userId}</td>
                    <td>{user.fullName}</td>
                    <td>
                      <RoleBadge $roleId={user.roleId}>
                        {user.roleId === 1 ? '🛡️ Manager' : '💰 Cashier'}
                      </RoleBadge>
                    </td>
                    <td>
                      <StatusBadge>Active</StatusBadge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No users found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </TableWrapper>

        {totalPages > 1 && (
          <Pagination>
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </button>
            <div className="page-info">
              Page {currentPage} of {totalPages}
            </div>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isLoading}
            >
              Next
            </button>
          </Pagination>
        )}
      </Content>
    </Container>
  );
};
