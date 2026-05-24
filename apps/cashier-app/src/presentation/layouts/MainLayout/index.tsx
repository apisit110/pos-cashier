import React from 'react';
import { LayoutContainer } from './LayoutContainer';
import { Sidebar } from './Sidebar';
import { Logo } from './Logo';
import { Nav } from './Nav';
import { NavItem } from './NavItem';
import { UserProfile } from './UserProfile';
import { UserInfo } from './UserInfo';
import { LogoutButton } from './LogoutButton';
import { MainContent } from './MainContent';

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
  return (
    <LayoutContainer>
      {currentView !== 'create-order' && (
        <Sidebar>
          <Logo>
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <span className="logo-text">Lightning POS</span>
          </Logo>

          <Nav>
            {staff?.role === 'manager' && (
              <NavItem
                $active={currentView === 'dashboard'}
                onClick={() => onNavigate('dashboard')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                <span className="nav-label">Dashboard</span>
              </NavItem>
            )}

            <NavItem
              $active={currentView === 'create-order'}
              onClick={() => onNavigate('create-order')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span className="nav-label">POS Terminal</span>
            </NavItem>

            {staff?.role === 'manager' && (
              <NavItem
                $active={currentView === 'transaction-list'}
                onClick={() => onNavigate('transaction-list')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                <span className="nav-label">Transactions</span>
              </NavItem>
            )}

            {staff?.role === 'manager' && (
              <>
                <NavItem
                  $active={currentView === 'product-list'}
                  onClick={() => onNavigate('product-list')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                  <span className="nav-label">Products</span>
                </NavItem>

                <NavItem
                  $active={currentView === 'staff-list' || currentView === 'create-staff'}
                  onClick={() => onNavigate('staff-list')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span className="nav-label">Staffs</span>
                </NavItem>
              </>
            )}
          </Nav>

          <UserProfile>
            <UserInfo>
              <div className="avatar">
                {staff?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="details">
                <span className="name">{staff?.username}</span>
                <span className="role">{staff?.role}</span>
              </div>
            </UserInfo>
            <LogoutButton onClick={onLogout}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className="label">Logout</span>
            </LogoutButton>
          </UserProfile>
        </Sidebar>
      )}
      <MainContent style={{ width: currentView === 'create-order' ? '100%' : 'auto' }}>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};
