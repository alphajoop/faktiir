'use client';

import { useForm } from '@tanstack/react-form';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod/v4';
import { InvoiceGeneralSection } from '@/components/invoice-general-section';
import { InvoiceItemsEditor } from '@/components/invoice-items-editor';
import { InvoiceNotesSection } from '@/components/invoice-notes-section';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useClients, useCreateInvoice } from '@/lib/hooks';
import {
  emptyItem,
  type InvoiceLineItem,
  inDaysIso,
  todayIso,
} from '@/lib/invoice-utils';

const invoiceSchema = z.object({
  clientId: z.string().min(1, 'Sélectionnez un client'),
  issueDate: z.string().min(1, 'Requis'),
  dueDate: z.string().min(1, 'Requis'),
  tax: z.number().min(0).max(100),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        description: z.string().min(1, 'Requis'),
        quantity: z.number().min(1, '≥ 1'),
        unitPrice: z.number().min(0, '≥ 0'),
      }),
    )
    .min(1, 'Au moins une ligne'),
});

export default function NewInvoicePage() {
  const router = useRouter();
  const { data: clientList } = useClients();
  const createInvoice = useCreateInvoice();

  const [items, setItems] = useState<InvoiceLineItem[]>([emptyItem()]);
  const [tax, setTax] = useState(18);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const form = useForm({
    defaultValues: {
      clientId: '',
      issueDate: todayIso(),
      dueDate: inDaysIso(30),
      notes: '',
    },
    onSubmit: async ({ value }) => {
      const payload = { ...value, tax, items };
      const parsed = invoiceSchema.safeParse(payload);

      if (!parsed.success) {
        const errs: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
          errs[issue.path.join('.')] = issue.message;
        }
        setErrors(errs);
        toast.error('Corrigez les erreurs avant de continuer');
        return;
      }

      setErrors({});
      createInvoice.mutate(parsed.data, {
        onSuccess: (inv) => {
          toast.success(`Facture ${inv.number} créée`);
          router.push(`/dashboard/invoices/${inv.id}`);
        },
        onError: (e) => toast.error(e.message),
      });
    },
  });

  return (
    <>
      <PageHeader
        title="Nouvelle facture"
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/invoices">
              <ArrowLeftIcon />
              Retour
            </Link>
          </Button>
        }
      />

      <div className="flex flex-1 flex-col p-4 md:p-6">
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
                clientIdError={errors.clientId}
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
              <Link href="/dashboard/invoices">Annuler</Link>
            </Button>
            <Button type="submit" disabled={createInvoice.isPending}>
              {createInvoice.isPending && <Spinner className="mr-2 size-3.5" />}
              Créer la facture
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
