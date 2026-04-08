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
  ArrowUpDownIcon,
  DownloadIcon,
  FileTextIcon,
  PlusIcon,
  TrashIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Caption, Text } from '@/components/ui/typography';
import type { Invoice } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/format';
import { useDeleteInvoice, useInvoices } from '@/lib/hooks';
import { useDownloadPdf } from '@/lib/use-download-pdf';

function DownloadButton({
  invoiceId,
  invoiceNumber,
}: {
  invoiceId: string;
  invoiceNumber: string;
}) {
  const { download, isPending } = useDownloadPdf();
  return (
    <Button
      variant="ghost"
      size="icon-xs"
      title="Télécharger PDF"
      disabled={isPending}
      onClick={() => download(invoiceId, invoiceNumber)}
    >
      {isPending ? <Spinner className="size-3" /> : <DownloadIcon />}
    </Button>
  );
}

export default function InvoicesPage() {
  const { data, isLoading } = useInvoices();
  const deleteMutation = useDeleteInvoice();
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'issueDate', desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: 'number',
      header: 'Numéro',
      cell: ({ row }) => (
        <Link
          href={`/dashboard/invoices/${row.original.id}`}
          className="font-medium text-foreground hover:text-primary transition-colors"
        >
          {row.original.number}
        </Link>
      ),
    },
    {
      accessorKey: 'client.name',
      header: 'Client',
      cell: ({ row }) => (
        <Text size="sm" variant="muted">
          {row.original.client.name}
        </Text>
      ),
    },
    {
      accessorKey: 'issueDate',
      header: ({ column }) => (
        <button
          type="button"
          className="flex items-center gap-1 text-xs font-medium text-foreground hover:text-primary"
          onClick={() => column.toggleSorting()}
        >
          Date <ArrowUpDownIcon className="size-3" />
        </button>
      ),
      cell: ({ row }) => (
        <Caption>{formatDate(row.original.issueDate)}</Caption>
      ),
    },
    {
      accessorKey: 'dueDate',
      header: 'Échéance',
      cell: ({ row }) => <Caption>{formatDate(row.original.dueDate)}</Caption>,
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'total',
      header: ({ column }) => (
        <button
          type="button"
          className="flex items-center gap-1 text-xs font-medium text-foreground hover:text-primary ml-auto"
          onClick={() => column.toggleSorting()}
        >
          Montant <ArrowUpDownIcon className="size-3" />
        </button>
      ),
      cell: ({ row }) => (
        <Text size="sm" weight="medium" className="text-right tabular-nums">
          {formatCurrency(row.original.total)}
        </Text>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <DownloadButton
            invoiceId={row.original.id}
            invoiceNumber={row.original.number}
          />
          <ConfirmDialog
            trigger={
              <Button variant="ghost" size="icon-xs" title="Supprimer">
                <TrashIcon className="text-destructive" />
              </Button>
            }
            title="Supprimer cette facture ?"
            description="Cette action est irréversible. La facture sera définitivement supprimée."
            confirmLabel="Supprimer"
            onConfirm={() =>
              deleteMutation.mutate(row.original.id, {
                onSuccess: () => toast.success('Facture supprimée'),
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
        title="Factures"
        description={
          data ? `${data.length} facture${data.length > 1 ? 's' : ''}` : ''
        }
        actions={
          <Button size="sm" asChild>
            <Link href="/dashboard/invoices/new">
              <PlusIcon />
              Nouvelle facture
            </Link>
          </Button>
        }
      />

      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <Input
          placeholder="Rechercher par numéro, client…"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-xs"
        />

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col divide-y divide-border">
              {Array.from({ length: 5 }).map(() => (
                <div
                  key={Math.random()}
                  className="flex items-center gap-4 px-4 py-3"
                >
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-16 ml-auto" />
                  <Skeleton className="h-5 w-14" />
                </div>
              ))}
            </div>
          ) : table.getRowModel().rows.length === 0 ? (
            <EmptyState
              icon={<FileTextIcon className="size-5" />}
              title="Aucune facture"
              description="Créez votre première facture pour commencer."
              action={
                <Button size="sm" asChild>
                  <Link href="/dashboard/invoices/new">
                    <PlusIcon />
                    Créer une facture
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
