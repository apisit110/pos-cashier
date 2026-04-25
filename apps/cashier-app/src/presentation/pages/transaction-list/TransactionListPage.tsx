import React, { useState, useEffect, useCallback } from 'react';
import './TransactionListPage.css';
import type { GetTransactionsUseCase } from '../../../application/use-cases/GetTransactionsUseCase';
import type { Transaction } from '../../../domain/repositories/TransactionRepository';

interface TransactionListPageProps {
  onBack: () => void;
  getTransactionsUseCase: GetTransactionsUseCase;
}

export const TransactionListPage: React.FC<TransactionListPageProps> = ({ onBack, getTransactionsUseCase }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 10;

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getTransactionsUseCase.execute(currentPage, limit);
      setTransactions(result.transactions);
      setTotal(result.total);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getTransactionsUseCase, currentPage, limit]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="transaction-list-container">
      <header className="transaction-list-header">
        <div className="header-left">
          <button className="back-button" onClick={onBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Dashboard
          </button>
          <h2>Transactions History</h2>
        </div>
        <div className="header-right">
          <span className="total-count">Total: {total} Transactions</span>
        </div>
      </header>

      <main className="transaction-list-content">
        <div className="table-container">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Order No.</th>
                <th>Date & Time</th>
                <th>Staff</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="loading-cell">
                    <div className="table-loader"></div>
                    Loading transactions...
                  </td>
                </tr>
              ) : transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="orderNo-cell">{tx.orderNumber}</td>
                    <td className="date-cell">{new Date(tx.createdAt).toLocaleString()}</td>
                    <td className="staff-cell">{tx.staffName}</td>
                    <td className="method-cell">
                      <span className={`method-badge ${tx.paymentMethod}`}>
                        {tx.paymentMethod.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="amount-cell">฿{tx.amount.toFixed(2)}</td>
                    <td className="status-cell">
                      <span className={`status-badge ${tx.status}`}>{tx.status}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="empty-cell">No transactions found.</td>
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
