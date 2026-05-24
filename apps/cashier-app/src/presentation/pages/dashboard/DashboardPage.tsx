import React from 'react';
import { DashboardContainer } from './DashboardContainer';

interface DashboardPageProps {
  staff: { uid: string; username: string; role: string; accessToken: string } | null;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  staff,
}) => {

  return (
    <DashboardContainer>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
          Welcome back, {staff?.username || 'Admin'}
        </h1>
        <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>
          Here's what's happening with your store today.
        </p>
      </header>

    </DashboardContainer>
  );
};
