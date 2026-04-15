import React, { useState, useEffect } from 'react';
import './PaymentModal.css';
import { Button } from './Button';
import { InputField } from './InputField';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onPaymentSuccess: () => void;
  onProcessPayment: (method: 'CASH' | 'CREDIT' | 'QR', receivedAmount?: number) => Promise<any>;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  totalAmount, 
  onPaymentSuccess,
  onProcessPayment 
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit' | 'qr'>('cash');
  const [cashReceived, setCashReceived] = useState<string>('');
  const [step, setStep] = useState<'selection' | 'processing' | 'success'>('selection');
  const [change, setChange] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setStep('selection');
      setCashReceived('');
      setPaymentMethod('cash');
    }
  }, [isOpen]);

  const handleCashPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const received = parseFloat(cashReceived);
    if (isNaN(received) || received < totalAmount) {
      alert('จำนวนเงินไม่ถูกต้อง');
      return;
    }
    
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

  const handleOtherPayment = async () => {
    setStep('processing');
    try {
      await onProcessPayment(paymentMethod === 'credit' ? 'CREDIT' : 'QR');
      setStep('success');
    } catch (err: any) {
      alert(`ชำระเงินไม่สำเร็จ: ${err.message}`);
      setStep('selection');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <header className="modal-header">
          <h3>ชำระเงิน</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </header>

        <div className="modal-body">
          {step === 'selection' && (
            <div className="selection-view">
              <div className="total-to-pay">
                <span>ยอดที่ต้องชำระ</span>
                <span className="amount">${totalAmount.toFixed(2)}</span>
              </div>

              <div className="payment-methods">
                <button 
                  className={`method-btn ${paymentMethod === 'cash' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('cash')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
                  Cash
                </button>
                <button 
                  className={`method-btn ${paymentMethod === 'credit' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('credit')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                  Credit Card (EDC)
                </button>
                <button 
                  className={`method-btn ${paymentMethod === 'qr' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('qr')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                  QR PromptPay
                </button>
              </div>

              {paymentMethod === 'cash' ? (
                <form onSubmit={handleCashPayment} className="cash-form">
                  <InputField
                    label="จำนวนเงินที่รับมา"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    type="number"
                    placeholder="0.00"
                    autoFocus
                  />
                  <Button type="submit" disabled={!cashReceived || parseFloat(cashReceived) < totalAmount}>
                    ตกลงเพื่อยืนยัน (เปิดลิ้นชัก)
                  </Button>
                </form>
              ) : (
                <div className="other-payment-action">
                  <p>Follow instructions on the device.</p>
                  <Button onClick={handleOtherPayment}>
                    Start {paymentMethod === 'credit' ? 'EDC' : 'PromptPay'} Flow
                  </Button>
                </div>
              )}
            </div>
          )}

          {step === 'processing' && (
            <div className="processing-view">
              <div className="spinner"></div>
              <p>{paymentMethod === 'cash' ? 'กำลังเปิดลิ้นชัก...' : `กำลังดำเนินการ ${paymentMethod === 'credit' ? 'บัตรเครดิต' : 'QR PromptPay'}...`}</p>
            </div>
          )}

          {step === 'success' && (
            <div className="success-view">
              <div className="success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h3>ชำระเงินสำเร็จ</h3>
              {paymentMethod === 'cash' && (
                <div className="change-display">
                  <span>เงินทอน</span>
                  <span className="change-amount">${change.toFixed(2)}</span>
                </div>
              )}
              <Button onClick={() => { onPaymentSuccess(); onClose(); }}>
                เสร็จสิ้นและพิมพ์ใบเสร็จ
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
