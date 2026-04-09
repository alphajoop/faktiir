'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { DownloadIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { SortButton } from '@/components/ui/data-table';
import { Spinner } from '@/components/ui/spinner';
import { Caption, Text } from '@/components/ui/typography';
import type { Invoice, InvoicesQuery } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/format';
import { useDeleteInvoice } from '@/lib/hooks';
import { useDownloadPdf } from '@/lib/use-download-pdf';

type SortField = InvoicesQuery['sortBy'];

function DownloadCell({
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

function DeleteCell({ invoice }: { invoice: Invoice }) {
  const deleteMutation = useDeleteInvoice();
  return (
    <ConfirmDialog
      trigger={
        <Button variant="ghost" size="icon-xs" title="Supprimer">
          <TrashIcon className="text-destructive" />
        </Button>
      }
      title="Supprimer cette facture ?"
      description="Cette action est irréversible."
      confirmLabel="Supprimer"
      onConfirm={() =>
        deleteMutation.mutate(invoice.id, {
          onSuccess: () => toast.success('Facture supprimée'),
          onError: (e) => toast.error(e.message),
        })
      }
    />
  );
}

export function getInvoiceColumns(
  sortBy: SortField,
  order: 'asc' | 'desc',
  onSort: (field: SortField) => void,
): ColumnDef<Invoice>[] {
  return [
    {
      accessorKey: 'number',
      header: () => (
        <div className="flex items-center gap-1">
          Numéro
          <SortButton
            active={sortBy === 'number'}
            order={order}
            onClick={() => onSort('number')}
          />
        </div>
      ),
      cell: ({ row }) => (
        <Link
          href={`/dashboard/invoices/${row.original.id}`}
          className="font-medium text-foreground transition-colors hover:text-primary"
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
      header: () => (
        <div className="flex items-center gap-1">
          Date
          <SortButton
            active={sortBy === 'issueDate'}
            order={order}
            onClick={() => onSort('issueDate')}
          />
        </div>
      ),
      cell: ({ row }) => (
        <Caption>{formatDate(row.original.issueDate)}</Caption>
      ),
    },
    {
      accessorKey: 'dueDate',
      header: () => (
        <div className="flex items-center gap-1">
          Échéance
          <SortButton
            active={sortBy === 'dueDate'}
            order={order}
            onClick={() => onSort('dueDate')}
          />
        </div>
      ),
      cell: ({ row }) => <Caption>{formatDate(row.original.dueDate)}</Caption>,
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'total',
      header: () => (
        <div className="flex items-center justify-end gap-1">
          Montant
          <SortButton
            active={sortBy === 'total'}
            order={order}
            onClick={() => onSort('total')}
          />
        </div>
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
          <DownloadCell
            invoiceId={row.original.id}
            invoiceNumber={row.original.number}
          />
          <DeleteCell invoice={row.original} />
        </div>
      ),
    },
  ];
}
