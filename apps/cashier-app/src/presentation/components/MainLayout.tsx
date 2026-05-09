import React from 'react';
import styled from 'styled-components';

interface NavItemProps {
  $active?: boolean;
}

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.semantics.colors.bg.main};
`;

const Sidebar = styled.aside`
  width: 280px;
  background: ${({ theme }) => theme.semantics.colors.bg.card};
  border-right: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 50;

  @media (max-width: 768px) {
    width: 80px;
    padding: 1.5rem 1rem;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
  padding: 0 0.5rem;

  .logo-icon {
    width: 40px;
    height: 40px;
    background: ${({ theme }) => theme.semantics.colors.accent.primary};
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: ${({ theme }) => theme.shadows.accent};

    svg {
      width: 24px;
      height: 24px;
    }
  }

  .logo-text {
    font-size: 1.25rem;
    font-weight: 800;
    color: ${({ theme }) => theme.semantics.colors.text.primary};
    letter-spacing: -0.02em;

    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const Nav = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NavItem = styled.button<NavItemProps>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  border: none;
  background: ${({ $active }) => $active ? 'rgba(99, 102, 241, 0.1)' : 'transparent'};
  color: ${({ theme, $active }) => $active ? theme.semantics.colors.accent.primary : theme.semantics.colors.text.secondary};
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  width: 100%;
  text-align: left;

  &:hover {
    background: rgba(99, 102, 241, 0.05);
    color: ${({ theme }) => theme.semantics.colors.accent.primary};
  }

  svg {
    width: 22px;
    height: 22px;
  }

  .nav-label {
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const UserProfile = styled.div`
  margin-top: auto;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 0.5rem;

  .avatar {
    width: 40px;
    height: 40px;
    background: ${({ theme }) => theme.semantics.colors.bg.main};
    border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: ${({ theme }) => theme.semantics.colors.accent.primary};
  }

  .details {
    display: flex;
    flex-direction: column;
    overflow: hidden;

    @media (max-width: 768px) {
      display: none;
    }

    .name {
      font-size: 0.875rem;
      font-weight: 600;
      color: ${({ theme }) => theme.semantics.colors.text.primary};
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .role {
      font-size: 0.75rem;
      color: ${({ theme }) => theme.semantics.colors.text.secondary};
      text-transform: capitalize;
    }
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  background: transparent;
  color: ${({ theme }) => theme.semantics.colors.text.secondary};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    border-color: #ef4444;
    color: #ef4444;
    background: rgba(239, 68, 68, 0.05);
  }

  @media (max-width: 768px) {
    justify-content: center;
    padding: 0.75rem;
    
    .label {
      display: none;
    }
  }
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  position: relative;
`;

interface MainLayoutProps {
  children: React.ReactNode;
  currentView: string;
  user: { username: string; role: string } | null;
  onNavigate: (view: any) => void;
  onLogout: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  currentView, 
  user, 
  onNavigate,
  onLogout 
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
              $active={currentView === 'user-list' || currentView === 'create-user'} 
              onClick={() => onNavigate('user-list')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className="nav-label">Users</span>
            </NavItem>
          </Nav>

          <UserProfile>
            <UserInfo>
              <div className="avatar">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="details">
                <span className="name">{user?.username}</span>
                <span className="role">{user?.role}</span>
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
