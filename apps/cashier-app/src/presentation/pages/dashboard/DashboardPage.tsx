import React, { useState } from 'react';
import './DashboardPage.css';
import { Button } from '../../components/Button';
import { SyncProductUseCase } from '../../../application/use-cases/SyncProductUseCase';
import { ApiProductRepository } from '../../../data/repositories/ApiProductRepository';

// For simplicity, instantiating dependencies here.
const productRepository = new ApiProductRepository();

const syncProductUseCase = new SyncProductUseCase(productRepository);

interface DashboardPageProps {
  onLogout: () => void;
  onNavigateToSell: () => void;
  onNavigateToCreateUser: () => void;
  onNavigateToUserList: () => void;
  onNavigateToTransactionList: () => void;
  user: { uid: string; username: string; role: string; accessToken: string } | null;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ 
  onLogout, 
  onNavigateToSell, 
  onNavigateToCreateUser,
  onNavigateToUserList,
  onNavigateToTransactionList,
  user 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSyncProduct = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const result = await syncProductUseCase.execute();
      setMessage({ text: `Products synced! ${result.count} items updated.`, type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to sync products', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <h2>Lightning POS Dashboard</h2>
        </div>
        <div className="user-info">
          {user && (
            <div className="user-indicator">
              <span className="user-icon">👤</span>
              <div className="user-details">
                <span className="username">{user.username}</span>
                <span className={`role-badge ${user.role}`}>{user.role}</span>
              </div>
            </div>
          )}
          <Button variant="danger" onClick={onLogout}>Logout</Button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-grid">
          <div className="dashboard-card" onClick={onNavigateToCreateUser}>
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            </div>
            <h3>Create New User</h3>
            <p>Generate a temporary user ID for new employees.</p>
          </div>

          <div className="dashboard-card" onClick={onNavigateToUserList}>
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3>Manage Users</h3>
            <p>View and manage all employees in the system.</p>
          </div>

          <div className="dashboard-card" onClick={onNavigateToTransactionList}>
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <h3>Transactions</h3>
            <p>View sales history, payment methods, and statuses.</p>
          </div>

          <div className="dashboard-card" onClick={handleSyncProduct}>
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <h3>Sync Product</h3>
            <p>Update product list and pricing from the server.</p>
          </div>

          <div className="dashboard-card sell-card" onClick={onNavigateToSell}>
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <h3>Sell</h3>
            <p>Switch to Cashier mode and start processing orders.</p>
          </div>
        </div>

        {message && (
          <div className={`status-message ${message.type}`}>
            {message.text}
          </div>
        )}

        {isLoading && <div className="loading-overlay">Processing...</div>}
      </main>
    </div>
  );
};
