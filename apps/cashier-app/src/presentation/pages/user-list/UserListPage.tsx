import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import type { GetUsersUseCase } from '../../../application/use-cases/GetUsersUseCase';
import type { User } from '../../../domain/repositories/UserRepository';

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

interface UserListPageProps {
  onBack: () => void;
  onNavigateToCreateUser: () => void;
  getUsersUseCase: GetUsersUseCase;
}

export const UserListPage: React.FC<UserListPageProps> = ({ onBack, onNavigateToCreateUser, getUsersUseCase }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getUsersUseCase.execute(currentPage, pageSize);
      setUsers(result.users);
      setTotal(result.total);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getUsersUseCase, currentPage, pageSize]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

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
        <DataTable
          columns={[
            { 
              header: 'User ID', 
              key: 'userId',
              render: (user) => <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{user.userId}</span>
            },
            { header: 'Full Name', key: 'fullName' },
            { 
              header: 'Role', 
              key: 'roleId',
              render: (user) => (
                <RoleBadge $roleId={user.roleId}>
                  {user.roleId === 1 ? '🛡️ Manager' : '💰 Cashier'}
                </RoleBadge>
              )
            },
            { 
              header: 'Status', 
              key: 'status',
              render: () => <StatusBadge>Active</StatusBadge>
            },
          ]}
          data={users}
          isLoading={isLoading}
          totalItems={total}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          emptyMessage="No users found."
        />
      </Content>
    </Container>
  );
};
