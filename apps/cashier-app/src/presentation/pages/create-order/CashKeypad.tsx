import React from 'react';
import styled from 'styled-components';
import { useTranslation } from '../../i18n/LanguageContext';
import { formatAmount } from '../../utils/formatAmount';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
  min-height: 0;

  .summary {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 1rem;
    color: ${({ theme }) => theme.semantics.colors.text.primary};
  }

  .amount {
    font-size: 1.5rem;
    font-weight: 600;
  }

  .received-value {
    margin-top: auto;
    width: 100%;
    box-sizing: border-box;
    font-family: inherit;
    padding: 0.75rem 1rem;
    text-align: right;
    font-size: 1.75rem;
    font-weight: 600;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
    color: ${({ theme }) => theme.semantics.colors.text.primary};
    background: ${({ theme }) => theme.semantics.colors.bg.main};
  }

  .keys {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
  }

  .key {
    padding: 1rem 0;
    font-size: 1.25rem;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
    color: ${({ theme }) => theme.semantics.colors.text.primary};
    background: ${({ theme }) => theme.semantics.colors.bg.main};
  }

  .key:active {
    opacity: 0.7;
  }

  .key.confirm {
    color: #fff;
    border-color: #16a34a;
    background: #16a34a;
  }

  .key.cancel {
    color: #fff;
    border-color: #eab308;
    background: #eab308;
  }

  .key.delete {
    color: #fff;
    border-color: #dc2626;
    background: #dc2626;
  }

  .key.cancel:disabled,
  .key.delete:disabled,
  .key.confirm:disabled {
    color: #9ca3af;
    border-color: #d1d5db;
    background: #e5e7eb;
    cursor: not-allowed;
    opacity: 1;
  }
`;

const sanitize = (raw: string): string => {
  const cleaned = raw.replace(/[^\d.]/g, '');
  const [int, ...rest] = cleaned.split('.');
  const next = rest.length ? `${int}.${rest.join('').slice(0, 2)}` : int;
  const trimmed = next.length > 1 && next[0] === '0' && next[1] !== '.' ? next.replace(/^0+(?=\d)/, '') : next;
  return trimmed.slice(0, 9);
};

interface CashKeypadProps {
  total: number;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  inputRef: React.Ref<HTMLInputElement>;
  disabled?: boolean;
}

export const CashKeypad: React.FC<CashKeypadProps> = ({ total, value, onChange, onSubmit, inputRef, disabled = false }) => {
  const { t } = useTranslation();
  const received = Number(value) || 0;
  const canPay = !disabled && received > 0 && received >= total;
  const press = (key: string) => {
    if (disabled) return;
    if (key === '.' && value === '') return onChange('0.');
    onChange(sanitize(value + key));
  };

  return (
    <Wrapper>
      <div className="summary">
        <div className="row">
          <span>{t.createOrder.amountDue}</span>
          <span className="amount">{formatAmount(total)}</span>
        </div>
        <div className="row">
          <span>{t.createOrder.receivedAmount}</span>
          <span className="amount">{formatAmount(received)}</span>
        </div>
        <div className="row">
          <span>{t.createOrder.change}</span>
          <span className="amount">{canPay ? formatAmount(received - total) : '-'}</span>
        </div>
      </div>

      <input
        ref={inputRef}
        className="received-value"
        inputMode="decimal"
        placeholder="0"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(sanitize(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (canPay) onSubmit();
          }
        }}
      />

      <div className="keys">
        {['7', '8', '9'].map((d) => <button key={d} type="button" className="key" disabled={disabled} onClick={() => press(d)}>{d}</button>)}
        <button type="button" className="key cancel" disabled={disabled} onClick={() => onChange('')}>{t.createOrder.clear}</button>
        {['4', '5', '6'].map((d) => <button key={d} type="button" className="key" disabled={disabled} onClick={() => press(d)}>{d}</button>)}
        <button type="button" className="key delete" disabled={disabled} onClick={() => onChange(value.slice(0, -1))}>{t.createOrder.delete}</button>
        {['1', '2', '3'].map((d) => <button key={d} type="button" className="key" disabled={disabled} onClick={() => press(d)}>{d}</button>)}
        <button type="button" className="key confirm" disabled={!canPay} onClick={onSubmit}>{t.createOrder.enter}</button>
        <span />
        <button type="button" className="key" disabled={disabled} onClick={() => press('0')}>0</button>
        <button type="button" className="key" disabled={disabled} onClick={() => press('.')}>.</button>
        <span />
      </div>
    </Wrapper>
  );
};
