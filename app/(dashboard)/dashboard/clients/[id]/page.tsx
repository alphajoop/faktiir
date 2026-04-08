'use client';

import {
  ArrowLeftIcon,
  EditIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  ReceiptIcon,
  TrashIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Caption, Text } from '@/components/ui/typography';
import { formatCurrency, formatDate } from '@/lib/format';
import { useClient, useDeleteClient, useInvoices } from '@/lib/hooks';

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: client, isLoading } = useClient(id);
  const { data: allInvoices } = useInvoices();
  const deleteClient = useDeleteClient();

  const clientInvoices =
    allInvoices?.filter((inv) => inv.clientId === id) ?? [];

  const handleDelete = () => {
    if (
      !confirm(
        `Supprimer "${client?.name}" ? Ses factures ne seront pas supprimées.`,
      )
    )
      return;
    deleteClient.mutate(id, {
      onSuccess: () => {
        toast.success('Client supprimé');
        router.push('/dashboard/clients');
      },
      onError: (e) => toast.error(e.message),
    });
  };

  return (
    <>
      <PageHeader
        title={isLoading ? 'Client' : (client?.name ?? 'Client')}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/clients">
                <ArrowLeftIcon />
                Retour
              </Link>
            </Button>
            {client && (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/clients/${id}/edit`}>
                    <EditIcon />
                    Modifier
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={handleDelete}
                  disabled={deleteClient.isPending}
                  title="Supprimer"
                >
                  <TrashIcon className="text-destructive" />
                </Button>
              </>
            )}
          </div>
        }
      />

      <div className="flex flex-1 flex-col p-4 md:p-6">
        {isLoading ? (
          <div className="mx-auto w-full max-w-3xl flex flex-col gap-4">
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        ) : !client ? (
          <Text size="sm" variant="muted">
            Client introuvable.
          </Text>
        ) : (
          <div className="mx-auto w-full max-w-3xl flex flex-col gap-5">
            {/* Info card */}
            <section className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
              <Text size="sm" weight="semibold">
                Coordonnées
              </Text>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {client.email && (
                  <a
                    href={`mailto:${client.email}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <MailIcon className="size-3.5 shrink-0" />
                    <Text size="sm">{client.email}</Text>
                  </a>
                )}
                {client.phone && (
                  <a
                    href={`tel:${client.phone}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <PhoneIcon className="size-3.5 shrink-0" />
                    <Text size="sm">{client.phone}</Text>
                  </a>
                )}
                {client.address && (
                  <div className="flex items-start gap-2 text-muted-foreground sm:col-span-2">
                    <MapPinIcon className="size-3.5 shrink-0 mt-0.5" />
                    <Text size="sm">{client.address}</Text>
                  </div>
                )}
                {!client.email && !client.phone && !client.address && (
                  <Caption>Aucune coordonnée renseignée.</Caption>
                )}
              </div>
            </section>

            {/* Invoices */}
            <section className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <Text size="sm" weight="semibold">
                  Factures
                </Text>
                <Button size="sm" asChild>
                  <Link href={`/dashboard/invoices/new`}>Nouvelle facture</Link>
                </Button>
              </div>

              {clientInvoices.length === 0 ? (
                <EmptyState
                  icon={<ReceiptIcon className="size-5" />}
                  title="Aucune facture"
                  description="Ce client n'a pas encore de facture."
                />
              ) : (
                <div className="divide-y divide-border">
                  {clientInvoices.map((inv) => (
                    <Link
                      key={inv.id}
                      href={`/dashboard/invoices/${inv.id}`}
                      className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/40"
                    >
                      <div className="min-w-0 flex-1">
                        <Text size="sm" weight="medium" className="truncate">
                          {inv.number}
                        </Text>
                        <Caption className="block">
                          {formatDate(inv.issueDate)} · échéance{' '}
                          {formatDate(inv.dueDate)}
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
            </section>
          </div>
        )}
      </div>
    </>
  );
}
