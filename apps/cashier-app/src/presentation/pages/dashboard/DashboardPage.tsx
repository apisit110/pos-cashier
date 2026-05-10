import React from 'react';
import styled from 'styled-components';

interface DashboardPageProps {
  user: { uid: string; username: string; role: string; accessToken: string } | null;
}


const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.semantics.colors.bg.main};
  padding: 2rem;
`;




export const DashboardPage: React.FC<DashboardPageProps> = ({ 
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

    </DashboardContainer>
  );
};
