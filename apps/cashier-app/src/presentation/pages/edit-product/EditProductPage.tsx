import React, { useState } from 'react';
import { Button, InputField, PageHeader } from '@apisit110/pos-ui';
import { Container } from '../create-staff/Container';
import { FormContent } from '../create-staff/FormContent';
import { Form } from '../create-staff/Form';
import { Loading } from '../../components/Loading';
import { AlertDialog } from '../../components/AlertDialog';
import type { UpdateProductUseCase } from '../../../domain/use-cases/UpdateProductUseCase';
import type { Product } from '../../../domain/entities/Product';
import { useTranslation } from '../../i18n/LanguageContext';

interface EditProductPageProps {
  onBack: () => void;
  product: Product;
  updateProductUseCase: UpdateProductUseCase;
}

export const EditProductPage: React.FC<EditProductPageProps> = ({ onBack, product, updateProductUseCase }) => {
  const { t } = useTranslation();
  const [name, setName] = useState(product.name);
  const [brand, setBrand] = useState(product.brand ?? '');
  const [price, setPrice] = useState(product.price.toString());
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage(t.editProduct.errorNameRequired);
      return;
    }
    const parsedPrice = parseFloat(price);
    if (!price || isNaN(parsedPrice) || parsedPrice < 0) {
      setErrorMessage(t.editProduct.errorPriceInvalid);
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
      setSuccessMessage(t.editProduct.successMessage);
    } catch (err: any) {
      setErrorMessage(err.message || t.editProduct.errorFailed);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <PageHeader title={t.editProduct.title} onBack={onBack} />

      {isLoading && <Loading fullscreen label={t.editProduct.updatingLabel} />}

      <AlertDialog
        open={errorMessage !== null}
        title={t.editProduct.errorTitle}
        description={errorMessage ?? undefined}
        buttons={[{ label: t.common.ok, onClick: () => setErrorMessage(null), variant: 'primary' }]}
        onClose={() => setErrorMessage(null)}
      />

      <AlertDialog
        open={successMessage !== null}
        title={t.editProduct.successTitle}
        description={successMessage ?? undefined}
        buttons={[{ label: t.common.ok, onClick: () => { setSuccessMessage(null); onBack(); }, variant: 'primary' }]}
        autoCloseSeconds={5}
        onClose={() => { setSuccessMessage(null); onBack(); }}
      />

      <FormContent>
        <Form onSubmit={handleSubmit}>
          <InputField
            label={t.editProduct.barcode}
            id="barcode"
            type="text"
            value={product.barcode}
            onChange={() => {}}
            placeholder=""
            disabled={true}
          />

          <InputField
            label={t.editProduct.name}
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.editProduct.namePlaceholder}
            disabled={isLoading}
            required
          />

          <InputField
            label={t.editProduct.brand}
            id="brand"
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder={t.editProduct.brandPlaceholder}
            disabled={isLoading}
          />

          <InputField
            label={t.editProduct.price}
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            disabled={isLoading}
            required
          />

          <Button type="submit" disabled={isLoading} style={{ marginTop: '1rem' }}>
            {t.editProduct.saveButton}
          </Button>
        </Form>
      </FormContent>
    </Container>
  );
};
