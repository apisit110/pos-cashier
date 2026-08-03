import React, { useState, useEffect, useCallback } from 'react';
import dayjs, { DEFAULT_TIMEZONE } from '@lightning-pos/datetime';
import { DashboardContainer } from './DashboardContainer';
import { DashboardHeader, DashboardTitle, DashboardSubtitle } from './DashboardHeader';
import {
  StatGrid, StatCard, StatLabel, StatValue,
  ChartSection, ChartCard, ChartTitle,
  BarChart, BarColumn, Bar, BarAxisLabel, EmptyState,
} from './DashboardSummary';
import { useTranslation } from '../../i18n/LanguageContext';
import { formatMessage } from '../../i18n/format';
import type { GetTransactionSummaryUseCase } from '../../../domain/use-cases/GetTransactionSummaryUseCase';
import type { TransactionSummaryBucket } from '../../../domain/repositories/TransactionRepository';

interface DashboardPageProps {
  staff: { uid: string; username: string; role: string; accessToken: string } | null;
  getTransactionSummaryUseCase: GetTransactionSummaryUseCase;
}

interface FilledBucket {
  bucket: string;
  label: string;
  orderCount: number;
  totalAmount: number;
}

const HOURLY_KEY_FORMAT = 'YYYY-MM-DD HH:00';
const DAILY_KEY_FORMAT = 'YYYY-MM-DD';
const DAILY_RANGE_DAYS = 7;

const formatCurrency = (amount: number) => `฿${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function fillHourlyBuckets(data: TransactionSummaryBucket[]): FilledBucket[] {
  const byBucket = new Map(data.map((d) => [d.bucket, d]));
  const startOfDay = dayjs().tz(DEFAULT_TIMEZONE).startOf('day');

  return Array.from({ length: 24 }, (_, hour) => {
    const hourStart = startOfDay.add(hour, 'hour');
    const key = hourStart.format(HOURLY_KEY_FORMAT);
    const found = byBucket.get(key);
    return {
      bucket: key,
      label: hourStart.format('HH:00'),
      orderCount: found?.orderCount ?? 0,
      totalAmount: found?.totalAmount ?? 0,
    };
  });
}

function fillDailyBuckets(data: TransactionSummaryBucket[]): FilledBucket[] {
  const byBucket = new Map(data.map((d) => [d.bucket, d]));
  const today = dayjs().tz(DEFAULT_TIMEZONE).startOf('day');

  return Array.from({ length: DAILY_RANGE_DAYS }, (_, i) => {
    const date = today.subtract(DAILY_RANGE_DAYS - 1 - i, 'day');
    const key = date.format(DAILY_KEY_FORMAT);
    const found = byBucket.get(key);
    return {
      bucket: key,
      label: date.format('DD/MM'),
      orderCount: found?.orderCount ?? 0,
      totalAmount: found?.totalAmount ?? 0,
    };
  });
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  staff,
  getTransactionSummaryUseCase,
}) => {
  const { t } = useTranslation();
  const [hourlyBuckets, setHourlyBuckets] = useState<FilledBucket[]>([]);
  const [dailyBuckets, setDailyBuckets] = useState<FilledBucket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    setIsLoading(true);
    try {
      const now = dayjs().tz(DEFAULT_TIMEZONE);
      const startOfToday = now.startOf('day');
      const endOfToday = now.endOf('day');
      const startOfRange = startOfToday.subtract(DAILY_RANGE_DAYS - 1, 'day');

      const [hourlyResult, dailyResult] = await Promise.all([
        getTransactionSummaryUseCase.execute({
          period: 'hourly',
          startDate: startOfToday.utc().toISOString(),
          endDate: endOfToday.utc().toISOString(),
        }),
        getTransactionSummaryUseCase.execute({
          period: 'daily',
          startDate: startOfRange.utc().toISOString(),
          endDate: endOfToday.utc().toISOString(),
        }),
      ]);

      setHourlyBuckets(fillHourlyBuckets(hourlyResult));
      setDailyBuckets(fillDailyBuckets(dailyResult));
    } catch (error) {
      console.error('Failed to fetch transaction summary:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getTransactionSummaryUseCase]);

  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  const todayRevenue = hourlyBuckets.reduce((sum, b) => sum + b.totalAmount, 0);
  const todayOrders = hourlyBuckets.reduce((sum, b) => sum + b.orderCount, 0);
  const rangeRevenue = dailyBuckets.reduce((sum, b) => sum + b.totalAmount, 0);
  const rangeOrders = dailyBuckets.reduce((sum, b) => sum + b.orderCount, 0);

  const hourlyMax = Math.max(1, ...hourlyBuckets.map((b) => b.totalAmount));
  const dailyMax = Math.max(1, ...dailyBuckets.map((b) => b.totalAmount));

  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>
          {formatMessage(t.dashboard.welcomeBack, { name: staff?.username || t.dashboard.admin })}
        </DashboardTitle>
        <DashboardSubtitle>
          {t.dashboard.subtitle}
        </DashboardSubtitle>
      </DashboardHeader>

      <StatGrid>
        <StatCard>
          <StatLabel>{t.dashboard.todayRevenue}</StatLabel>
          <StatValue>{formatCurrency(todayRevenue)}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>{t.dashboard.todayOrders}</StatLabel>
          <StatValue>{todayOrders}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>{formatMessage(t.dashboard.rangeRevenue, { days: DAILY_RANGE_DAYS })}</StatLabel>
          <StatValue>{formatCurrency(rangeRevenue)}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>{formatMessage(t.dashboard.rangeOrders, { days: DAILY_RANGE_DAYS })}</StatLabel>
          <StatValue>{rangeOrders}</StatValue>
        </StatCard>
      </StatGrid>

      <ChartSection>
        <ChartCard>
          <ChartTitle>{t.dashboard.hourlyChartTitle}</ChartTitle>
          {isLoading ? (
            <EmptyState>{t.dashboard.loading}</EmptyState>
          ) : todayOrders === 0 ? (
            <EmptyState>{t.dashboard.noSalesToday}</EmptyState>
          ) : (
            <BarChart>
              {hourlyBuckets.map((b) => (
                <BarColumn key={b.bucket}>
                  <Bar $heightPercent={(b.totalAmount / hourlyMax) * 100} title={`${b.label} — ${formatCurrency(b.totalAmount)} (${b.orderCount})`} />
                  <BarAxisLabel>{b.label}</BarAxisLabel>
                </BarColumn>
              ))}
            </BarChart>
          )}
        </ChartCard>

        <ChartCard>
          <ChartTitle>{formatMessage(t.dashboard.dailyChartTitle, { days: DAILY_RANGE_DAYS })}</ChartTitle>
          {isLoading ? (
            <EmptyState>{t.dashboard.loading}</EmptyState>
          ) : rangeOrders === 0 ? (
            <EmptyState>{t.dashboard.noSalesRecent}</EmptyState>
          ) : (
            <BarChart>
              {dailyBuckets.map((b) => (
                <BarColumn key={b.bucket}>
                  <Bar $heightPercent={(b.totalAmount / dailyMax) * 100} title={`${b.label} — ${formatCurrency(b.totalAmount)} (${b.orderCount})`} />
                  <BarAxisLabel>{b.label}</BarAxisLabel>
                </BarColumn>
              ))}
            </BarChart>
          )}
        </ChartCard>
      </ChartSection>
    </DashboardContainer>
  );
};
