import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Button } from '../../components/Button';
import { PageHeader } from '../../components/PageHeader';
import { PinInputField } from '../../components/PinInputField';
import type { CreateUserUseCase } from '../../../application/use-cases/CreateUserUseCase';
import type { SyncUserUseCase } from '../../../application/use-cases/SyncUserUseCase';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.semantics.colors.bg.main};
  color: ${({ theme }) => theme.semantics.colors.text.primary};
  padding: 2rem;
`;

const FormContent = styled.main`
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: ${({ theme }) => theme.semantics.colors.bg.card};
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.xxl};
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
  }

  input[type="text"] {
    padding: 0.75rem 1rem;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    color: ${({ theme }) => theme.semantics.colors.text.primary};
    outline: none;
    transition: ${({ theme }) => theme.transitions.default};

    &:focus {
      border-color: ${({ theme }) => theme.semantics.colors.accent.primary};
      background: rgba(15, 23, 42, 0.8);
    }
  }
`;

const UserIdGroup = styled.div`
  display: flex;
  gap: 0.5rem;

  input { flex: 1; }

  .regenerate-button {
    background: ${({ theme }) => theme.semantics.colors.bg.card};
    border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
    padding: 0 0.75rem;
    cursor: pointer;
    transition: ${({ theme }) => theme.transitions.default};

    &:hover {
      border-color: ${({ theme }) => theme.semantics.colors.accent.primary};
      color: ${({ theme }) => theme.semantics.colors.text.primary};
    }

    svg { width: 18px; height: 18px; }
  }
`;

const RoleOptions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const RoleOption = styled.label<{ $selected?: boolean }>`
  cursor: pointer;
  
  input { display: none; }

  .role-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: rgba(15, 23, 42, 0.4);
    border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    transition: ${({ theme }) => theme.transitions.default};

    .role-icon { font-size: 1.5rem; }

    .role-info {
      display: flex;
      flex-direction: column;
      .role-name { font-weight: 600; }
      .role-desc { font-size: 0.75rem; color: ${({ theme }) => theme.semantics.colors.text.secondary}; }
    }
  }

  ${({ $selected, theme }) => $selected && css`
    .role-card {
      background: rgba(99, 102, 241, 0.1);
      border-color: ${theme.semantics.colors.accent.primary};
    }
  `}

  &:hover .role-card {
    border-color: ${({ theme }) => theme.semantics.colors.accent.primary};
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

interface CreateUserPageProps {
  onBack: () => void;
  createUserUseCase: CreateUserUseCase;
  syncUserUseCase: SyncUserUseCase;
}

export const CreateUserPage: React.FC<CreateUserPageProps> = ({ onBack, createUserUseCase, syncUserUseCase }) => {
  const [fullName, setFullName] = useState('');
  const [userId, setUserId] = useState('');
  const [pin, setPin] = useState('');
  const [roleId, setRoleId] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const generateUserId = () => {
    const id = `TEMP_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    setUserId(id);
  };

  useEffect(() => { generateUserId(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setMessage({ text: 'Please enter a full name', type: 'error' });
      return;
    }
    if (!pin.trim() || pin.length < 4) {
      setMessage({ text: 'Please enter a valid PIN (at least 4 digits)', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage(null);
    try {
      const newUser = await createUserUseCase.execute({ fullName, roleId, userId, pin });
      await syncUserUseCase.execute();
      setMessage({ 
        text: `User "${newUser.fullName}" created successfully! User ID: ${newUser.userId}. Data synced to cloud.`, 
        type: 'success' 
      });
      setFullName(''); setPin(''); setRoleId(2); generateUserId();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to create user', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <PageHeader 
        title="Create New User"
        onBack={onBack}
      />

      <FormContent>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="userId">User ID (Generated)</label>
            <UserIdGroup>
              <input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="User ID"
                disabled={isLoading}
                required
              />
              <button 
                type="button" 
                className="regenerate-button" 
                onClick={generateUserId}
                disabled={isLoading}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 4v6h-6" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
              </button>
            </UserIdGroup>
          </FormGroup>

          <FormGroup>
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter employee full name"
              disabled={isLoading}
              required
            />
          </FormGroup>

          <PinInputField
            label="PIN Code (6 digits)"
            length={6}
            value={pin}
            onChange={setPin}
            disabled={isLoading}
          />

          <FormGroup>
            <label>Role</label>
            <RoleOptions>
              <RoleOption $selected={roleId === 1}>
                <input
                  type="radio"
                  name="role"
                  value={1}
                  checked={roleId === 1}
                  onChange={() => setRoleId(1)}
                  disabled={isLoading}
                />
                <div className="role-card">
                  <span className="role-icon">🛡️</span>
                  <div className="role-info">
                    <span className="role-name">Manager</span>
                    <span className="role-desc">Full access to dashboard</span>
                  </div>
                </div>
              </RoleOption>

              <RoleOption $selected={roleId === 2}>
                <input
                  type="radio"
                  name="role"
                  value={2}
                  checked={roleId === 2}
                  onChange={() => setRoleId(2)}
                  disabled={isLoading}
                />
                <div className="role-card">
                  <span className="role-icon">💰</span>
                  <div className="role-info">
                    <span className="role-name">Cashier</span>
                    <span className="role-desc">Access to POS</span>
                  </div>
                </div>
              </RoleOption>
            </RoleOptions>
          </FormGroup>

          <Button type="submit" disabled={isLoading} style={{ marginTop: '1rem' }}>
            {isLoading ? 'Creating...' : 'Create & Sync User'}
          </Button>
        </Form>

        {message && (
          <StatusMessage $type={message.type}>
            {message.type === 'success' ? '✅ ' : '❌ '}
            {message.text}
          </StatusMessage>
        )}
      </FormContent>
    </Container>
  );
};
