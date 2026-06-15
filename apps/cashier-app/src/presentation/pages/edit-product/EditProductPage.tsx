import React, { useState } from 'react';
import { Button, InputField, PageHeader } from '@apisit110/pos-ui';
import { Container } from '../create-staff/Container';
import { FormContent } from '../create-staff/FormContent';
import { Form } from '../create-staff/Form';
import { Loading } from '../../components/Loading';
import { AlertDialog } from '../../components/AlertDialog';
import type { UpdateProductUseCase } from '../../../domain/use-cases/UpdateProductUseCase';
import type { Product } from '../../../domain/entities/Product';

interface EditProductPageProps {
  onBack: () => void;
  product: Product;
  updateProductUseCase: UpdateProductUseCase;
}

export const EditProductPage: React.FC<EditProductPageProps> = ({ onBack, product, updateProductUseCase }) => {
  const [name, setName] = useState(product.name);
  const [brand, setBrand] = useState(product.brand ?? '');
  const [price, setPrice] = useState(product.price.toString());
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      await updateProductUseCase.execute(product.id, {
        name: name.trim(),
        brand: brand.trim() || null,
        price: parsedPrice,
      });
      setSuccessMessage('Product updated successfully');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <PageHeader title="Edit Product" onBack={onBack} />

      {isLoading && <Loading fullscreen label="Updating product..." />}

      <AlertDialog
        open={errorMessage !== null}
        title="Error"
        description={errorMessage ?? undefined}
        buttons={[{ label: 'OK', onClick: () => setErrorMessage(null), variant: 'primary' }]}
        onClose={() => setErrorMessage(null)}
      />

      <AlertDialog
        open={successMessage !== null}
        title="Success"
        description={successMessage ?? undefined}
        buttons={[{ label: 'OK', onClick: () => { setSuccessMessage(null); onBack(); }, variant: 'primary' }]}
        autoCloseSeconds={5}
        onClose={() => { setSuccessMessage(null); onBack(); }}
      />

      <FormContent>
        <Form onSubmit={handleSubmit}>
          <InputField
            label="Barcode"
            id="barcode"
            type="text"
            value={product.barcode}
            onChange={() => {}}
            placeholder=""
            disabled={true}
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
            Save Changes
          </Button>
        </Form>
      </FormContent>
    </Container>
  );
};
