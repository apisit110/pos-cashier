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
import { useTranslation } from '../../i18n/LanguageContext';
import { formatMessage } from '../../i18n/format';

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
  onBack?: () => void;
  onLogout?: () => void;
  staff: { uid: string; username: string; role: string; accessToken: string } | null;
}

export const CreateOrderPage: React.FC<CreateOrderPageProps> = ({ onBack, onLogout, staff }) => {
  const { t } = useTranslation();
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
  // Stays the same across retries of one checkout attempt (e.g. network timeout, double-submit)
  // so the backend can dedupe instead of charging/creating an order twice. Cleared whenever the
  // modal (re)opens for a fresh cart.
  const checkoutIdempotencyKeyRef = useRef<string | null>(null);

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
      setError(err.message || t.createOrder.errorProductNotFound);
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
        setError(t.createOrder.errorMemberNotFound);
      }
    } catch (err: any) {
      setError(err.message || t.createOrder.errorIdentifyMember);
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
    checkoutIdempotencyKeyRef.current = null;
  };

  const handleProcessPayment = async (method: 'CASH', receivedAmount?: number) => {
    if (!checkoutIdempotencyKeyRef.current) {
      checkoutIdempotencyKeyRef.current = crypto.randomUUID();
    }
    const itemDtos = items.map(i => ({
      productId: i.product.id,
      quantity: i.quantity,
      price: i.product.price
    }));
    return await orderRepository.checkout({
      items: itemDtos,
      memberId: member?.id,
      paymentMethod: method,
      receivedAmount,
      idempotencyKey: checkoutIdempotencyKeyRef.current
    });
  };

  const columns: Column<OrderItem>[] = [
    {
      header: t.createOrder.columnNumber,
      key: 'number',
      width: '48px',
      textAlign: 'center',
      render: (item) => <span style={{ color: 'var(--color-text-secondary, #94a3b8)' }}>{items.indexOf(item) + 1}</span>
    },
    {
      header: t.createOrder.columnBarcode,
      key: 'barcode',
      render: (item) => <code style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 4px', borderRadius: 4 }}>{item.product.barcode}</code>
    },
    {
      header: t.createOrder.columnName,
      key: 'name',
      render: (item) => <span style={{ fontWeight: 500 }}>{item.product.name}</span>
    },
    {
      header: t.createOrder.columnQty,
      key: 'quantity',
      textAlign: 'center',
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
      header: t.createOrder.columnPrice,
      key: 'price',
      textAlign: 'right',
      render: (item) => `$${item.product.price.toFixed(2)}`
    },
    {
      header: t.createOrder.columnTotal,
      key: 'total',
      textAlign: 'right',
      render: (item) => <span style={{ fontWeight: 600 }}>${(item.product.price * item.quantity).toFixed(2)}</span>
    },
    {
      header: t.createOrder.columnAction,
      key: 'actions',
      textAlign: 'center',
      width: '60px',
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

  const [scanHintBefore, scanHintMid, scanHintAfter] = t.createOrder.scanHint.split(/\{barcode1\}|\{barcode2\}/);
  const [shortcutHintBefore, shortcutHintAfter] = t.createOrder.shortcutHint.split('{key}');

  return (
    <Container>
      <PageHeader
        title={t.createOrder.title}
        onBack={onBack}
        user={staff}
        onLogout={onLogout}
        extraContent={null}
      />

      <Main>
        <ScannerPanel>
          <MemberSection>
            <h3>{t.createOrder.member}</h3>
            {member ? (
              <MemberCard>
                <div className="member-info">
                  <span className="member-name">{member.fullName}</span>
                  <div className="member-sub-info">
                    <span className="member-points">{member.points} {t.createOrder.points}</span>
                  </div>
                </div>
                <button className="remove-btn" onClick={handleRemoveMember}>&times;</button>
              </MemberCard>
            ) : (
              <form onSubmit={handleIdentifyMember}>
                <InputField
                  label={t.createOrder.memberId}
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  placeholder={t.createOrder.memberIdPlaceholder}
                  disabled={isIdentifyingMember}
                  ref={memberInputRef}
                />
                <Button
                  type="submit"
                  variant="secondary"
                  isLoading={isIdentifyingMember}
                  style={{ marginTop: '0.5rem' }}
                >
                  {t.createOrder.identify}
                </Button>
              </form>
            )}
          </MemberSection>

          <ScannerSection>
            <h3>{t.createOrder.scanProduct}</h3>
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
              <p>{t.createOrder.readyToScan}</p>
            </ScannerBox>

            <form onSubmit={handleScan}>
              <InputField
                label={t.createOrder.manualBarcodeEntry}
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder={t.createOrder.manualBarcodePlaceholder}
                disabled={isScanning}
                ref={inputRef}
              />
              {error && <span style={{ color: 'var(--color-error, #ef4444)', fontSize: '0.875rem' }}>{error}</span>}
              <Button type="submit" isLoading={isScanning} style={{ marginTop: '0.5rem' }}>
                {t.createOrder.addProduct}
              </Button>
            </form>
            <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--color-text-secondary, #94a3b8)', fontStyle: 'italic' }}>
              {scanHintBefore}<strong>8850123456789</strong>{scanHintMid}<strong>1234567890123</strong>{scanHintAfter}
            </div>
          </ScannerSection>
        </ScannerPanel>

        <TablePanel>
          <div className="table-header">
            <h3>{t.createOrder.currentOrder}</h3>
            <span className="item-count">{formatMessage(t.createOrder.itemsCount, { count: items.length })}</span>
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
                  <p>{t.createOrder.noProducts}</p>
                </EmptyState>
              }
            />
          </ScrollArea>

          <OrderSummary>
            <div className="summary-content">
              <div className="summary-row">
                <span>{t.createOrder.promo}</span>
                <span>-</span>
              </div>
              <div className="summary-row total">
                <span>{t.createOrder.total}</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Button
                disabled={items.length === 0}
                onClick={() => setIsPaymentModalOpen(true)}
                style={{ height: 56, fontSize: '1.125rem', fontWeight: 600 }}
              >
                {t.createOrder.proceedToPayment}
              </Button>
              <div className="shortcut-hint">
                {shortcutHintBefore}<kbd>Space</kbd>{shortcutHintAfter}
              </div>
            </div>
          </OrderSummary>
        </TablePanel>
      </Main>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          checkoutIdempotencyKeyRef.current = null;
        }}
        totalAmount={total}
        onPaymentSuccess={handlePaymentSuccess}
        onProcessPayment={handleProcessPayment}
        onStepChange={(step) => setIsPaymentSuccess(step === 'success')}
      />
    </Container>
  );
};
