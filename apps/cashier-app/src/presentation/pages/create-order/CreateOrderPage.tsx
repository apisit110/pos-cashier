import React, { useState, useRef, useEffect } from 'react';
import { InputField, Button, PageHeader, PaymentModal, DataTable, type Column } from '@apisit110/pos-ui';
import { Container } from './Container';
import { Main } from './Main';
import { ScannerPanel } from './ScannerPanel';
import { MemberSection } from './MemberSection';
import { MemberCard } from './MemberCard';
import { ScannerSection } from './ScannerSection';
import { ScannerBox } from './ScannerBox';
import { TablePanel } from './TablePanel';
import { ScrollArea } from './ScrollArea';
import { QtyControls } from './QtyControls';
import { EmptyState } from './EmptyState';
import { OrderSummary } from './OrderSummary';
import { ApiProductRepository } from '../../../infrastructure/repositories/ApiProductRepository';
import { ApiMemberRepository } from '../../../infrastructure/repositories/ApiMemberRepository';
import { ApiOrderRepository } from '../../../infrastructure/repositories/ApiOrderRepository';
import { ScanProductUseCase } from '../../../domain/use-cases/ScanProductUseCase';
import { Product } from '../../../domain/entities/Product';
import { Member } from '../../../domain/entities/Member';
import { IdentifyMemberUseCase } from '../../../domain/use-cases/IdentifyMemberUseCase';
import type { PromotionResult } from '../../../domain/use-cases/CalculatePromotionUseCase';

interface OrderItem {
  product: Product;
  quantity: number;
}

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

  useEffect(() => {
    if (scrollAreaRef.current && items.length > 0) {
      const scrollContainer = scrollAreaRef.current;
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

      if (e.code === 'Space' && target.tagName !== 'INPUT' && items.length > 0 && !isPaymentModalOpen) {
        e.preventDefault();
        setIsPaymentModalOpen(true);
        return;
      }

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
