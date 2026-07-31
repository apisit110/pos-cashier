import React, { useState } from 'react';
import { Button, InputField, PageHeader } from '@apisit110/pos-ui';
import { Container } from '../create-staff/Container';
import { FormContent } from '../create-staff/FormContent';
import { Form } from '../create-staff/Form';
import { Loading } from '../../components/Loading';
import { AlertDialog } from '../../components/AlertDialog';
import type { CreateProductUseCase } from '../../../domain/use-cases/CreateProductUseCase';
import { useTranslation } from '../../i18n/LanguageContext';

interface CreateProductPageProps {
  onBack: () => void;
  createProductUseCase: CreateProductUseCase;
}

export const CreateProductPage: React.FC<CreateProductPageProps> = ({ onBack, createProductUseCase }) => {
  const { t } = useTranslation();
  const [barcode, setBarcode] = useState('');
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode.trim()) {
      setErrorMessage(t.createProduct.errorBarcodeRequired);
      return;
    }
    if (!name.trim()) {
      setErrorMessage(t.createProduct.errorNameRequired);
      return;
    }
    const parsedPrice = parseFloat(price);
    if (!price || isNaN(parsedPrice) || parsedPrice < 0) {
      setErrorMessage(t.createProduct.errorPriceInvalid);
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
      setErrorMessage(err.message || t.createProduct.errorFailed);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <PageHeader title={t.createProduct.title} onBack={onBack} />

      {isLoading && <Loading fullscreen label={t.createProduct.creatingLabel} />}

      <AlertDialog
        open={errorMessage !== null}
        title={t.common.error}
        description={errorMessage ?? undefined}
        buttons={[{ label: t.common.ok, onClick: () => setErrorMessage(null), variant: 'primary' }]}
        onClose={() => setErrorMessage(null)}
      />

      <FormContent>
        <Form onSubmit={handleSubmit}>
          <InputField
            label={t.createProduct.barcode}
            id="barcode"
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder={t.createProduct.barcodePlaceholder}
            disabled={isLoading}
            autoComplete="off"
            required
          />

          <InputField
            label={t.createProduct.name}
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.createProduct.namePlaceholder}
            disabled={isLoading}
            autoComplete="off"
            required
          />

          <InputField
            label={t.createProduct.brand}
            id="brand"
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder={t.createProduct.brandPlaceholder}
            disabled={isLoading}
            autoComplete="off"
          />

          <InputField
            label={t.createProduct.price}
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
            {t.createProduct.createButton}
          </Button>
        </Form>
      </FormContent>
    </Container>
  );
};
