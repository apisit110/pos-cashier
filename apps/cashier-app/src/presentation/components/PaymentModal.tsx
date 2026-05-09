import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Button } from './Button';
import { InputField } from './InputField';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalContent = styled.div`
  width: 100%;
  max-width: 480px;
  background-color: ${({ theme }) => theme.semantics.colors.bg.card};
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  border-radius: ${({ theme }) => theme.borderRadius.xxl};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.premium};
  animation: ${scaleIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
`;

const ModalHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .close-btn {
    background: none;
    border: none;
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
    font-size: 1.5rem;
    cursor: pointer;
    line-height: 1;
    &:hover { color: ${({ theme }) => theme.semantics.colors.text.primary}; }
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const TotalToPay = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: 1.5rem;

  span {
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
    font-size: 0.875rem;
  }

  .amount {
    color: ${({ theme }) => theme.semantics.colors.text.primary};
    font-size: 1.5rem;
    font-weight: 700;
  }
`;

const PaymentMethods = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const MethodBtn = styled.button<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${({ theme }) => theme.semantics.colors.bg.card};
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.semantics.colors.text.primary};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  text-align: left;
  font-weight: 500;

  svg {
    width: 24px;
    height: 24px;
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
    transition: ${({ theme }) => theme.transitions.default};
  }

  &:hover {
    border-color: ${({ theme }) => theme.semantics.colors.accent.primary};
    background: rgba(99, 102, 241, 0.05);
  }

  ${({ $isActive, theme }) => $isActive && css`
    border-color: ${theme.semantics.colors.accent.primary};
    background: rgba(99, 102, 241, 0.1);
    box-shadow: 0 0 0 1px ${theme.semantics.colors.accent.primary};

    svg {
      color: ${theme.semantics.colors.accent.primary};
    }
  `}
`;

const SuccessView = styled.div`
  text-align: center;
  padding: 1rem 0;

  .success-icon {
    width: 64px;
    height: 64px;
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    svg { width: 32px; height: 32px; }
  }

  h3 { margin-bottom: 1rem; font-size: 1.5rem; }

  .change-display {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-bottom: 2rem;
    span { color: ${({ theme }) => theme.semantics.colors.text.secondary}; font-size: 0.875rem; }
    .change-amount { color: #10b981; font-size: 2rem; font-weight: 700; }
  }
`;

const ProcessingView = styled.div`
  text-align: center;
  padding: 2rem 0;

  .spinner {
    width: 48px;
    height: 48px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top-color: ${({ theme }) => theme.semantics.colors.accent.primary};
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
    margin: 0 auto 1.5rem;
  }

  p { color: ${({ theme }) => theme.semantics.colors.text.secondary}; }
`;

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onPaymentSuccess: () => void;
  onProcessPayment: (method: 'CASH', receivedAmount?: number) => Promise<any>;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  totalAmount, 
  onPaymentSuccess,
  onProcessPayment 
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash'>('cash');
  const [cashReceived, setCashReceived] = useState<string>('');
  const [step, setStep] = useState<'selection' | 'processing' | 'success'>('selection');
  const [change, setChange] = useState<number>(0);
  const [isCalculated, setIsCalculated] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('selection');
      setCashReceived('');
      setPaymentMethod('cash');
      setIsCalculated(false);
    }
  }, [isOpen]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const received = parseFloat(cashReceived);
    if (isNaN(received) || received < totalAmount) {
      alert('จำนวนเงินไม่ถูกต้อง');
      return;
    }
    setChange(received - totalAmount);
    setIsCalculated(true);
  };

  const handleConfirmPayment = async () => {
    const received = parseFloat(cashReceived);
    setStep('processing');
    try {
      const response = await onProcessPayment('CASH', received);
      setChange(response.changeAmount || (received - totalAmount));
      setStep('success');
    } catch (err: any) {
      alert(`ชำระเงินไม่สำเร็จ: ${err.message}`);
      setStep('selection');
    }
  };



  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContent>
        <ModalHeader>
          <h3>Payment</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </ModalHeader>

        <ModalBody>
          {step === 'selection' && (
            <div>
              <TotalToPay>
                <span>Amount Due</span>
                <span className="amount">${totalAmount.toFixed(2)}</span>
              </TotalToPay>

              <PaymentMethods>
                <MethodBtn 
                  $isActive={paymentMethod === 'cash'}
                  onClick={() => setPaymentMethod('cash')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
                  Cash
                </MethodBtn>
              </PaymentMethods>

              {paymentMethod === 'cash' && (
                <div>
                  <form onSubmit={handleCalculate}>
                    <InputField
                      label="Cash Received"
                      value={cashReceived}
                      onChange={(e) => {
                        setCashReceived(e.target.value);
                        setIsCalculated(false);
                      }}
                      type="number"
                      placeholder="0.00"
                      autoFocus
                    />
                    {!isCalculated ? (
                      <Button type="submit" disabled={!cashReceived || parseFloat(cashReceived) < totalAmount}>
                        Calculate Change
                      </Button>
                    ) : (
                      <div style={{ marginTop: '1.5rem', animation: 'fadeIn 0.3s ease-out' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', marginBottom: '1.5rem' }}>
                          <span style={{ color: '#94a3b8' }}>Change to return</span>
                          <span style={{ color: '#10b981', fontWeight: 700, fontSize: '1.25rem' }}>${change.toFixed(2)}</span>
                        </div>
                        <Button onClick={handleConfirmPayment}>
                          Confirm Payment
                        </Button>
                      </div>
                    )}
                  </form>
                </div>
              )}
            </div>
          )}

          {step === 'processing' && (
            <ProcessingView>
              <div className="spinner"></div>
              <p>Opening drawer...</p>
            </ProcessingView>
          )}

          {step === 'success' && (
            <SuccessView>
              <div className="success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h3>Payment Successful</h3>
              <div className="change-display">
                <span>Change Amount</span>
                <span className="change-amount">${change.toFixed(2)}</span>
              </div>
              <Button onClick={() => { onPaymentSuccess(); onClose(); }}>
                Complete & Print Receipt
              </Button>
            </SuccessView>
          )}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};
