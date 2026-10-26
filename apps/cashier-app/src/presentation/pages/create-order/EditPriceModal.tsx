import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, InputField } from '@apisit110/pos-ui';
import type { Product } from '../../../domain/entities/Product';
import { useTranslation } from '../../i18n/LanguageContext';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  backdrop-filter: blur(4px);
`;

const Dialog = styled.form`
  background: ${({ theme }) => theme.semantics.colors.bg.card};
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  h2 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;
    color: ${({ theme }) => theme.semantics.colors.text.primary};
  }

  .product-name {
    margin: 0;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
  }

  .error {
    margin: 0;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.semantics.colors.status.error};
  }

  .actions {
    display: flex;
    gap: 0.625rem;
  }
`;

interface EditPriceModalProps {
  product: Product;
  onSave: (price: number) => Promise<void>;
  onClose: () => void;
}

export const EditPriceModal: React.FC<EditPriceModalProps> = ({ product, onSave, onClose }) => {
  const { t } = useTranslation();
  const [price, setPrice] = useState(product.price.toString());
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.select();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(price);
    if (!price || isNaN(parsedPrice) || parsedPrice < 0) {
      setError(t.createOrder.errorPriceInvalid);
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await onSave(parsedPrice);
    } catch (err: any) {
      setError(err.response?.data?.res_desc || err.message || t.createOrder.errorUpdatePrice);
      setIsSaving(false);
    }
  };

  return (
    <Overlay onClick={() => !isSaving && onClose()}>
      <Dialog onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2>{t.createOrder.editPriceTitle}</h2>
        <p className="product-name">{product.name}</p>
        <InputField
          label={t.createOrder.columnPrice}
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0.00"
          disabled={isSaving}
          ref={inputRef}
          required
        />
        {error && <p className="error">{error}</p>}
        <div className="actions">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving}>
            {t.createOrder.clear}
          </Button>
          <Button type="submit" isLoading={isSaving}>
            {t.createOrder.save}
          </Button>
        </div>
      </Dialog>
    </Overlay>
  );
};
