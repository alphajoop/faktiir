'use client';

import { FileTextIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { Button } from '@/components/ui/button';
import {
  DataTable,
  DataTablePagination,
  DataTableSkeleton,
} from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';
import type { InvoiceStatus, InvoicesQuery } from '@/lib/api';
import { classifyError } from '@/lib/error-utils';
import { useInvoices } from '@/lib/hooks';
import { getInvoiceColumns } from './columns';

const STATUS_OPTIONS: { value: InvoiceStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Tous les statuts' },
  { value: 'DRAFT', label: 'Brouillon' },
  { value: 'SENT', label: 'Envoyée' },
  { value: 'PAID', label: 'Payée' },
  { value: 'OVERDUE', label: 'En retard' },
];

type SortField = InvoicesQuery['sortBy'];
const LIMIT = 15;

export function InvoicesDataTable() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'ALL'>(
    'ALL',
  );
  const [sortBy, setSortBy] = useState<SortField>('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  const query: InvoicesQuery = {
    page,
    limit: LIMIT,
    search: debouncedSearch || undefined,
    status: statusFilter !== 'ALL' ? statusFilter : undefined,
    sortBy,
    order,
  };

  const { data, isLoading, isError, error, refetch } = useInvoices(query);

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortBy === field) {
        setOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortBy(field);
        setOrder('desc');
      }
      setPage(1);
    },
    [sortBy],
  );

  const columns = getInvoiceColumns(sortBy, order, handleSort);

  const invoiceList = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;
  const hasFilters = !!search || statusFilter !== 'ALL';

  const errorInfo = isError ? classifyError(error) : null;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Rechercher par numéro, client…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-xs"
        />
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v as InvoiceStatus | 'ALL');
            setPage(1);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch('');
              setStatusFilter('ALL');
              setPage(1);
            }}
          >
            Réinitialiser
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <DataTableSkeleton
            rows={6}
            cols={['w-20', 'w-28', 'w-16', 'w-16', 'w-14', 'w-20']}
          />
        ) : errorInfo ? (
          <ErrorState
            title={errorInfo.title}
            description={errorInfo.description}
            icon={errorInfo.icon}
            onRetry={refetch}
          />
        ) : (
          <DataTable
            columns={columns}
            data={invoiceList}
            sorting={sortBy ? [{ id: sortBy, desc: order === 'desc' }] : []}
            empty={
              <EmptyState
                icon={<FileTextIcon className="size-5" />}
                title={hasFilters ? 'Aucun résultat' : 'Aucune facture'}
                description={
                  hasFilters
                    ? "Essayez d'autres critères de recherche."
                    : 'Créez votre première facture pour commencer.'
                }
                action={
                  !hasFilters ? (
                    <Button size="sm" asChild>
                      <Link href="/dashboard/invoices/new">
                        <PlusIcon />
                        Créer une facture
                      </Link>
                    </Button>
                  ) : undefined
                }
              />
            }
          />
        )}
      </div>

      {!isLoading && !errorInfo && (
        <DataTablePagination
          page={page}
          totalPages={totalPages}
          total={total}
          label={`facture${total > 1 ? 's' : ''}`}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
