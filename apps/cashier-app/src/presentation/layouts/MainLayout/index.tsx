import React from 'react';
import styled from 'styled-components';
import { Sidebar, TopBar } from '@apisit110/pos-ui';
import { LayoutContainer } from './LayoutContainer';
import { MainContent } from './MainContent';
import { useThemeMode } from '../../ThemeContext';

const RightColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const LogoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const PosIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const TransactionIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);

const ProductIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const StaffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

interface MainLayoutProps {
  children: React.ReactNode;
  currentView: string;
  staff: { username: string; role: string } | null;
  onNavigate: (view: any) => void;
  onLogout: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  currentView,
  staff,
  onNavigate,
  onLogout,
}) => {
  const { mode, toggleTheme } = useThemeMode();

  const isManager = staff?.role === 'manager';

  const navItems = [
    ...(isManager ? [{ label: 'Dashboard', icon: <DashboardIcon />, active: currentView === 'dashboard', onClick: () => onNavigate('dashboard') }] : []),
    { label: 'POS Terminal', icon: <PosIcon />, active: currentView === 'create-order', onClick: () => onNavigate('create-order') },
    ...(isManager ? [
      { label: 'Transactions', icon: <TransactionIcon />, active: currentView === 'transaction-list', onClick: () => onNavigate('transaction-list') },
      { label: 'Products', icon: <ProductIcon />, active: currentView === 'product-list', onClick: () => onNavigate('product-list') },
      { label: 'Staffs', icon: <StaffIcon />, active: currentView === 'staff-list' || currentView === 'create-staff', onClick: () => onNavigate('staff-list') },
    ] : []),
  ];

  const viewTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    'create-order': 'POS Terminal',
    'transaction-list': 'Transactions',
    'product-list': 'Products',
    'staff-list': 'Staffs',
    'create-staff': 'Staffs',
  };

  const pageTitle = viewTitles[currentView] ?? 'POS Cashier';

  return (
    <LayoutContainer>
      {currentView !== 'create-order' && (
        <Sidebar
          logoTitle="POS Cashier"
          logoIcon={<LogoIcon />}
          navItems={navItems}
          user={staff ? { name: staff.username, subtitle: staff.role } : undefined}
          onLogout={onLogout}
        />
      )}
      <RightColumn>
        <TopBar title={pageTitle} themeMode={mode} onThemeToggle={toggleTheme} />
        <MainContent>
          {children}
        </MainContent>
      </RightColumn>
    </LayoutContainer>
  );
};
