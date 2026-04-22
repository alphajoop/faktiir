'use client';

import {
  ClockIcon,
  FileTextIcon,
  PlusIcon,
  TrendingUpIcon,
  UsersIcon,
} from 'lucide-react';
import Link from 'next/link';
import { ErrorState } from '@/components/error-state';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { StatCardSkeleton } from '@/components/stat-card-skeleton';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Caption, Text } from '@/components/ui/typography';
import type { Invoice } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { classifyError } from '@/lib/error-utils';
import { formatCurrency, formatDate } from '@/lib/format';
import { useAnalytics, useClients, useInvoices } from '@/lib/hooks';

function RecentInvoicesSkeleton() {
  let counter = 0;
  return (
    <div className="flex flex-col divide-y divide-border">
      {Array.from({ length: 4 }).map(() => {
        const id = `skeleton-${++counter}`;
        return (
          <div key={id} className="flex items-center gap-3 px-4 py-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16 ml-auto" />
            <Skeleton className="h-5 w-14" />
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  const {
    data: analyticsData,
    isLoading: loadingAnalytics,
    isError: analyticsError,
    error: analyticsErr,
    refetch: refetchAnalytics,
  } = useAnalytics(currentYear);

  const {
    data: invoicesData,
    isLoading: loadingInvoices,
    isError: invoicesError,
    error: invoicesErr,
    refetch: refetchInvoices,
  } = useInvoices();

  const {
    data: clientsData,
    isLoading: loadingClients,
    isError: clientsError,
    error: clientsErr,
    refetch: refetchClients,
  } = useClients();

  const invoiceList = invoicesData?.data ?? [];
  const clientList = clientsData?.data ?? [];

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  const invoicesClassified = invoicesError ? classifyError(invoicesErr) : null;
  const clientsClassified = clientsError ? classifyError(clientsErr) : null;
  const analyticsClassified = analyticsError
    ? classifyError(analyticsErr)
    : null;

  return (
    <>
      <PageHeader
        title="Tableau de bord"
        actions={
          <Button size="sm" asChild>
            <Link href="/dashboard/invoices/new">
              <PlusIcon />
              Nouvelle facture
            </Link>
          </Button>
        }
      />

      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <div>
          <Text size="base" weight="semibold">
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </Text>
          <Text size="sm" variant="muted">
            Voici un aperçu de votre activité.
          </Text>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {loadingInvoices || loadingClients || loadingAnalytics ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : analyticsClassified ? (
            <div className="col-span-2 md:col-span-4">
              <ErrorState
                title={analyticsClassified.title}
                description={analyticsClassified.description}
                icon={analyticsClassified.icon}
                onRetry={() => {
                  refetchAnalytics();
                  refetchInvoices();
                  refetchClients();
                }}
              />
            </div>
          ) : analyticsData ? (
            <>
              <StatCard
                label="Chiffre d'affaires"
                value={formatCurrency(analyticsData.totalRevenue)}
                icon={TrendingUpIcon}
                sub={`${analyticsData.paidInvoices} facture${analyticsData.paidInvoices > 1 ? 's' : ''} payée${analyticsData.paidInvoices > 1 ? 's' : ''}`}
              />
              <StatCard
                label="En attente"
                value={String(analyticsData.pendingInvoices)}
                icon={ClockIcon}
                sub="factures à traiter"
              />
              <StatCard
                label="En retard"
                value={String(analyticsData.overdueInvoices)}
                icon={FileTextIcon}
                sub="à relancer"
              />
              <StatCard
                label="Clients"
                value={clientsClassified ? '—' : String(clientList.length ?? 0)}
                icon={UsersIcon}
              />
            </>
          ) : null}
        </div>

        {/* Recent invoices */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Text size="sm" weight="semibold">
              Factures récentes
            </Text>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/invoices">Voir tout</Link>
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {loadingInvoices ? (
              <RecentInvoicesSkeleton />
            ) : invoicesClassified ? (
              <ErrorState
                title={invoicesClassified.title}
                description={invoicesClassified.description}
                icon={invoicesClassified.icon}
                onRetry={refetchInvoices}
              />
            ) : invoiceList.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-center">
                <FileTextIcon className="size-8 text-muted-foreground/40" />
                <Text size="sm" variant="muted">
                  Aucune facture pour l'instant
                </Text>
                <Button size="sm" asChild className="mt-1">
                  <Link href="/dashboard/invoices/new">
                    <PlusIcon />
                    Créer une facture
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {invoiceList
                  .sort(
                    (a: Invoice, b: Invoice) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime(),
                  )
                  .slice(0, 5)
                  .map((inv) => (
                    <Link
                      key={inv.id}
                      href={`/dashboard/invoices/${inv.id}`}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
                    >
                      <div className="min-w-0 flex-1">
                        <Text size="sm" weight="medium" className="truncate">
                          {inv.number}
                        </Text>
                        <Caption className="block truncate">
                          {inv.client.name} · {formatDate(inv.issueDate)}
                        </Caption>
                      </div>
                      <Text
                        size="sm"
                        weight="medium"
                        className="tabular-nums shrink-0"
                      >
                        {formatCurrency(inv.total)}
                      </Text>
                      <StatusBadge status={inv.status} />
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
