'use client';

import { useForm } from '@tanstack/react-form';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { InvoiceGeneralSection } from '@/components/invoice-general-section';
import { InvoiceItemsEditor } from '@/components/invoice-items-editor';
import { InvoiceNotesSection } from '@/components/invoice-notes-section';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { useClients, useInvoice, useUpdateInvoice } from '@/lib/hooks';
import { emptyItem, type InvoiceLineItem, isoDate } from '@/lib/invoice-utils';

export default function EditInvoicePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: invoice, isLoading } = useInvoice(id);
  const { data: clientList } = useClients();
  const updateInvoice = useUpdateInvoice();

  const [items, setItems] = useState<InvoiceLineItem[]>([emptyItem()]);
  const [tax, setTax] = useState(18);

  const form = useForm({
    defaultValues: {
      clientId: '',
      issueDate: '',
      dueDate: '',
      notes: '',
    },
    onSubmit: async ({ value }) => {
      updateInvoice.mutate(
        {
          id,
          ...value,
          tax,
          items: items.map(({ id: _id, ...item }) => item),
        },
        {
          onSuccess: () => {
            toast.success('Facture mise à jour');
            router.push(`/dashboard/invoices/${id}`);
          },
          onError: (e) => toast.error(e.message),
        },
      );
    },
  });

  // Sync form once invoice is loaded
  useEffect(() => {
    if (!invoice) return;
    form.setFieldValue('clientId', invoice.clientId);
    form.setFieldValue('issueDate', isoDate(invoice.issueDate));
    form.setFieldValue('dueDate', isoDate(invoice.dueDate));
    form.setFieldValue('notes', invoice.notes ?? '');
    setTax(invoice.tax);
    setItems(
      invoice.items.map((i) => ({
        id: crypto.randomUUID(),
        description: i.description,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
    );
  }, [invoice, form]);

  return (
    <>
      <PageHeader
        title={`Modifier ${invoice?.number ?? 'la facture'}`}
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/invoices/${id}`}>
              <ArrowLeftIcon />
              Retour
            </Link>
          </Button>
        }
      />

      <div className="flex flex-1 flex-col p-4 md:p-6">
        {isLoading ? (
          <EditSkeleton />
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="mx-auto w-full max-w-3xl flex flex-col gap-6"
          >
            <form.Subscribe selector={(s) => s.values}>
              {(values) => (
                <InvoiceGeneralSection
                  clients={clientList}
                  clientId={values.clientId}
                  issueDate={values.issueDate}
                  dueDate={values.dueDate}
                  onClientChange={(v) => form.setFieldValue('clientId', v)}
                  onIssueDateChange={(v) => form.setFieldValue('issueDate', v)}
                  onDueDateChange={(v) => form.setFieldValue('dueDate', v)}
                />
              )}
            </form.Subscribe>

            <InvoiceItemsEditor
              items={items}
              tax={tax}
              onItemsChange={setItems}
              onTaxChange={setTax}
              confirmDelete={false}
            />

            <form.Field name="notes">
              {(field) => (
                <InvoiceNotesSection
                  value={field.state.value}
                  onChange={field.handleChange}
                />
              )}
            </form.Field>

            <div className="flex items-center justify-end gap-3 pb-8">
              <Button type="button" variant="outline" asChild>
                <Link href={`/dashboard/invoices/${id}`}>Annuler</Link>
              </Button>
              <Button type="submit" disabled={updateInvoice.isPending}>
                {updateInvoice.isPending && (
                  <Spinner className="mr-2 size-3.5" />
                )}
                Enregistrer
              </Button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

function EditSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl flex flex-col gap-4">
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-56 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-xl" />
    </div>
  );
}
