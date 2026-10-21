import React from 'react';
import { useTheme } from 'styled-components';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ChartCanvas } from './DashboardSummary';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface RevenueBarChartProps {
  buckets: { bucket: string; label: string; orderCount: number; totalAmount: number }[];
  formatValue: (amount: number) => string;
}

export const RevenueBarChart: React.FC<RevenueBarChartProps> = ({ buckets, formatValue }) => {
  const theme = useTheme();
  const { accent, text, border } = {
    accent: theme.semantics.colors.accent.primary,
    text: theme.semantics.colors.text.secondary,
    border: theme.semantics.colors.border.subtle,
  };

  return (
    <ChartCanvas>
      <Bar
        data={{
          labels: buckets.map((b) => b.label),
          datasets: [
            {
              data: buckets.map((b) => b.totalAmount),
              backgroundColor: accent,
              borderRadius: { topLeft: 4, topRight: 4 },
              maxBarThickness: 28,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const bucket = buckets[ctx.dataIndex];
                  return `${formatValue(bucket.totalAmount)} (${bucket.orderCount})`;
                },
              },
            },
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: text, font: { size: 11 } } },
            y: {
              beginAtZero: true,
              grid: { color: border },
              ticks: { color: text, font: { size: 11 } },
            },
          },
        }}
      />
    </ChartCanvas>
  );
};
