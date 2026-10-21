import React, { useState, useRef, useEffect } from 'react';
import { InputField, Button, PageHeader, DataTable, type Column } from '@apisit110/pos-ui';
import { Container } from './Container';
import { Main } from './Main';
import { SidePanel } from './SidePanel';
import { CashKeypad } from './CashKeypad';
import { MemberSection } from './MemberSection';
import { MemberCard } from './MemberCard';
import { TablePanel } from './TablePanel';
import { ScrollArea } from './ScrollArea';
import { QtyControls } from './QtyControls';
import { EmptyState } from './EmptyState';
import { ApiProductRepository } from '../../../infrastructure/repositories/ApiProductRepository';
import { ApiMemberRepository } from '../../../infrastructure/repositories/ApiMemberRepository';
import { ApiOrderRepository } from '../../../infrastructure/repositories/ApiOrderRepository';
import { ScanProductUseCase } from '../../../domain/use-cases/ScanProductUseCase';
import { Product } from '../../../domain/entities/Product';
import { Member } from '../../../domain/entities/Member';
import { IdentifyMemberUseCase } from '../../../domain/use-cases/IdentifyMemberUseCase';
import type { PromotionResult } from '../../../domain/use-cases/CalculatePromotionUseCase';
import { useTranslation } from '../../i18n/LanguageContext';
import { keyCodeToChar } from './keyCodeToChar';
import { formatAmount } from '../../utils/formatAmount';

interface OrderItem {
  product: Product;
  quantity: number;
}

const productRepository = new ApiProductRepository();
const memberRepository = new ApiMemberRepository();
const orderRepository = new ApiOrderRepository();

const scanUseCase = new ScanProductUseCase(productRepository);
const identifyMemberUseCase = new IdentifyMemberUseCase(memberRepository);

// Member system temporarily hidden from UI
const SHOW_MEMBER_SECTION = false;

interface CreateOrderPageProps {
  onBack?: () => void;
  onLogout?: () => void;
  staff: { uid: string; username: string; role: string; accessToken: string } | null;
}

export const CreateOrderPage: React.FC<CreateOrderPageProps> = ({ onBack, onLogout, staff }) => {
  const { t } = useTranslation();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [memberInput, setMemberInput] = useState('');
  const [member, setMember] = useState<Member | null>(null);
  const [promotionResult, setPromotionResult] = useState<PromotionResult | null>(null);
  const [lastScannedId, setLastScannedId] = useState<string | null>(null);
  const [isIdentifyingMember, setIsIdentifyingMember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receivedInput, setReceivedInput] = useState('');
  // Stays the same across retries of one checkout attempt (e.g. network timeout, double-submit)
  // so the backend can dedupe instead of charging/creating an order twice. Cleared whenever the
  // modal (re)opens for a fresh cart.
  const checkoutIdempotencyKeyRef = useRef<string | null>(null);

  const receivedInputRef = useRef<HTMLInputElement>(null);
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

  const performScan = async (barcode: string) => {
    if (!barcode.trim()) return;

    setError(null);
    try {
      const product = await scanUseCase.execute(barcode.trim());
      setLastScannedId(product.id);

      setItems((prev) => {
        const existingItem = prev.find(i => i.product.id === product.id);
        if (existingItem) {
          return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
        }
        return [...prev, { product, quantity: 1 }];
      });
    } catch (err: any) {
      setError(err.message || t.createOrder.errorProductNotFound);
    }
  };

  useEffect(() => {
    let buffer = '';
    let lastKeyTime = Date.now();
    // Value of the focused input before the first key of the current burst; the first scanner
    // character can't be told apart from human typing, so it leaks into the input and is rolled back.
    let valueBeforeBurst = '';
    const setInputValue = (input: HTMLInputElement, value: string) => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    };
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const input = target.tagName === 'INPUT' ? (target as HTMLInputElement) : null;

      const currentTime = Date.now();
      const isFast = currentTime - lastKeyTime <= 50;
      lastKeyTime = currentTime;
      if (!isFast) {
        buffer = '';
        if (input) valueBeforeBurst = input.value;
      }

      if (e.code === 'Enter' || e.code === 'NumpadEnter') {
        if (buffer.length >= 3) {
          e.preventDefault();
          e.stopPropagation();
          if (input) setInputValue(input, valueBeforeBurst);
          performScan(buffer);
          buffer = '';
        } else if (!input && items.length > 0) {
          e.preventDefault();
          receivedInputRef.current?.focus();
        }
      } else {
        const char = keyCodeToChar(e.code, e.shiftKey);
        if (char) {
          buffer += char;
          // Fast follow-up characters are scanner input: keep them out of the input.
          if (input && isFast && buffer.length > 1) e.preventDefault();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown, true);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown, true);
  }, [items]);

  const handleUpdateQty = (productId: string, delta: number) => {
    setItems(prev => prev.flatMap(item => {
      if (item.product.id === productId) {
        if (item.quantity + delta < 1) return [];
        return [{ ...item, quantity: item.quantity + delta }];
      }
      return [item];
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
  const handlePaymentSuccess = () => {
    setItems([]);
    setMember(null);
    setPromotionResult(null);
    setError(null);
    setReceivedInput('');
    checkoutIdempotencyKeyRef.current = null;
  };

  const handleCheckout = async () => {
    const received = Number(receivedInput) || 0;
    if (items.length === 0) return;
    if (received < total) {
      setError(t.createOrder.errorInsufficientAmount);
      return;
    }
    if (!checkoutIdempotencyKeyRef.current) {
      checkoutIdempotencyKeyRef.current = crypto.randomUUID();
    }
    try {
      await orderRepository.checkout({
        items: items.map(i => ({
          productId: i.product.id,
          quantity: i.quantity,
          price: i.product.price
        })),
        memberId: member?.id,
        paymentMethod: 'CASH',
        receivedAmount: received,
        idempotencyKey: checkoutIdempotencyKeyRef.current
      });
      handlePaymentSuccess();
    } catch (err: any) {
      setError(err.message || t.createOrder.errorInsufficientAmount);
    }
  };
  const columns: Column<OrderItem>[] = [
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
      render: (item) => formatAmount(item.product.price, '฿')
    },
    {
      header: t.createOrder.columnTotal,
      key: 'total',
      textAlign: 'right',
      render: (item) => <span style={{ fontWeight: 600 }}>{formatAmount(item.product.price * item.quantity, '฿')}</span>
    }
  ];

  const total = promotionResult?.finalTotal ?? items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <Container>
      <PageHeader
        title={t.createOrder.title}
        onBack={onBack}
        user={staff}
        onLogout={onLogout}
        logoutLabel={t.mainLayout.logout}
        extraContent={null}
      />

      <Main>
        <TablePanel>
          {error && <div className="table-error">{error}</div>}

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
        </TablePanel>

        <SidePanel>
          {SHOW_MEMBER_SECTION && (
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
          )}

          <CashKeypad total={total} value={receivedInput} onChange={setReceivedInput} onSubmit={handleCheckout} inputRef={receivedInputRef} disabled={items.length === 0} />
        </SidePanel>
      </Main>

    </Container>
  );
};
