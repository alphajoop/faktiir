'use client';

import {
  AlertTriangleIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  BarChart3Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  TrendingUpIcon,
  UsersIcon,
} from 'lucide-react';
import { useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  XAxis,
  YAxis,
} from 'recharts';
import { AnalyticsSkeleton } from '@/components/analytics-skeleton';
import { ErrorState } from '@/components/error-state';
import { PageHeader } from '@/components/page-header';
import { PaymentRateRing } from '@/components/payment-rate-ring';
import { StatCard } from '@/components/stat-card';
import { TopClientRow } from '@/components/top-client-row';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Caption, Text } from '@/components/ui/typography';
import type { AnalyticsData } from '@/lib/api';
import { invoiceChartConfig, revenueChartConfig } from '@/lib/chart-configs';
import { classifyError } from '@/lib/error-utils';
import { formatCurrency } from '@/lib/format';
import { useAnalytics } from '@/lib/hooks';

function pct(value: number, total: number) {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

export default function AnalyticsPage() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  const { data, isLoading, isError, error, refetch } = useAnalytics(year);

  const errorInfo = isError ? classifyError(error) : null;

  return (
    <>
      <PageHeader
        title="Analytique"
        actions={
          <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 px-1 py-1">
            <button
              type="button"
              onClick={() => setYear((y) => y - 1)}
              disabled={year <= 2020}
              className="flex size-7 items-center justify-center rounded-md transition-colors hover:bg-background disabled:opacity-40"
            >
              <ChevronLeftIcon className="size-4" />
            </button>
            <span className="min-w-12 text-center text-sm font-semibold tabular-nums text-foreground">
              {year}
            </span>
            <button
              type="button"
              onClick={() => setYear((y) => y + 1)}
              disabled={year >= currentYear}
              className="flex size-7 items-center justify-center rounded-md transition-colors hover:bg-background disabled:opacity-40"
            >
              <ChevronRightIcon className="size-4" />
            </button>
          </div>
        }
      />

      {isLoading ? (
        <AnalyticsSkeleton />
      ) : errorInfo ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <ErrorState
            title={errorInfo.title}
            description={errorInfo.description}
            icon={errorInfo.icon}
            onRetry={refetch}
          />
        </div>
      ) : data ? (
        <AnalyticsContent data={data} />
      ) : null}
    </>
  );
}

function AnalyticsContent({ data }: { data: AnalyticsData }) {
  // Couleur des barres par mois — met en évidence le mois courant
  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      {/* ── KPI cards ── */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          label="Chiffre d'affaires"
          value={formatCurrency(data.totalRevenue)}
          icon={TrendingUpIcon}
          trend={{ value: data.revenueGrowth }}
          iconBg="bg-primary/10"
          iconColor="text-primary"
        />
        <StatCard
          label="Factures émises"
          value={String(data.totalInvoices)}
          icon={BarChart3Icon}
          sub={`${data.paidInvoices} payées`}
        />
        <StatCard
          label="En retard"
          value={String(data.overdueInvoices)}
          icon={AlertTriangleIcon}
          sub={`${pct(data.overdueInvoices, data.totalInvoices)}% du total`}
          iconBg={data.overdueInvoices > 0 ? 'bg-destructive/10' : 'bg-muted'}
          iconColor={
            data.overdueInvoices > 0
              ? 'text-destructive'
              : 'text-muted-foreground'
          }
        />
        <StatCard
          label="Valeur moyenne"
          value={formatCurrency(data.avgInvoiceValue)}
          icon={UsersIcon}
          sub="par facture payée"
        />
      </div>

      {/* ── Taux de paiement + En attente ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <PaymentRateRing rate={data.paymentRate} />

        {/* Statut breakdown */}
        <div className="sm:col-span-2 rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
          <Caption>Répartition des statuts</Caption>
          <div className="flex flex-col gap-2.5">
            {[
              {
                label: 'Payées',
                count: data.paidInvoices,
                color: 'bg-green-500',
                textColor: 'text-green-700 dark:text-green-400',
              },
              {
                label: 'En attente',
                count: data.pendingInvoices,
                color: 'bg-blue-500',
                textColor: 'text-blue-700 dark:text-blue-400',
              },
              {
                label: 'En retard',
                count: data.overdueInvoices,
                color: 'bg-destructive',
                textColor: 'text-destructive',
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="flex items-center gap-2 w-24 shrink-0">
                  <div className={`size-2 rounded-full ${item.color}`} />
                  <Caption>{item.label}</Caption>
                </div>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} opacity-80 transition-all duration-500`}
                    style={{
                      width: `${pct(item.count, data.totalInvoices)}%`,
                    }}
                  />
                </div>
                <span
                  className={`text-xs font-semibold tabular-nums w-6 text-right ${item.textColor}`}
                >
                  {item.count}
                </span>
              </div>
            ))}
          </div>

          {data.totalInvoices === 0 && (
            <Caption className="text-center py-4">
              Aucune facture cette année
            </Caption>
          )}
        </div>
      </div>

      {/* ── CA mensuel — Area chart ── */}
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <Text size="sm" weight="semibold">
              Chiffre d'affaires mensuel
            </Text>
            <Caption>Factures payées en {data.year}</Caption>
          </div>
          {data.revenueGrowth !== null && (
            <div
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                data.revenueGrowth >= 0
                  ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                  : 'bg-destructive/10 text-destructive'
              }`}
            >
              {data.revenueGrowth >= 0 ? (
                <ArrowUpIcon className="size-3" />
              ) : (
                <ArrowDownIcon className="size-3" />
              )}
              {data.revenueGrowth >= 0 ? '+' : ''}
              {data.revenueGrowth}% vs {data.year - 1}
            </div>
          )}
        </div>

        <ChartContainer
          config={revenueChartConfig}
          className="h-[220px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={data.monthlyRevenue}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.15}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <YAxis
              tickFormatter={(v) =>
                v >= 1_000_000
                  ? `${(v / 1_000_000).toFixed(1)}M`
                  : v >= 1_000
                    ? `${(v / 1_000).toFixed(0)}k`
                    : String(v)
              }
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(value) => `${value}`}
                  formatter={(value) => formatCurrency(value as number)}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="revenue"
              fill="url(#revenueGrad)"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
                stroke: 'var(--color-revenue)',
                strokeWidth: 0,
              }}
            />
          </AreaChart>
        </ChartContainer>
      </div>

      {/* ── Factures par mois + Top clients ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Factures payées par mois — Bar chart */}
        <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
          <div>
            <Text size="sm" weight="semibold">
              Factures payées par mois
            </Text>
            <Caption>Nombre de factures encaissées</Caption>
          </div>

          <ChartContainer
            config={invoiceChartConfig}
            className="h-[180px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={data.monthlyRevenue}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              barSize={18}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    labelFormatter={(value) => `${value}`}
                    formatter={(value) => `${value} factures`}
                  />
                }
              />
              <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                {data.monthlyRevenue.map((entry) => (
                  <Cell
                    key={entry.month}
                    fill={
                      entry.month === currentMonth
                        ? 'var(--color-count)'
                        : 'var(--color-count) / 0.3'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>

        {/* Top clients */}
        <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <Text size="sm" weight="semibold">
                Top clients
              </Text>
              <Caption>Par chiffre d'affaires payé</Caption>
            </div>
            <Caption className="text-right">
              <span className="hidden sm:inline">Payées/</span>Total
            </Caption>
          </div>

          {data.topClients.length === 0 ? (
            <div className="flex flex-1 items-center justify-center py-8">
              <Caption>Aucune donnée</Caption>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {data.topClients.map((client, i) => (
                <TopClientRow
                  key={client.id}
                  client={client}
                  maxTotal={data.topClients[0].total}
                  rank={i + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Année précédente ── */}
      {data.prevYearRevenue > 0 && (
        <div className="rounded-xl border border-border bg-muted/20 px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-muted">
              <ClockIcon className="size-4 text-muted-foreground" />
            </div>
            <div>
              <Text size="sm" weight="medium">
                Année précédente ({data.year - 1})
              </Text>
              <Caption>CA total encaissé</Caption>
            </div>
          </div>
          <Text size="sm" weight="semibold" className="tabular-nums">
            {formatCurrency(data.prevYearRevenue)}
          </Text>
        </div>
      )}
    </div>
  );
}
