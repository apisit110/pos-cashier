import React from 'react';
import { DashboardContainer } from './DashboardContainer';
import { useTranslation } from '../../i18n/LanguageContext';
import { formatMessage } from '../../i18n/format';

interface DashboardPageProps {
  staff: { uid: string; username: string; role: string; accessToken: string } | null;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  staff,
}) => {
  const { t } = useTranslation();

  return (
    <DashboardContainer>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
          {formatMessage(t.dashboard.welcomeBack, { name: staff?.username || t.dashboard.admin })}
        </h1>
        <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>
          {t.dashboard.subtitle}
        </p>
      </header>

    </DashboardContainer>
  );
};
