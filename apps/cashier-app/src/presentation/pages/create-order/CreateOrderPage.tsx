import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
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

// Styled Components
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${({ theme }) => theme.semantics.colors.bg.main};
  color: ${({ theme }) => theme.semantics.colors.text.primary};
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  background: ${({ theme }) => theme.semantics.colors.bg.main};

  .brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    h2 {
      margin: 0;
      font-size: 1.25rem;
      letter-spacing: -0.5px;
      font-weight: 600;
    }
  }
`;

const UserIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: ${({ theme }) => theme.semantics.colors.bg.card};
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  font-size: 0.875rem;

  .user-icon {
    font-size: 1rem;
  }

  .user-details {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }

  .username {
    font-weight: 600;
    color: ${({ theme }) => theme.semantics.colors.accent.primary};
  }

  .role-badge {
    font-size: 0.625rem;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 0.05em;
    
    &.manager {
      color: ${({ theme }) => theme.semantics.colors.accent.primary};
    }
    
    &.cashier {
      color: ${({ theme }) => theme.semantics.colors.text.secondary};
    }
  }
`;

const Main = styled.main`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const ScannerPanel = styled.aside`
  width: 350px;
  border-right: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: linear-gradient(to bottom, ${({ theme }) => theme.semantics.colors.bg.main} 0%, rgba(99, 102, 241, 0.05) 100%);

  h3 {
    color: ${({ theme }) => theme.semantics.colors.text.primary};
    font-size: 0.875rem;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: 0.7;
  }
`;

const MemberSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
`;

const MemberCard = styled.div`
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid ${({ theme }) => theme.semantics.colors.accent.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .member-info {
    display: flex;
    flex-direction: column;
  }

  .member-name {
    font-weight: 600;
  }

  .member-sub-info {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .member-points {
    font-size: 0.75rem;
    font-weight: 600;
    background: ${({ theme }) => theme.semantics.colors.bg.main};
    padding: 0.125rem 0.5rem;
    border-radius: 4px;
    color: ${({ theme }) => theme.semantics.colors.accent.primary};
  }

  .remove-btn {
    background: none;
    border: none;
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
    font-size: 1.25rem;
    cursor: pointer;
    padding: 4px;
    &:hover { color: ${({ theme }) => theme.semantics.colors.text.error}; }
  }
`;

const ScannerSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ScannerBox = styled.div<{ $isScanning?: boolean }>`
  background: ${({ theme }) => theme.semantics.colors.bg.card};
  border: 1px dashed ${({ theme }) => theme.semantics.colors.border.subtle};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 2rem 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  transition: ${({ theme }) => theme.transitions.default};

  ${({ $isScanning, theme }) => $isScanning && css`
    border-color: ${theme.semantics.colors.accent.primary};
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  `}

  svg {
    width: 48px;
    height: 48px;
    color: ${({ theme }) => theme.semantics.colors.accent.primary};
    opacity: 0.8;
  }

  p {
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
    font-size: 0.875rem;
  }
`;

const TablePanel = styled.section`
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.semantics.colors.bg.main};
  overflow-y: auto;

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
    }

    .item-count {
      font-size: 0.875rem;
      color: ${({ theme }) => theme.semantics.colors.text.secondary};
    }
  }
`;

const TableWrapper = styled.div`
  background: ${({ theme }) => theme.semantics.colors.bg.card};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th, td {
    padding: 1rem;
    border-bottom: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  }

  th {
    font-weight: 500;
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
    background: rgba(255, 255, 255, 0.02);
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
  }

  td {
    color: ${({ theme }) => theme.semantics.colors.text.primary};
    font-size: 0.875rem;
    vertical-align: middle;
  }

  .product-cell {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 500;
  }

  .number-col {
    text-align: right;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 1.5rem;
  color: ${({ theme }) => theme.semantics.colors.text.secondary};

  svg {
    width: 48px;
    height: 48px;
    color: ${({ theme }) => theme.semantics.colors.border.subtle};
    margin-bottom: 1rem;
  }
`;

const OrderSummary = styled.div`
  margin-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  padding-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 300px;
  align-self: flex-end;

  .summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 1rem;
    color: ${({ theme }) => theme.semantics.colors.text.secondary};

    &.total {
      font-size: 1.5rem;
      font-weight: 700;
      color: ${({ theme }) => theme.semantics.colors.text.primary};
      border-top: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
      padding-top: 0.75rem;
      margin-top: 0.25rem;
    }
  }
`;

const SyncBadge = styled.span`
  font-size: 0.8125rem;
  color: #10b981;
  font-weight: 500;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  animation: ${fadeIn} 0.3s ease-out;
`;

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
  user: { uid: string; username: string; role: string; accessToken: string } | null;
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

  useEffect(() => {
    if (items.length === 0) {
      setPromotionResult(null);
      return;
    }

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
  }, [items, member]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
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
          return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
        }
        return [...prev, { product, quantity: 1 }];
      });
      setBarcodeInput('');
    } catch (err: any) {
      setError(err.message || 'Product not found.');
    } finally {
      setIsScanning(false);
      if (inputRef.current) inputRef.current.focus();
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    await performScan(barcodeInput);
  };

  useEffect(() => {
    let buffer = '';
    let lastKeyTime = Date.now();
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' && target !== inputRef.current) return;
      if (isPaymentModalOpen) return;
      const currentTime = Date.now();
      if (currentTime - lastKeyTime > 50) buffer = '';
      lastKeyTime = currentTime;
      if (e.key === 'Enter') {
        if (buffer.length >= 3) {
          e.preventDefault();
          performScan(buffer);
          buffer = '';
        }
      } else if (e.key.length === 1) buffer += e.key;
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [items, isPaymentModalOpen]);

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

  const handleRemoveMember = () => setMember(null);
  const handleRemove = (productId: string) => setItems((prev) => prev.filter(i => i.product.id !== productId));
  const handlePaymentSuccess = () => {
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
        setTimeout(() => setSyncMessage(null), 3000);
      } else setError('Sync failed.');
    } catch (err: any) {
      setError(err.message || 'Error during sync.');
    } finally {
      setIsSyncing(false);
    }
  };

  const total = promotionResult?.finalTotal ?? items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <Container>
      <Header>
        <div className="brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <h2>Lightning POS</h2>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {syncMessage && <SyncBadge>{syncMessage}</SyncBadge>}
          <Button variant="secondary" onClick={handleSync} isLoading={isSyncing} disabled={isSyncing} style={{ width: 'auto' }}>
            Sync Products
          </Button>
          {user && (
            <UserIndicator>
              <span className="user-icon">👤</span>
              <div className="user-details">
                <span className="username">{user.username}</span>
                <span className={`role-badge ${user.role}`}>{user.role}</span>
              </div>
            </UserIndicator>
          )}
          <Button variant="danger" onClick={onLogout} style={{ width: 'auto' }}>Logout</Button>
        </div>
      </Header>

      <Main>
        <ScannerPanel>
          <MemberSection>
            <h3>Member</h3>
            {member ? (
              <MemberCard>
                <div className="member-info">
                  <span className="member-name">{member.fullName}</span>
                  <div className="member-sub-info">
                    <span className="member-points">{member.points} points</span>
                  </div>
                </div>
                <button className="remove-btn" onClick={handleRemoveMember}>&times;</button>
              </MemberCard>
            ) : (
              <form onSubmit={handleIdentifyMember}>
                <InputField
                  label="Member ID"
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  placeholder="Enter Member ID (M001-M003)"
                  disabled={isIdentifyingMember}
                  ref={memberInputRef}
                />
                <Button type="submit" isLoading={isIdentifyingMember} style={{ marginTop: '0.5rem' }}>
                  Identify
                </Button>
              </form>
            )}
          </MemberSection>

          <ScannerSection>
            <h3>Scan Product</h3>
            <ScannerBox $isScanning={isScanning}>
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
            </ScannerBox>

            <form onSubmit={handleScan}>
              <InputField
                label="Manual Barcode Entry"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="Enter barcode (e.g. 8850123456789)"
                disabled={isScanning}
                ref={inputRef}
              />
              {error && <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</span>}
              <Button type="submit" isLoading={isScanning} style={{ marginTop: '0.5rem' }}>
                Add Product
              </Button>
            </form>
            <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
              Hint: Use demo barcode <strong>8850123456789</strong> or <strong>1234567890123</strong>
            </div>
          </ScannerSection>
        </ScannerPanel>

        <TablePanel>
          <div className="table-header">
            <h3>Current Order</h3>
            <span className="item-count">{items.length} items</span>
          </div>

          <TableWrapper>
            <Table>
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
                      <EmptyState>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="9" cy="21" r="1"></circle>
                          <circle cx="20" cy="21" r="1"></circle>
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        <p>No products added yet. Scan a product to begin.</p>
                      </EmptyState>
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.product.id}>
                      <td className="product-cell">
                        <div style={{ width: 40, height: 40, background: 'rgba(99, 102, 241, 0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                        </div>
                        {item.product.name}
                      </td>
                      <td><code style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 4px', borderRadius: 4 }}>{item.product.barcode}</code></td>
                      <td className="number-col">${item.product.price.toFixed(2)}</td>
                      <td className="number-col">{item.quantity}</td>
                      <td className="number-col" style={{ fontWeight: 600 }}>${(item.product.price * item.quantity).toFixed(2)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button 
                          onClick={() => handleRemove(item.product.id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 8 }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </TableWrapper>

          <OrderSummary>
            <div className="summary-row">
              <span>Promo</span>
              <span>-</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Button 
              disabled={items.length === 0}
              onClick={() => setIsPaymentModalOpen(true)}
              style={{ height: 48, fontSize: '1rem' }}
            >
              Proceed to Payment
            </Button>
          </OrderSummary>
        </TablePanel>
      </Main>

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={total}
        onPaymentSuccess={handlePaymentSuccess}
        onProcessPayment={handleProcessPayment}
      />
    </Container>
  );
};
