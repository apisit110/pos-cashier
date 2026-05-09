import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { PageHeader } from '../../components/PageHeader';
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
      const mid = import.meta.env.VITE_MID;
      const sid = import.meta.env.VITE_SID;
      
      if (!mid || !sid) {
        throw new Error('MID or SID not configured in environment');
      }

      const result = await syncProductUseCase.execute(mid, sid);
      setMessage({ text: `Products synced! ${result.count} items updated.`, type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to sync products', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardContainer>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
          Welcome back, {user?.username || 'Admin'}
        </h1>
        <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>
          Here's what's happening with your store today.
        </p>
      </header>

      <DashboardContent>
        <DashboardGrid>
          <DashboardCard onClick={handleSyncProduct}>
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <h3>Inventory Sync</h3>
            <p>Pull latest product data and pricing from the central server.</p>
          </DashboardCard>
        </DashboardGrid>

        {message && (
          <StatusMessage $type={message.type}>
            {message.text}
          </StatusMessage>
        )}

        {isLoading && <LoadingOverlay>Synchronizing data...</LoadingOverlay>}
      </DashboardContent>
    </DashboardContainer>
  );
};
