import React, { useState } from 'react';
import { Button, InputField, PageHeader } from '@apisit110/pos-ui';
import { Container } from '../create-staff/Container';
import { FormContent } from '../create-staff/FormContent';
import { Form } from '../create-staff/Form';
import { Loading } from '../../components/Loading';
import { AlertDialog } from '../../components/AlertDialog';
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode.trim()) {
      setErrorMessage('Please enter a barcode');
      return;
    }
    if (!name.trim()) {
      setErrorMessage('Please enter a product name');
      return;
    }
    const parsedPrice = parseFloat(price);
    if (!price || isNaN(parsedPrice) || parsedPrice < 0) {
      setErrorMessage('Please enter a valid price');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      await createProductUseCase.execute({
        barcode: barcode.trim(),
        name: name.trim(),
        brand: brand.trim() || undefined,
        price: parsedPrice,
      });
      setBarcode('');
      setName('');
      setBrand('');
      setPrice('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <PageHeader title="Create New Product" onBack={onBack} />

      {isLoading && <Loading fullscreen label="Creating product..." />}

      <AlertDialog
        open={errorMessage !== null}
        title="Error"
        description={errorMessage ?? undefined}
        buttons={[{ label: 'OK', onClick: () => setErrorMessage(null), variant: 'primary' }]}
        onClose={() => setErrorMessage(null)}
      />

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
            autoComplete="off"
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
            autoComplete="off"
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
            autoComplete="off"
          />

          <InputField
            label="Price"
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            disabled={isLoading}
            autoComplete="off"
            required
          />

          <Button type="submit" disabled={isLoading} style={{ marginTop: '1rem' }}>
            Create Product
          </Button>
        </Form>
      </FormContent>
    </Container>
  );
};
