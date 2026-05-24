import React, { useState, useEffect } from 'react';
import { Button, PageHeader, PinInputField } from '@apisit110/pos-ui';
import { Container } from './Container';
import { FormContent } from './FormContent';
import { Form } from './Form';
import { FormGroup } from './FormGroup';
import { StaffIdGroup } from './StaffIdGroup';
import { RoleOptions } from './RoleOptions';
import { RoleOption } from './RoleOption';
import { StatusMessage } from './StatusMessage';
import type { CreateStaffUseCase } from '../../../application/use-cases/CreateStaffUseCase';
import type { SyncStaffUseCase } from '../../../application/use-cases/SyncStaffUseCase';

interface CreateStaffPageProps {
  onBack: () => void;
  createStaffUseCase: CreateStaffUseCase;
  syncStaffUseCase: SyncStaffUseCase;
}

export const CreateStaffPage: React.FC<CreateStaffPageProps> = ({ onBack, createStaffUseCase, syncStaffUseCase }) => {
  const [fullName, setFullName] = useState('');
  const [staffId, setStaffId] = useState('');
  const [pin, setPin] = useState('');
  const [roleId, setRoleId] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const generateStaffId = () => {
    const id = `TEMP_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    setStaffId(id);
  };

  useEffect(() => { generateStaffId(); }, []);

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
      const newStaff = await createStaffUseCase.execute({ fullName, roleId, userId: staffId, pin });
      await syncStaffUseCase.execute();
      setMessage({
        text: `Staff "${newStaff.fullName}" created successfully! Staff ID: ${newStaff.userId}. Data synced to cloud.`,
        type: 'success',
      });
      setFullName(''); setPin(''); setRoleId(2); generateStaffId();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to create staff', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <PageHeader
        title="Create New Staff"
        onBack={onBack}
      />

      <FormContent>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="staffId">Staff ID (Generated)</label>
            <StaffIdGroup>
              <input
                id="staffId"
                type="text"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                placeholder="Staff ID"
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className="regenerate-button"
                onClick={generateStaffId}
                disabled={isLoading}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 4v6h-6" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
              </button>
            </StaffIdGroup>
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
            {isLoading ? 'Creating...' : 'Create & Sync Staff'}
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
