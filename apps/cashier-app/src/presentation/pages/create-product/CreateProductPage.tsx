import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Badge, Button, DataTable, FileDropZone, PageHeader } from '@apisit110/pos-ui';
import type { Column } from '@apisit110/pos-ui';
import styled from 'styled-components';
import { Container } from '../create-staff/Container';
import { FormContent } from '../create-staff/FormContent';
import { Form } from '../create-staff/Form';
import { Loading } from '../../components/Loading';
import { AlertDialog } from '../../components/AlertDialog';
import type { CreateProductUseCase } from '../../../domain/use-cases/CreateProductUseCase';
import type { CreateProductInput } from '../../../domain/repositories/ProductRepository';
import { useTranslation } from '../../i18n/LanguageContext';

const TEMPLATE_URL = '/templates/product_master_v1.xlsx';

interface CreateProductPageProps {
  onBack: () => void;
  createProductUseCase: CreateProductUseCase;
}

const WideFormContent = styled(FormContent)`
  max-width: 960px;
`;

const UploadCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background-color: ${({ theme }) => theme.semantics.colors.bg.card};
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  border-radius: ${({ theme }) => theme.borderRadius.xxl};
`;

const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const PreviewTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.semantics.colors.text.primary};
`;

const CountBadge = styled(Badge)`
  white-space: nowrap;
  flex-shrink: 0;
`;

const PreviewActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

interface PreviewRow {
  row: number;
  barcode: string;
  name: string;
  brand: string;
  price: string;
  error: string | null;
}

const readRows = async (file: File): Promise<Record<string, unknown>[]> => {
  const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) return [];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });
  // Normalize header names so "Barcode", " price " etc. all match.
  return rows.map((row) =>
    Object.fromEntries(Object.entries(row).map(([k, v]) => [k.trim().toLowerCase(), v])),
  );
};

export const CreateProductPage: React.FC<CreateProductPageProps> = ({ onBack, createProductUseCase }) => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const validRows = previewRows.filter((r) => r.error === null);
  const invalidCount = previewRows.length - validRows.length;

  const handleFile = async (selected: File) => {
    setFile(selected);
    setPreviewRows([]);
    setCurrentPage(1);
    setIsLoading(true);
    try {
      const rows = await readRows(selected);
      if (rows.length === 0) {
        setFile(null);
        setErrorMessage(t.createProduct.errorEmptyFile);
        return;
      }
      setPreviewRows(
        rows.map((row, i) => {
          const barcode = String(row.barcode ?? '').trim();
          const name = String(row.name ?? '').trim();
          const brand = String(row.brand ?? '').trim();
          const rawPrice = String(row.price ?? '').trim();
          const price = Number(rawPrice);
          let error: string | null = null;
          if (!barcode) error = t.createProduct.errorBarcodeRequired;
          else if (!name) error = t.createProduct.errorNameRequired;
          else if (rawPrice === '' || isNaN(price) || price < 0) error = t.createProduct.errorPriceInvalid;
          return { row: i + 1, barcode, name, brand, price: rawPrice, error };
        }),
      );
    } catch (err: any) {
      setFile(null);
      setErrorMessage(err.message || t.common.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setPreviewRows([]);
    setCurrentPage(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || validRows.length === 0) {
      setErrorMessage(t.createProduct.errorNoFile);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    const failures: string[] = [];
    let success = 0;
    for (const r of validRows) {
      try {
        const input: CreateProductInput = {
          barcode: r.barcode,
          name: r.name,
          brand: r.brand || undefined,
          price: Number(r.price),
        };
        await createProductUseCase.execute(input);
        success++;
      } catch (err: any) {
        failures.push(
          t.createProduct.errorRow.replace('{row}', String(r.row)).replace('{message}', err.message || ''),
        );
      }
    }
    const summary = t.createProduct.resultSummary
      .replace('{success}', String(success))
      .replace('{total}', String(validRows.length));
    setResultMessage([summary, ...failures].join('\n'));
    setFile(null);
    setPreviewRows([]);
    setIsLoading(false);
  };

  const columns: Column<PreviewRow>[] = [
    { header: t.createProduct.columnRow, key: 'row', width: '80px' },
    { header: t.createProduct.columnBarcode, key: 'barcode' },
    { header: t.createProduct.columnName, key: 'name' },
    { header: t.createProduct.columnBrand, key: 'brand' },
    { header: t.createProduct.columnPrice, key: 'price', textAlign: 'right' },
    {
      header: t.createProduct.columnStatus,
      key: 'error',
      render: (r) => (r.error ? <span style={{ color: 'red' }}>{r.error}</span> : t.createProduct.statusValid),
    },
  ];

  const pagedRows = previewRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Container>
      <PageHeader title={t.createProduct.title} onBack={onBack} />

      {isLoading && <Loading fullscreen label={t.createProduct.importingLabel} />}

      <AlertDialog
        open={errorMessage !== null}
        title={t.common.error}
        description={errorMessage ?? undefined}
        buttons={[{ label: t.common.ok, onClick: () => setErrorMessage(null), variant: 'primary' }]}
        onClose={() => setErrorMessage(null)}
      />

      <AlertDialog
        open={resultMessage !== null}
        title={t.createProduct.resultTitle}
        description={resultMessage ?? undefined}
        buttons={[{ label: t.common.ok, onClick: () => setResultMessage(null), variant: 'primary' }]}
        onClose={() => setResultMessage(null)}
      />

      <WideFormContent>
        {previewRows.length === 0 ? (
          <UploadCard>
            <p>{t.createProduct.columnsHint}</p>
            <FileDropZone accept=".xlsx" onFile={handleFile} disabled={isLoading}>
              <strong>{t.createProduct.chooseFile}</strong>
            </FileDropZone>
            <Button
              type="button"
              variant="secondary"
              disabled={isLoading}
              onClick={() => {
                const link = document.createElement('a');
                link.href = TEMPLATE_URL;
                link.download = 'product_master_v1.xlsx';
                link.click();
              }}
            >
              {t.createProduct.downloadTemplate}
            </Button>
          </UploadCard>
        ) : (
          <Form onSubmit={handleSubmit}>
            <PreviewHeader>
              <PreviewTitle>{t.createProduct.previewTitle}</PreviewTitle>
              <PreviewActions>
                <CountBadge $variant="info" $shape="pill">
                  {t.createProduct.itemsCount.replace('{count}', String(previewRows.length))}
                </CountBadge>
                {invalidCount > 0 && (
                  <CountBadge $variant="error" $shape="pill">
                    {t.createProduct.invalidCount.replace('{count}', String(invalidCount))}
                  </CountBadge>
                )}
                <Button type="button" variant="danger" disabled={isLoading} onClick={handleClearFile}>
                  {t.createProduct.clear}
                </Button>
              </PreviewActions>
            </PreviewHeader>

            <DataTable
              columns={columns}
              data={pagedRows}
              rowKey="row"
              totalItems={previewRows.length}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            />

            <Button type="submit" disabled={isLoading || validRows.length === 0} style={{ width: '100%' }}>
              {t.createProduct.importButton.replace('{count}', String(validRows.length))}
            </Button>
          </Form>
        )}
      </WideFormContent>
    </Container>
  );
};
