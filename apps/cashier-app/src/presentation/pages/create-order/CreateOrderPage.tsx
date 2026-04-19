import React, { useState, useRef, useEffect } from 'react';
import './CreateOrderPage.css';
import { InputField } from '../../components/InputField';
import { Button } from '../../components/Button';
import { ApiProductRepository } from '../../../data/repositories/ApiProductRepository';
import { ApiMemberRepository } from '../../../data/repositories/ApiMemberRepository';
import { ApiOrderRepository } from '../../../data/repositories/ApiOrderRepository';
import { ScanProductUseCase } from '../../../application/use-cases/ScanProductUseCase';
import { SyncProductsUseCase } from '../../../application/use-cases/SyncProductsUseCase';
import { Product } from '../../../domain/entities/Product';
import { Member } from '../../../domain/entities/Member';
import { IdentifyMemberUseCase } from '../../../application/use-cases/IdentifyMemberUseCase';
import type { PromotionResult } from '../../../application/use-cases/CalculatePromotionUseCase';
import { PaymentModal } from '../../components/PaymentModal';

interface OrderItem {
  product: Product;
  quantity: number;
}

// In a real app, DI handles this.
const productRepository = new ApiProductRepository();
const memberRepository = new ApiMemberRepository();
const orderRepository = new ApiOrderRepository();

const scanUseCase = new ScanProductUseCase(productRepository);
const identifyMemberUseCase = new IdentifyMemberUseCase(memberRepository);
const syncUseCase = new SyncProductsUseCase(productRepository);

interface CreateOrderPageProps {
  onLogout?: () => void;
  user: { uid: string; username: string; accessToken: string } | null;
}

export const CreateOrderPage: React.FC<CreateOrderPageProps> = ({ onLogout, user }) => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [memberInput, setMemberInput] = useState('');
  const [member, setMember] = useState<Member | null>(null);
  const [promotionResult, setPromotionResult] = useState<PromotionResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isIdentifyingMember, setIsIdentifyingMember] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const memberInputRef = useRef<HTMLInputElement>(null);

  // Recalculate promotions whenever items or member changes (via API)
  useEffect(() => {
    if (items.length === 0) {
      setPromotionResult(null);
      return;
    }

    const abortController = new AbortController();
    
    const calculate = async () => {
      try {
        const itemDtos = items.map(i => ({
          productId: i.product.id,
          quantity: i.quantity,
          price: i.product.price
        }));
        
        const result = await orderRepository.calculatePromotions(itemDtos, member?.id);
        setPromotionResult(result);
      } catch (err) {
        console.error('Promotion calculation failed:', err);
      }
    };

    calculate();
    return () => abortController.abort();
  }, [items, member]);

  // Focus the scanner input on mount to be ready for physical scanners
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const performScan = async (barcode: string) => {
    if (!barcode.trim()) return;

    setIsScanning(true);
    setError(null);

    try {
      const product = await scanUseCase.execute(barcode.trim());
      
      setItems((prev) => {
        const existingItem = prev.find(i => i.product.id === product.id);
        if (existingItem) {
          return prev.map(i => 
            i.product.id === product.id 
              ? { ...i, quantity: i.quantity + 1 } 
              : i
          );
        }
        return [...prev, { product, quantity: 1 }];
      });
      
      setBarcodeInput('');
    } catch (err: any) {
      setError(err.message || 'Product not found.');
    } finally {
      setIsScanning(false);
      // Try to re-focus the manual input for convenience
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    await performScan(barcodeInput);
  };

  // Global Barcode Scanner Listener
  useEffect(() => {
    let buffer = '';
    let lastKeyTime = Date.now();

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if focus is in an input field (optional, but safer for manual entry)
      // However, if we want "Zero Focus" scanning, we should allow it if document.activeElement is body
      // or if it's not the Member ID input.
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' && target !== inputRef.current) {
        // If focused on another input (like Member ID), don't steal the input
        return;
      }

      // If a modal is open, don't scan
      if (isPaymentModalOpen) return;

      const currentTime = Date.now();
      
      // If interval between keys > 50ms, it's likely human typing, so reset buffer
      // Scanners usually send characters within 1-10ms of each other
      if (currentTime - lastKeyTime > 50) {
        buffer = '';
      }
      
      lastKeyTime = currentTime;

      if (e.key === 'Enter') {
        if (buffer.length >= 3) {
          e.preventDefault();
          performScan(buffer);
          buffer = '';
        }
      } else if (e.key.length === 1) {
        buffer += e.key;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [items, isPaymentModalOpen]); // Dependencies ensure we have latest state access

  const handleIdentifyMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberInput.trim()) return;

    setIsIdentifyingMember(true);
    setError(null);

    try {
      const foundMember = await identifyMemberUseCase.execute(memberInput.trim());
      if (foundMember) {
        setMember(foundMember);
        setMemberInput('');
      } else {
        setError('Member not found.');
      }
    } catch (err: any) {
      setError(err.message || 'Error identifying member.');
    } finally {
      setIsIdentifyingMember(false);
    }
  };

  const handleRemoveMember = () => {
    setMember(null);
  };

  const handleRemove = (productId: string) => {
    setItems((prev) => prev.filter(i => i.product.id !== productId));
  };

  const handlePaymentSuccess = () => {
    // Reset order
    setItems([]);
    setMember(null);
    setPromotionResult(null);
    setBarcodeInput('');
    setError(null);
  };

  const handleProcessPayment = async (method: 'CASH' | 'CREDIT' | 'QR', receivedAmount?: number) => {
    const itemDtos = items.map(i => ({
      productId: i.product.id,
      quantity: i.quantity,
      price: i.product.price
    }));

    return await orderRepository.checkout({
      items: itemDtos,
      memberId: member?.id,
      paymentMethod: method,
      receivedAmount
    });
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setError(null);
    setSyncMessage(null);

    try {
      const result = await syncUseCase.execute();
      if (result.success) {
        setSyncMessage(`Sync successful! ${result.count} products updated.`);
        // Auto-clear message after 3 seconds
        setTimeout(() => setSyncMessage(null), 3000);
      } else {
        setError('Sync failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Error during sync.');
    } finally {
      setIsSyncing(false);
    }
  };

  const total = promotionResult?.finalTotal ?? items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <div className="create-order-container">
      <header className="create-order-header">
        <div className="brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <h2>Lightning POS</h2>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {syncMessage && <span className="sync-success-msg">{syncMessage}</span>}
          <Button 
            variant="secondary" 
            onClick={handleSync} 
            isLoading={isSyncing}
            disabled={isSyncing}
          >
            Sync Products
          </Button>
          {user && (
            <div className="user-indicator">
              <span className="user-icon">👤</span>
              <span className="username">{user.username}</span>
            </div>
          )}
          <Button variant="danger" onClick={onLogout}>Logout</Button>
        </div>
      </header>

      <main className="order-main">
        <aside className="order-scanner-panel">
          <div className="member-section">
            <h3>Member</h3>
            {member ? (
              <div className="member-card">
                <div className="member-info">
                  <span className="member-name">{member.fullName}</span>
                  <div className="member-sub-info">
                    <span className="member-points">{member.points} points</span>
                  </div>
                </div>
                <button className="remove-member-btn" onClick={handleRemoveMember}>&times;</button>
              </div>
            ) : (
              <form onSubmit={handleIdentifyMember} className="member-entry">
                <InputField
                  label="Member ID"
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  placeholder="Enter Member ID (M001-M003)"
                  disabled={isIdentifyingMember}
                  ref={memberInputRef}
                />
                <Button type="submit" isLoading={isIdentifyingMember} style={{ marginTop: '8px' }}>
                  Identify
                </Button>
              </form>
            )}
          </div>

            <div className="scanner-section">
              <h3>Scan Product</h3>
              
              <div className={`scanner-box ${isScanning ? 'scanning' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
                <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
                <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
                <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
                <path d="M8 7v10"></path>
                <path d="M12 7v10"></path>
                <path d="M16 7v10"></path>
              </svg>
              <p>Ready to scan barcode...</p>
            </div>

            <div className="manual-entry">
              <form onSubmit={handleScan}>
                <InputField
                  label="Manual Barcode Entry"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="Enter barcode (e.g. 8850123456789)"
                  disabled={isScanning}
                  ref={inputRef}
                />
              {error && <span style={{ color: '#ef4444', fontSize: '14px' }}>{error}</span>}
                <Button type="submit" isLoading={isScanning} style={{ width: '100%', marginTop: '8px' }}>
                  Add Product
                </Button>
              </form>
            <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text)' }}>
              <i>Hint: Use demo barcode <strong>8850123456789</strong> or <strong>1234567890123</strong></i>
            </div>
            </div>
          </div>
        </aside>

        <section className="order-table-panel">
          <div className="table-header">
            <h3>Current Order</h3>
            <span className="item-count">{items.length} items</span>
          </div>

          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Barcode</th>
                  <th className="number-col">Price</th>
                  <th className="number-col">Qty</th>
                  <th className="number-col">Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="9" cy="21" r="1"></circle>
                          <circle cx="20" cy="21" r="1"></circle>
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        <p>No products added yet. Scan a product to begin.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.product.id}>
                      <td className="product-cell">
                        <div style={{ width: 40, height: 40, background: 'var(--accent-bg)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                        </div>
                        {item.product.name}
                      </td>
                      <td><code>{item.product.barcode}</code></td>
                      <td className="number-col">${item.product.price.toFixed(2)}</td>
                      <td className="number-col">
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 20, padding: '4px 12px' }}>
                          <span>{item.quantity}</span>
                        </div>
                      </td>
                      <td className="number-col font-medium text-h">${(item.product.price * item.quantity).toFixed(2)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button 
                          onClick={() => handleRemove(item.product.id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 8 }}
                          title="Remove item"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="order-summary">
            <div className="summary-row">
              <span>Promo</span>
              <span></span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Button 
              className="checkout-btn" 
              style={{ height: 48, fontSize: 16 }}
              disabled={items.length === 0}
              onClick={() => setIsPaymentModalOpen(true)}
            >
              Proceed to Payment
            </Button>
          </div>
        </section>
      </main>

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={total}
        onPaymentSuccess={handlePaymentSuccess}
        onProcessPayment={handleProcessPayment}
      />
    </div>
  );
};
