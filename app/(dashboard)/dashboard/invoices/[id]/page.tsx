'use client';

import { ArrowLeftIcon, DownloadIcon, EditIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { Caption, Text } from '@/components/ui/typography';
import type { InvoiceStatus } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/format';
import { useDeleteInvoice, useInvoice, useUpdateInvoice } from '@/lib/hooks';
import { useDownloadPdf } from '@/lib/use-download-pdf';

const STATUS_TRANSITIONS: Record<
  InvoiceStatus,
  { label: string; next: InvoiceStatus }[]
> = {
  DRAFT: [{ label: 'Marquer comme envoyée', next: 'SENT' }],
  SENT: [
    { label: 'Marquer comme payée', next: 'PAID' },
    { label: 'Marquer en retard', next: 'OVERDUE' },
  ],
  PAID: [],
  OVERDUE: [{ label: 'Marquer comme payée', next: 'PAID' }],
};

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: invoice, isLoading } = useInvoice(id);
  const updateInvoice = useUpdateInvoice();
  const deleteInvoice = useDeleteInvoice();
  const { download, isPending: isDownloading } = useDownloadPdf();

  const handleStatusChange = (next: InvoiceStatus) => {
    updateInvoice.mutate(
      { id, status: next },
      {
        onSuccess: () => toast.success('Statut mis à jour'),
        onError: (e) => toast.error(e.message),
      },
    );
  };

  const handleDelete = () => {
    deleteInvoice.mutate(id, {
      onSuccess: () => {
        toast.success('Facture supprimée');
        router.push('/dashboard/invoices');
      },
      onError: (e) => toast.error(e.message),
    });
  };

  return (
    <>
      <PageHeader
        title={isLoading ? 'Facture' : (invoice?.number ?? 'Facture')}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/invoices">
                <ArrowLeftIcon />
                Retour
              </Link>
            </Button>
            {invoice && (
              <>
                {/* PDF — Authorization header, pas query param */}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isDownloading}
                  onClick={() => download(invoice.id, invoice.number)}
                >
                  {isDownloading ? (
                    <Spinner className="size-3.5" />
                  ) : (
                    <DownloadIcon />
                  )}
                  PDF
                </Button>

                {/* Transitions de statut */}
                {STATUS_TRANSITIONS[invoice.status].map((t) => (
                  <Button
                    key={t.next}
                    size="sm"
                    variant="outline"
                    disabled={updateInvoice.isPending}
                    onClick={() => handleStatusChange(t.next)}
                  >
                    {t.label}
                  </Button>
                ))}

                {/* Modifier */}
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/dashboard/invoices/${id}/edit`}>
                    <EditIcon />
                    Modifier
                  </Link>
                </Button>

                {/* Supprimer */}
                <ConfirmDialog
                  trigger={
                    <Button
                      size="icon-sm"
                      variant="outline"
                      disabled={deleteInvoice.isPending}
                      title="Supprimer"
                    >
                      <TrashIcon className="text-destructive" />
                    </Button>
                  }
                  title="Supprimer cette facture ?"
                  description="Cette action est irréversible. La facture sera définitivement supprimée."
                  confirmLabel="Supprimer"
                  onConfirm={handleDelete}
                />
              </>
            )}
          </div>
        }
      />

      <div className="flex flex-1 flex-col p-4 md:p-6">
        {isLoading ? (
          <div className="mx-auto w-full max-w-3xl flex flex-col gap-4">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        ) : !invoice ? (
          <Text size="sm" variant="muted">
            Facture introuvable.
          </Text>
        ) : (
          <div className="mx-auto w-full max-w-3xl flex flex-col gap-5">
            {/* En-tête */}
            <section className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <Text
                    size="lg"
                    weight="semibold"
                    className="font-heading tabular-nums"
                  >
                    {invoice.number}
                  </Text>
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge status={invoice.status} />
                    <Caption>émise le {formatDate(invoice.issueDate)}</Caption>
                    <Caption>· échéance {formatDate(invoice.dueDate)}</Caption>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Text size="xs" variant="muted">
                    Total TTC
                  </Text>
                  <Text size="lg" weight="semibold" className="tabular-nums">
                    {formatCurrency(invoice.total)}
                  </Text>
                </div>
              </div>
            </section>

            {/* Émetteur + Client */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <section className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2">
                <Caption>Émetteur</Caption>
                <Text size="sm" weight="medium">
                  {invoice.user?.companyName ?? invoice.user?.name}
                </Text>
                <Text size="sm" variant="muted">
                  {invoice.user?.email}
                </Text>
              </section>
              <section className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2">
                <Caption>Facturé à</Caption>
                <Text size="sm" weight="medium">
                  {invoice.client.name}
                </Text>
                {invoice.client.email && (
                  <Text size="sm" variant="muted">
                    {invoice.client.email}
                  </Text>
                )}
                {invoice.client.address && (
                  <Text size="sm" variant="muted">
                    {invoice.client.address}
                  </Text>
                )}
                {invoice.client.phone && (
                  <Text size="sm" variant="muted">
                    {invoice.client.phone}
                  </Text>
                )}
              </section>
            </div>

            {/* Lignes */}
            <section className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
              <Text size="sm" weight="semibold">
                Lignes
              </Text>

              <div className="hidden sm:grid grid-cols-[1fr_60px_110px_110px] gap-2 pb-1 border-b border-border">
                <Caption>Description</Caption>
                <Caption className="text-right">Qté</Caption>
                <Caption className="text-right">Prix unit.</Caption>
                <Caption className="text-right">Total</Caption>
              </div>

              <div className="flex flex-col divide-y divide-border">
                {invoice.items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 sm:grid-cols-[1fr_60px_110px_110px] gap-1 sm:gap-2 py-2.5 first:pt-0"
                  >
                    <Text size="sm">{item.description}</Text>
                    <Text
                      size="sm"
                      variant="muted"
                      className="sm:text-right tabular-nums"
                    >
                      {item.quantity}
                    </Text>
                    <Text
                      size="sm"
                      variant="muted"
                      className="sm:text-right tabular-nums"
                    >
                      {formatCurrency(item.unitPrice)}
                    </Text>
                    <Text
                      size="sm"
                      weight="medium"
                      className="sm:text-right tabular-nums"
                    >
                      {formatCurrency(item.total)}
                    </Text>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="ml-auto flex flex-col gap-1.5 w-full max-w-xs">
                {(() => {
                  const subtotal = invoice.items.reduce(
                    (s, i) => s + i.total,
                    0,
                  );
                  const taxAmount = (subtotal * invoice.tax) / 100;
                  return (
                    <>
                      <div className="flex items-center justify-between">
                        <Caption>Sous-total HT</Caption>
                        <Text size="sm" className="tabular-nums">
                          {formatCurrency(subtotal)}
                        </Text>
                      </div>
                      <div className="flex items-center justify-between">
                        <Caption>TVA ({invoice.tax}%)</Caption>
                        <Text size="sm" className="tabular-nums">
                          {formatCurrency(taxAmount)}
                        </Text>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <Text size="sm" weight="semibold">
                          Total TTC
                        </Text>
                        <Text
                          size="sm"
                          weight="semibold"
                          className="tabular-nums"
                        >
                          {formatCurrency(invoice.total)}
                        </Text>
                      </div>
                    </>
                  );
                })()}
              </div>
            </section>

            {/* Notes */}
            {invoice.notes && (
              <section className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2">
                <Caption>Notes</Caption>
                <Text size="sm" variant="muted">
                  {invoice.notes}
                </Text>
              </section>
            )}
          </div>
        )}
      </div>
    </>
  );
}
