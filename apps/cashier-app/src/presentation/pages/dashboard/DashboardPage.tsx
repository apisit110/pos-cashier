import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Button } from '../../components/Button';
import { SyncProductUseCase } from '../../../application/use-cases/SyncProductUseCase';
import { ApiProductRepository } from '../../../data/repositories/ApiProductRepository';

// For simplicity, instantiating dependencies here.
const productRepository = new ApiProductRepository();
const syncProductUseCase = new SyncProductUseCase(productRepository);

interface DashboardPageProps {
  onLogout: () => void;
  onNavigateToSell: () => void;
  onNavigateToCreateUser: () => void;
  onNavigateToUserList: () => void;
  onNavigateToTransactionList: () => void;
  user: { uid: string; username: string; role: string; accessToken: string } | null;
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.semantics.colors.bg.main};
  padding: 2rem;
`;

const DashboardHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};

  .brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: ${({ theme }) => theme.semantics.colors.text.primary};
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
`;

const UserIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.semantics.colors.bg.card};
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  border-radius: ${({ theme }) => theme.borderRadius.xl};

  .user-icon {
    font-size: 1.25rem;
  }

  .user-details {
    display: flex;
    flex-direction: column;
  }

  .username {
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.semantics.colors.text.primary};
  }

  .role-badge {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 700;
    
    &.manager {
      color: ${({ theme }) => theme.semantics.colors.accent.primary};
    }
    
    &.cashier {
      color: ${({ theme }) => theme.semantics.colors.text.secondary};
    }
  }
`;

const DashboardContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  width: 100%;
`;

const DashboardCard = styled.div<{ $isHighlight?: boolean }>`
  background: ${({ theme, $isHighlight }) => $isHighlight ? 'rgba(99, 102, 241, 0.1)' : theme.semantics.colors.bg.card};
  border: 1px solid ${({ theme, $isHighlight }) => $isHighlight ? theme.semantics.colors.accent.primary : theme.semantics.colors.border.subtle};
  border-radius: ${({ theme }) => theme.borderRadius.xxl};
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  position: relative;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};

  &:hover {
    transform: translateY(-8px);
    border-color: ${({ theme }) => theme.semantics.colors.accent.primary};
    background: rgba(99, 102, 241, 0.15);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  .card-icon {
    width: 64px;
    height: 64px;
    background: rgba(99, 102, 241, 0.1);
    color: ${({ theme }) => theme.semantics.colors.accent.primary};
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    transition: ${({ theme }) => theme.transitions.default};

    svg {
      width: 32px;
      height: 32px;
    }
  }

  &:hover .card-icon {
    background: ${({ theme }) => theme.semantics.colors.accent.primary};
    color: white;
    transform: scale(1.1);
  }

  h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1.25rem;
    color: ${({ theme }) => theme.semantics.colors.text.primary};
  }

  p {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
    line-height: 1.5;
    margin: 0;
  }
`;

const StatusMessage = styled.div<{ $type: 'success' | 'error' }>`
  margin-top: 2rem;
  padding: 1rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 500;
  animation: ${fadeIn} 0.3s ease;
  background-color: ${({ $type }) => $type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${({ $type }) => $type === 'success' ? '#16a34a' : '#dc2626'};
  border: 1px solid ${({ $type }) => $type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(4px);
  font-weight: 600;
  color: ${({ theme }) => theme.semantics.colors.accent.primary};
`;

export const DashboardPage: React.FC<DashboardPageProps> = ({ 
  onLogout, 
  onNavigateToSell, 
  onNavigateToCreateUser,
  onNavigateToUserList,
  onNavigateToTransactionList,
  user 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSyncProduct = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const result = await syncProductUseCase.execute();
      setMessage({ text: `Products synced! ${result.count} items updated.`, type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to sync products', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <div className="brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <h2>Lightning POS Dashboard</h2>
        </div>
        <div className="user-info">
          {user && (
            <UserIndicator>
              <span className="user-icon">👤</span>
              <div className="user-details">
                <span className="username">{user.username}</span>
                <span className={`role-badge ${user.role}`}>{user.role}</span>
              </div>
            </UserIndicator>
          )}
          <Button variant="danger" onClick={onLogout} style={{ width: 'auto' }}>Logout</Button>
        </div>
      </DashboardHeader>

      <DashboardContent>
        <DashboardGrid>
          <DashboardCard onClick={onNavigateToCreateUser}>
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            </div>
            <h3>Create New User</h3>
            <p>Generate a temporary user ID for new employees.</p>
          </DashboardCard>

          <DashboardCard onClick={onNavigateToUserList}>
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3>Manage Users</h3>
            <p>View and manage all employees in the system.</p>
          </DashboardCard>

          <DashboardCard onClick={onNavigateToTransactionList}>
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <h3>Transactions</h3>
            <p>View sales history, payment methods, and statuses.</p>
          </DashboardCard>

          <DashboardCard onClick={handleSyncProduct}>
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <h3>Sync Product</h3>
            <p>Update product list and pricing from the server.</p>
          </DashboardCard>

          <DashboardCard $isHighlight onClick={onNavigateToSell}>
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <h3>Sell</h3>
            <p>Switch to Cashier mode and start processing orders.</p>
          </DashboardCard>
        </DashboardGrid>

        {message && (
          <StatusMessage $type={message.type}>
            {message.text}
          </StatusMessage>
        )}

        {isLoading && <LoadingOverlay>Processing...</LoadingOverlay>}
      </DashboardContent>
    </DashboardContainer>
  );
};
