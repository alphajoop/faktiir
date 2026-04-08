'use client';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  MailIcon,
  PhoneIcon,
  PlusIcon,
  TrashIcon,
  UsersIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Caption } from '@/components/ui/typography';
import type { Client } from '@/lib/api';
import { useClients, useDeleteClient } from '@/lib/hooks';

export default function ClientsPage() {
  const { data, isLoading } = useClients();
  const deleteMutation = useDeleteClient();
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'name', desc: false },
  ]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: 'name',
      header: 'Nom',
      cell: ({ row }) => (
        <Link
          href={`/dashboard/clients/${row.original.id}`}
          className="font-medium text-foreground hover:text-primary transition-colors"
        >
          {row.original.name}
        </Link>
      ),
    },
    {
      accessorKey: 'email',
      header: 'E-mail',
      cell: ({ row }) =>
        row.original.email ? (
          <a
            href={`mailto:${row.original.email}`}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <MailIcon className="size-3" />
            <Caption>{row.original.email}</Caption>
          </a>
        ) : (
          <Caption className="text-muted-foreground/40">—</Caption>
        ),
    },
    {
      accessorKey: 'phone',
      header: 'Téléphone',
      cell: ({ row }) =>
        row.original.phone ? (
          <a
            href={`tel:${row.original.phone}`}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <PhoneIcon className="size-3" />
            <Caption>{row.original.phone}</Caption>
          </a>
        ) : (
          <Caption className="text-muted-foreground/40">—</Caption>
        ),
    },
    {
      accessorKey: 'address',
      header: 'Adresse',
      cell: ({ row }) =>
        row.original.address ? (
          <Caption className="max-w-xs truncate">
            {row.original.address}
          </Caption>
        ) : (
          <Caption className="text-muted-foreground/40">—</Caption>
        ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/clients/${row.original.id}/edit`}>
              Modifier
            </Link>
          </Button>
          <ConfirmDialog
            trigger={
              <Button variant="ghost" size="icon-xs" title="Supprimer">
                <TrashIcon className="text-destructive" />
              </Button>
            }
            title={`Supprimer "${row.original.name}" ?`}
            description="Ce client sera définitivement supprimé. Ses factures associées ne seront pas supprimées."
            confirmLabel="Supprimer"
            onConfirm={() =>
              deleteMutation.mutate(row.original.id, {
                onSuccess: () => toast.success('Client supprimé'),
                onError: (e) => toast.error(e.message),
              })
            }
          />
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: data ?? [],
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <PageHeader
        title="Clients"
        description={
          data ? `${data.length} client${data.length > 1 ? 's' : ''}` : ''
        }
        actions={
          <Button size="sm" asChild>
            <Link href="/dashboard/clients/new">
              <PlusIcon />
              Nouveau client
            </Link>
          </Button>
        }
      />

      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <Input
          placeholder="Rechercher un client…"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-xs"
        />

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col divide-y divide-border">
              {Array.from({ length: 4 }).map(() => (
                <div
                  key={Math.random()}
                  className="flex items-center gap-4 px-4 py-3"
                >
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-24 ml-auto" />
                </div>
              ))}
            </div>
          ) : table.getRowModel().rows.length === 0 ? (
            <EmptyState
              icon={<UsersIcon className="size-5" />}
              title="Aucun client"
              description="Ajoutez votre premier client pour créer des factures."
              action={
                <Button size="sm" asChild>
                  <Link href="/dashboard/clients/new">
                    <PlusIcon />
                    Nouveau client
                  </Link>
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((h) => (
                      <TableHead key={h.id}>
                        {flexRender(h.column.columnDef.header, h.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </>
  );
}
