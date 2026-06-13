import React, { useState } from 'react';
import { Button, InputField, PageHeader } from '@apisit110/pos-ui';
import { Container } from '../create-staff/Container';
import { FormContent } from '../create-staff/FormContent';
import { Form } from '../create-staff/Form';
import { StatusMessage } from '../create-staff/StatusMessage';
import type { CreateProductUseCase } from '../../../domain/use-cases/CreateProductUseCase';

interface CreateProductPageProps {
  onBack: () => void;
  createProductUseCase: CreateProductUseCase;
}

export const CreateProductPage: React.FC<CreateProductPageProps> = ({ onBack, createProductUseCase }) => {
  const [barcode, setBarcode] = useState('');
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode.trim()) {
      setMessage({ text: 'Please enter a barcode', type: 'error' });
      return;
    }
    if (!name.trim()) {
      setMessage({ text: 'Please enter a product name', type: 'error' });
      return;
    }
    const parsedPrice = parseFloat(price);
    if (!price || isNaN(parsedPrice) || parsedPrice < 0) {
      setMessage({ text: 'Please enter a valid price', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage(null);
    try {
      const product = await createProductUseCase.execute({
        barcode: barcode.trim(),
        name: name.trim(),
        brand: brand.trim() || undefined,
        price: parsedPrice,
      });
      setMessage({ text: `Product "${product.name}" created successfully!`, type: 'success' });
      setBarcode('');
      setName('');
      setBrand('');
      setPrice('');
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to create product', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <PageHeader title="Create New Product" onBack={onBack} />

      <FormContent>
        <Form onSubmit={handleSubmit}>
          <InputField
            label="Barcode"
            id="barcode"
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Enter product barcode"
            disabled={isLoading}
            required
          />

          <InputField
            label="Product Name"
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            disabled={isLoading}
            required
          />

          <InputField
            label="Brand"
            id="brand"
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Enter brand (optional)"
            disabled={isLoading}
          />

          <InputField
            label="Price"
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            disabled={isLoading}
            required
          />

          <Button type="submit" disabled={isLoading} style={{ marginTop: '1rem' }}>
            {isLoading ? 'Creating...' : 'Create Product'}
          </Button>
        </Form>

        {message && (
          <StatusMessage $type={message.type}>
            {message.type === 'success' ? '✅ ' : '❌ '}
            {message.text}
          </StatusMessage>
        )}
      </FormContent>
    </Container>
  );
};
