import React, { useState } from 'react';
import './CreateUserPage.css';
import { Button } from '../../components/Button';
import type { CreateUserUseCase } from '../../../application/use-cases/CreateUserUseCase';
import type { SyncUserUseCase } from '../../../application/use-cases/SyncUserUseCase';

interface CreateUserPageProps {
  onBack: () => void;
  createUserUseCase: CreateUserUseCase;
  syncUserUseCase: SyncUserUseCase;
}

export const CreateUserPage: React.FC<CreateUserPageProps> = ({ onBack, createUserUseCase, syncUserUseCase }) => {
  const [fullName, setFullName] = useState('');
  const [roleId, setRoleId] = useState(2); // Default to Cashier
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setMessage({ text: 'Please enter a full name', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // 1. Create User (Saves to local/mock repo)
      const newUser = await createUserUseCase.execute({ fullName, roleId });
      
      // 2. Sync User (Calls mock sync)
      await syncUserUseCase.execute();

      setMessage({ 
        text: `User "${newUser.fullName}" created successfully! User ID: ${newUser.userId}. Data synced to cloud.`, 
        type: 'success' 
      });
      setFullName('');
      setRoleId(2);
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to create user', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-user-container">
      <header className="create-user-header">
        <div className="header-left">
          <button className="back-button" onClick={onBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Dashboard
          </button>
          <h2>Create New User</h2>
        </div>
      </header>

      <main className="create-user-content">
        <form className="create-user-form" onSubmit={handleSubmit}>
          <div className="form-group">
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
          </div>

          <div className="form-group">
            <label>Role</label>
            <div className="role-options">
              <label className={`role-option ${roleId === 1 ? 'selected' : ''}`}>
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
                    <span className="role-desc">Full access to dashboard and settings</span>
                  </div>
                </div>
              </label>

              <label className={`role-option ${roleId === 2 ? 'selected' : ''}`}>
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
                    <span className="role-desc">Access to POS and order processing</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create & Sync User'}
            </Button>
          </div>
        </form>

        {message && (
          <div className={`status-message ${message.type}`}>
            {message.type === 'success' ? '✅ ' : '❌ '}
            {message.text}
          </div>
        )}
      </main>
    </div>
  );
};
