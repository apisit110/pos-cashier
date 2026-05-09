import React from 'react';
import styled from 'styled-components';
import { Button } from './Button';

interface UserInfo {
  username: string;
  role: string;
}

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  user?: UserInfo | null;
  onLogout?: () => void;
  extraContent?: React.ReactNode;
  showLogo?: boolean;
}

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0.75rem 0 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: ${({ theme }) => theme.semantics.colors.text.primary};
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    color: ${({ theme }) => theme.semantics.colors.accent.primary};
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.semantics.colors.text.secondary};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: ${({ theme }) => theme.transitions.default};
  padding: 0;

  &:hover {
    color: ${({ theme }) => theme.semantics.colors.text.primary};
  }

  svg {
    width: 20px;
    height: 20px;
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

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  onBack,
  user,
  onLogout,
  extraContent,
  showLogo = true,
}) => {
  return (
    <StyledHeader>
      <HeaderLeft>
        {onBack ? (
          <BackButton onClick={onBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </BackButton>
        ) : showLogo ? (
          <Brand>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </Brand>
        ) : null}
        <h2>{title}</h2>
      </HeaderLeft>

      <HeaderRight>
        {extraContent}
        {user && (
          <UserIndicator>
            <span className="user-icon">👤</span>
            <div className="user-details">
              <span className="username">{user.username}</span>
              <span className={`role-badge ${user.role}`}>{user.role}</span>
            </div>
          </UserIndicator>
        )}
        {onLogout && (
          <Button variant="danger" onClick={onLogout} style={{ width: 'auto' }}>
            Logout
          </Button>
        )}
      </HeaderRight>
    </StyledHeader>
  );
};
