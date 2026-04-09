'use client';

import { PlusIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import {
  DataTable,
  DataTablePagination,
  DataTableSkeleton,
} from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import type { ClientsQuery } from '@/lib/api';
import { useClients } from '@/lib/hooks';
import { getClientColumns } from './columns';

type SortField = ClientsQuery['sortBy'];
const LIMIT = 15;

export function ClientsDataTable() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortField>('name');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  const query: ClientsQuery = {
    page,
    limit: LIMIT,
    search: debouncedSearch || undefined,
    sortBy,
    order,
  };

  const { data, isLoading } = useClients(query);

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortBy === field) {
        setOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortBy(field);
        setOrder('asc');
      }
      setPage(1);
    },
    [sortBy],
  );

  const columns = getClientColumns(sortBy, order, handleSort);

  const clientList = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
      <Input
        placeholder="Rechercher par nom, e-mail ou téléphone…"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="max-w-xs"
      />

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <DataTableSkeleton rows={5} cols={['w-28', 'w-36', 'w-24', 'w-32']} />
        ) : (
          <DataTable
            columns={columns}
            data={clientList}
            sorting={sortBy ? [{ id: sortBy, desc: order === 'desc' }] : []}
            empty={
              <EmptyState
                icon={<UsersIcon className="size-5" />}
                title={search ? 'Aucun résultat' : 'Aucun client'}
                description={
                  search
                    ? 'Essayez un autre terme de recherche.'
                    : 'Ajoutez votre premier client pour créer des factures.'
                }
                action={
                  !search ? (
                    <Button size="sm" asChild>
                      <Link href="/dashboard/clients/new">
                        <PlusIcon />
                        Nouveau client
                      </Link>
                    </Button>
                  ) : undefined
                }
              />
            }
          />
        )}
      </div>

      {!isLoading && (
        <DataTablePagination
          page={page}
          totalPages={totalPages}
          total={total}
          label={`client${total > 1 ? 's' : ''}`}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
