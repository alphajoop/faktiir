'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { MailIcon, PhoneIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import { SortButton } from '@/components/ui/data-table';
import { Caption } from '@/components/ui/typography';
import type { Client, ClientsQuery } from '@/lib/api';
import { useDeleteClient } from '@/lib/hooks';

type SortField = ClientsQuery['sortBy'];

function DeleteCell({ client }: { client: Client }) {
  const deleteMutation = useDeleteClient();
  return (
    <ConfirmDialog
      trigger={
        <Button variant="ghost" size="icon-xs" title="Supprimer">
          <TrashIcon className="text-destructive" />
        </Button>
      }
      title={`Supprimer "${client.name}" ?`}
      description="Ce client sera définitivement supprimé. Ses factures associées ne seront pas supprimées."
      confirmLabel="Supprimer"
      onConfirm={() =>
        deleteMutation.mutate(client.id, {
          onSuccess: () => toast.success('Client supprimé'),
          onError: (e) => toast.error(e.message),
        })
      }
    />
  );
}

export function getClientColumns(
  sortBy: SortField,
  order: 'asc' | 'desc',
  onSort: (field: SortField) => void,
): ColumnDef<Client>[] {
  return [
    {
      accessorKey: 'name',
      header: () => (
        <div className="flex items-center gap-1">
          Nom
          <SortButton
            active={sortBy === 'name'}
            order={order}
            onClick={() => onSort('name')}
          />
        </div>
      ),
      cell: ({ row }) => (
        <Link
          href={`/dashboard/clients/${row.original.id}`}
          className="font-medium text-foreground transition-colors hover:text-primary"
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
            className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
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
            className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
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
          <DeleteCell client={row.original} />
        </div>
      ),
    },
  ];
}
