import type { ChartConfig } from '@/components/ui/chart';

export const revenueChartConfig: ChartConfig = {
  revenue: {
    label: "Chiffre d'affaires",
    color: 'var(--chart-1)',
  },
};

export const invoiceChartConfig: ChartConfig = {
  count: {
    label: 'Factures',
    color: 'var(--chart-2)',
  },
};
