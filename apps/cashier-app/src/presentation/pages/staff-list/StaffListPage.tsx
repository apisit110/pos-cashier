import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader, DataTable, Badge, Button, PageContainer, PageContent } from '@apisit110/pos-ui';
import { Loading } from '../../components/Loading';
import { AlertDialog } from '../../components/AlertDialog';
import type { GetStaffsUseCase } from '../../../domain/use-cases/GetStaffsUseCase';
import type { SyncStaffUseCase } from '../../../domain/use-cases/SyncStaffUseCase';
import type { Staff } from '../../../domain/repositories/StaffRepository';
import { useTranslation } from '../../i18n/LanguageContext';
import { formatMessage } from '../../i18n/format';

const isOnlineMode = process.env.NEXT_PUBLIC_APP_MODE === 'online';

interface StaffListPageProps {
  onBack: () => void;
  onNavigateToCreateStaff: () => void;
  getStaffsUseCase: GetStaffsUseCase;
  syncStaffUseCase: SyncStaffUseCase;
}

export const StaffListPage: React.FC<StaffListPageProps> = ({ onBack, onNavigateToCreateStaff, getStaffsUseCase, syncStaffUseCase }) => {
  const { t } = useTranslation();
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const fetchStaffs = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getStaffsUseCase.execute(currentPage, pageSize);
      setStaffs(result.staffs);
      setTotal(result.total);
    } catch (error) {
      console.error('Failed to fetch staffs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getStaffsUseCase, currentPage, pageSize]);

  useEffect(() => { fetchStaffs(); }, [fetchStaffs]);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      await syncStaffUseCase.execute();
      await fetchStaffs();
    } catch (error) {
      console.error('Failed to sync staffs:', error);
      setSyncError(error instanceof Error ? error.message : 'Failed to sync staffs');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title={t.staffList.title}
        onBack={onBack}
        extraContent={
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span className="total-count">{formatMessage(t.staffList.totalStaffs, { count: total })}</span>
            <Button variant="primary" style={{ width: 'auto', gap: '0.5rem' }} onClick={onNavigateToCreateStaff}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              {t.staffList.createNewStaff}
            </Button>
            {isOnlineMode && (
              <Button variant="primary" style={{ width: 'auto' }} isLoading={isSyncing} disabled={isLoading} onClick={handleSync}>
                {isSyncing ? t.staffList.syncing : t.staffList.syncStaffs}
              </Button>
            )}
          </div>
        }
      />

      <PageContent>
        <DataTable
          columns={[
            {
              header: t.staffList.columnUsername,
              key: 'userId',
              render: (staff) => <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{staff.userId}</span>,
            },
            { header: t.staffList.columnFullName, key: 'fullName' },
            {
              header: t.staffList.columnRole,
              key: 'roleId',
              render: (staff) => (
                <Badge $variant={staff.roleId === 1 ? 'info' : 'success'} $shape="pill">
                  {staff.roleId === 1 ? `🛡️ ${t.createStaff.manager}` : `💰 ${t.createStaff.cashier}`}
                </Badge>
              ),
            },
            {
              header: t.staffList.columnStatus,
              key: 'status',
              render: () => <Badge $variant="success">{t.common.active}</Badge>,
            },
          ]}
          data={staffs}
          isLoading={isLoading}
          totalItems={total}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          emptyMessage={t.staffList.emptyMessage}
        />
      </PageContent>

      {isSyncing && <Loading fullscreen label={t.staffList.syncingLabel} />}

      <AlertDialog
        open={syncError !== null}
        title={t.staffList.syncFailedTitle}
        description={syncError ?? ''}
        buttons={[
          { label: t.common.ok, variant: 'primary', onClick: () => setSyncError(null) },
        ]}
        autoCloseSeconds={5}
        closeOnOverlayClick
        onClose={() => setSyncError(null)}
      />
    </PageContainer>
  );
};
