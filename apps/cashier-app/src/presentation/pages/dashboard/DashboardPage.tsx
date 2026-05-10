import React from 'react';
import styled from 'styled-components';

interface DashboardPageProps {
  onNavigateToSell: () => void;
  onNavigateToUserList: () => void;
  onNavigateToTransactionList: () => void;
  user: { uid: string; username: string; role: string; accessToken: string } | null;
}


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


export const DashboardPage: React.FC<DashboardPageProps> = ({ 
  onNavigateToSell, 
  onNavigateToUserList,
  onNavigateToTransactionList,
  user
}) => {

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
          <DashboardCard $isHighlight onClick={onNavigateToSell}>
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <h3>Point of Sale</h3>
            <p>Launch the terminal to start processing new customer orders.</p>
          </DashboardCard>

          <DashboardCard onClick={onNavigateToTransactionList}>
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <h3>Sales History</h3>
            <p>View and manage past transactions and generate reports.</p>
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
            <h3>Staff Management</h3>
            <p>Add new cashiers, update permissions, and monitor activity.</p>
          </DashboardCard>

        </DashboardGrid>
      </DashboardContent>
    </DashboardContainer>
  );
};
