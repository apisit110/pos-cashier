import React, { useState, useEffect, useCallback } from 'react';
import './UserListPage.css';
import type { GetUsersUseCase } from '../../../application/use-cases/GetUsersUseCase';
import type { User } from '../../../domain/repositories/UserRepository';

interface UserListPageProps {
  onBack: () => void;
  getUsersUseCase: GetUsersUseCase;
}

export const UserListPage: React.FC<UserListPageProps> = ({ onBack, getUsersUseCase }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 10;

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getUsersUseCase.execute(currentPage, limit);
      setUsers(result.users);
      setTotal(result.total);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getUsersUseCase, currentPage, limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="user-list-container">
      <header className="user-list-header">
        <div className="header-left">
          <button className="back-button" onClick={onBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Dashboard
          </button>
          <h2>Manage Users</h2>
        </div>
        <div className="header-right">
          <span className="total-count">Total: {total} Users</span>
        </div>
      </header>

      <main className="user-list-content">
        <div className="table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Full Name</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="loading-cell">
                    <div className="table-loader"></div>
                    Loading users...
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="userId-cell">{user.userId}</td>
                    <td className="name-cell">{user.fullName}</td>
                    <td className="role-cell">
                      <span className={`role-badge ${user.roleId === 1 ? 'manager' : 'cashier'}`}>
                        {user.roleId === 1 ? '🛡️ Manager' : '💰 Cashier'}
                      </span>
                    </td>
                    <td className="status-cell">
                      <span className="status-badge active">Active</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="empty-cell">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="page-btn" 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </button>
            <div className="page-info">
              Page {currentPage} of {totalPages}
            </div>
            <button 
              className="page-btn" 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isLoading}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
