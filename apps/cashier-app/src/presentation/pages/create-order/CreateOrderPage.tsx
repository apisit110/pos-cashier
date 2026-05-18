import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { InputField } from '../../components/InputField';
import { Button } from '../../components/Button';
import { PageHeader } from '../../components/PageHeader';
import { ApiProductRepository } from '../../../data/repositories/ApiProductRepository';
import { ApiMemberRepository } from '../../../data/repositories/ApiMemberRepository';
import { ApiOrderRepository } from '../../../data/repositories/ApiOrderRepository';
import { ScanProductUseCase } from '../../../application/use-cases/ScanProductUseCase';
import { Product } from '../../../domain/entities/Product';
import { Member } from '../../../domain/entities/Member';
import { IdentifyMemberUseCase } from '../../../application/use-cases/IdentifyMemberUseCase';
import type { PromotionResult } from '../../../application/use-cases/CalculatePromotionUseCase';
import { PaymentModal } from '../../components/PaymentModal';
import { DataTable, type Column } from '../../components/DataTable';

// Styled Components


const scanSuccess = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  50% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
  100% { transform: scale(1); }
`;

const rowIn = keyframes`
  from { opacity: 0; transform: translateX(-10px); background: rgba(16, 185, 129, 0.1); }
  to { opacity: 1; transform: translateX(0); background: transparent; }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${({ theme }) => theme.semantics.colors.bg.main};
  color: ${({ theme }) => theme.semantics.colors.text.primary};
`;

const Main = styled.main`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const ScannerPanel = styled.aside`
  width: 320px;
  border-right: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background: linear-gradient(to bottom, ${({ theme }) => theme.semantics.colors.bg.main} 0%, rgba(99, 102, 241, 0.05) 100%);
  overflow-y: auto;

  h3 {
    color: ${({ theme }) => theme.semantics.colors.text.primary};
    font-size: 0.75rem;
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

const ScannerBox = styled.div<{ $isScanning?: boolean; $flash?: boolean }>`
  background: ${({ theme }) => theme.semantics.colors.bg.card};
  border: 1px dashed ${({ theme }) => theme.semantics.colors.border.subtle};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1.25rem 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  transition: ${({ theme }) => theme.transitions.default};
  animation: ${({ $flash }) => $flash ? css`${scanSuccess} 0.5s ease-out` : 'none'};

  ${({ $isScanning, theme }) => $isScanning && css`
    border-color: ${theme.semantics.colors.accent.primary};
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  `}

  svg {
    width: 32px;
    height: 32px;
    color: ${({ theme }) => theme.semantics.colors.accent.primary};
    opacity: 0.8;
  }

  p {
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
    font-size: 0.8125rem;
  }
`;

const TablePanel = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.semantics.colors.bg.main};
  overflow: hidden; 
  min-height: 0; /* Crucial: allows flex child to shrink and scroll */

  .table-header {
    padding: 1.5rem 1.5rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
    }

    .item-count {
      font-size: 0.875rem;
      color: ${({ theme }) => theme.semantics.colors.text.secondary};
    }
  }

  /* Row animations for the DataTable */
  tr.new-item {
    animation: ${rowIn} 0.5s ease-out;
  }
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding: 0 1.5rem 2rem;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.semantics.colors.border.subtle};
    border-radius: 10px;
    &:hover { background: ${({ theme }) => theme.semantics.colors.text.secondary}; }
  }
`;

const QtyControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;

  .qty-btn {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
    background: rgba(255, 255, 255, 0.03);
    color: ${({ theme }) => theme.semantics.colors.text.primary};
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: ${({ theme }) => theme.semantics.colors.accent.primary};
      border-color: ${({ theme }) => theme.semantics.colors.accent.primary};
      color: white;
    }
  }

  .qty-val {
    min-width: 20px;
    text-align: center;
    font-weight: 600;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 1.5rem;
  margin: auto; /* Centers in ScrollArea flexbox */
  color: ${({ theme }) => theme.semantics.colors.text.secondary};

  svg {
    width: 48px;
    height: 48px;
    color: ${({ theme }) => theme.semantics.colors.border.subtle};
    margin-bottom: 1rem;
  }
`;

const OrderSummary = styled.div`
  padding: 1rem 1.5rem; /* Reduced vertical padding to maximize list space */
  background: ${({ theme }) => theme.semantics.colors.bg.card};
  border-top: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.15); /* Stronger shadow to define the 'top' layer */
  z-index: 10; /* Ensure it stays above the scroll area visually */

  .summary-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 300px;
    align-self: flex-end;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 1rem;
    color: ${({ theme }) => theme.semantics.colors.text.secondary};

    &.total {
      font-size: 1.75rem;
      font-weight: 700;
      color: ${({ theme }) => theme.semantics.colors.accent.primary};
      border-top: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
      padding-top: 0.75rem;
      margin-top: 0.25rem;
    }
  }

  .shortcut-hint {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
    text-align: center;
    margin-top: 0.5rem;
    opacity: 0.9; /* Increased for accessibility */
    font-weight: 500;
    kbd {
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: inherit;
      color: ${({ theme }) => theme.semantics.colors.text.primary};
    }
  }
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

interface CreateOrderPageProps {
  onBack: () => void;
  onLogout?: () => void;
  staff: { uid: string; username: string; role: string; accessToken: string } | null;
}

export const CreateOrderPage: React.FC<CreateOrderPageProps> = ({ onBack, onLogout, staff }) => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [memberInput, setMemberInput] = useState('');
  const [member, setMember] = useState<Member | null>(null);
  const [promotionResult, setPromotionResult] = useState<PromotionResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanFlash, setScanFlash] = useState(false);
  const [lastScannedId, setLastScannedId] = useState<string | null>(null);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [isIdentifyingMember, setIsIdentifyingMember] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const memberInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Senior UX: Auto-scroll to bottom when items are added
  useEffect(() => {
    if (scrollAreaRef.current && items.length > 0) {
      const scrollContainer = scrollAreaRef.current;
      // Use requestAnimationFrame to ensure DOM is updated and animation frame is ready
      requestAnimationFrame(() => {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth'
        });
      });
    }
  }, [items.length]);

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

    // If a new item is scanned while the success modal is open, auto-reset and continue.
    if (isPaymentModalOpen && isPaymentSuccess) {
      handlePaymentSuccess();
    }

    setIsScanning(true);
    setError(null);
    try {
      const product = await scanUseCase.execute(barcode.trim());
      setLastScannedId(product.id);
      setScanFlash(true);
      setTimeout(() => setScanFlash(false), 500);

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
      
      // Payment Shortcut: Space (if not typing in input)
      if (e.code === 'Space' && target.tagName !== 'INPUT' && items.length > 0 && !isPaymentModalOpen) {
        e.preventDefault();
        setIsPaymentModalOpen(true);
        return;
      }

      // Scanner Logic: If focused on any input, let the browser/form handle the keys.
      if (target.tagName === 'INPUT') return;
      
      if (isPaymentModalOpen && !isPaymentSuccess) return;
      
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

  const handleUpdateQty = (productId: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

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

  const handleProcessPayment = async (method: 'CASH', receivedAmount?: number) => {
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

  const columns: Column<OrderItem>[] = [
    {
      header: 'Product',
      key: 'product',
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500 }}>
          <div style={{ width: 40, height: 40, background: 'rgba(99, 102, 241, 0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          </div>
          {item.product.name}
        </div>
      )
    },
    {
      header: 'Barcode',
      key: 'barcode',
      render: (item) => <code style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 4px', borderRadius: 4 }}>{item.product.barcode}</code>
    },
    {
      header: 'Price',
      key: 'price',
      textAlign: 'right',
      render: (item) => `$${item.product.price.toFixed(2)}`
    },
    {
      header: 'Qty',
      key: 'quantity',
      textAlign: 'right',
      width: '120px',
      render: (item) => (
        <QtyControls>
          <button className="qty-btn" onClick={() => handleUpdateQty(item.product.id, -1)}>−</button>
          <span className="qty-val">{item.quantity}</span>
          <button className="qty-btn" onClick={() => handleUpdateQty(item.product.id, 1)}>+</button>
        </QtyControls>
      )
    },
    {
      header: 'Total',
      key: 'total',
      textAlign: 'right',
      render: (item) => <span style={{ fontWeight: 600 }}>${(item.product.price * item.quantity).toFixed(2)}</span>
    },
    {
      header: '',
      key: 'actions',
      textAlign: 'right',
      width: '50px',
      render: (item) => (
        <button 
          onClick={() => handleRemove(item.product.id)}
          style={{ background: 'none', border: 'none', color: 'var(--color-error, #ef4444)', cursor: 'pointer', padding: 8 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      )
    }
  ];



  const total = promotionResult?.finalTotal ?? items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <Container>
      <PageHeader
        title="POS Terminal"
        onBack={onBack}
        user={staff}
        onLogout={onLogout}
        extraContent={null}
      />

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
                <Button 
                  type="submit" 
                  variant="secondary"
                  isLoading={isIdentifyingMember} 
                  style={{ marginTop: '0.5rem' }}
                >
                  Identify
                </Button>
              </form>
            )}
          </MemberSection>

          <ScannerSection>
            <h3>Scan Product</h3>
            <ScannerBox $isScanning={isScanning} $flash={scanFlash}>
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
              {error && <span style={{ color: 'var(--color-error, #ef4444)', fontSize: '0.875rem' }}>{error}</span>}
              <Button type="submit" isLoading={isScanning} style={{ marginTop: '0.5rem' }}>
                Add Product
              </Button>
            </form>
            <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--color-text-secondary, #94a3b8)', fontStyle: 'italic' }}>
              Hint: Use demo barcode <strong>8850123456789</strong> or <strong>1234567890123</strong>
            </div>
          </ScannerSection>
        </ScannerPanel>

        <TablePanel>
          <div className="table-header">
            <h3>Current Order</h3>
            <span className="item-count">{items.length} items</span>
          </div>

          <ScrollArea ref={scrollAreaRef}>
            <DataTable
              columns={columns}
              data={items}
              rowKey={(item) => item.product.id}
              getRowClassName={(item) => lastScannedId === item.product.id ? 'new-item' : ''}
              stickyHeader
              emptyState={
                <EmptyState>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  <p>No products added yet. Scan a product to begin.</p>
                </EmptyState>
              }
            />
          </ScrollArea>

          <OrderSummary>
            <div className="summary-content">
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
                style={{ height: 56, fontSize: '1.125rem', fontWeight: 600 }}
              >
                Proceed to Payment
              </Button>
              <div className="shortcut-hint">
                Press <kbd>Space</kbd> to pay
              </div>
            </div>
          </OrderSummary>
        </TablePanel>
      </Main>

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={total}
        onPaymentSuccess={handlePaymentSuccess}
        onProcessPayment={handleProcessPayment}
        onStepChange={(step) => setIsPaymentSuccess(step === 'success')}
      />
    </Container>
  );
};
