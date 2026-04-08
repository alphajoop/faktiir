'use client';

import { useForm } from '@tanstack/react-form';
import { ArrowLeftIcon, PlusIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { DatePicker } from '@/components/date-picker';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Caption, Text } from '@/components/ui/typography';
import { formatCurrency } from '@/lib/format';
import { useClients, useInvoice, useUpdateInvoice } from '@/lib/hooks';

type Item = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};
const emptyItem = (): Item => ({
  id: crypto.randomUUID(),
  description: '',
  quantity: 1,
  unitPrice: 0,
});

function isoDate(d: string | Date) {
  return new Date(d).toISOString().split('T')[0];
}

export default function EditInvoicePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: invoice, isLoading } = useInvoice(id);
  const { data: clientList } = useClients();
  const updateInvoice = useUpdateInvoice();
  const [items, setItems] = useState<Item[]>([emptyItem()]);
  const [tax, setTax] = useState(18);

  useEffect(() => {
    if (invoice) {
      setItems(
        invoice.items.map((i) => ({
          id: crypto.randomUUID(),
          description: i.description,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
      );
      setTax(invoice.tax);
    }
  }, [invoice]);

  const subtotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const taxAmount = (subtotal * tax) / 100;
  const total = subtotal + taxAmount;

  const form = useForm({
    defaultValues: {
      clientId: invoice?.clientId ?? '',
      issueDate: invoice ? isoDate(invoice.issueDate) : '',
      dueDate: invoice ? isoDate(invoice.dueDate) : '',
      notes: invoice?.notes ?? '',
    },
    onSubmit: async ({ value }) => {
      updateInvoice.mutate(
        {
          id,
          ...value,
          tax,
          items: items.map(({ id: _, ...item }) => item),
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

  // Keep form in sync once invoice loads
  useEffect(() => {
    if (invoice) {
      form.setFieldValue('clientId', invoice.clientId);
      form.setFieldValue('issueDate', isoDate(invoice.issueDate));
      form.setFieldValue('dueDate', isoDate(invoice.dueDate));
      form.setFieldValue('notes', invoice.notes ?? '');
    }
  }, [invoice, form]);

  const updateItem = (idx: number, field: keyof Item, raw: string) => {
    setItems((prev) => {
      const next = [...prev];
      if (field === 'description') {
        next[idx] = { ...next[idx], description: raw };
      } else {
        const num = parseFloat(raw);
        next[idx] = { ...next[idx], [field]: Number.isNaN(num) ? 0 : num };
      }
      return next;
    });
  };

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
          <div className="mx-auto w-full max-w-3xl flex flex-col gap-4">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-56 w-full rounded-xl" />
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="mx-auto w-full max-w-3xl flex flex-col gap-6"
          >
            {/* General */}
            <section className="rounded-xl border border-border bg-card p-5 flex flex-col gap-5">
              <Text size="sm" weight="semibold">
                Informations générales
              </Text>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <form.Field name="clientId">
                  {(field) => (
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <Label>Client</Label>
                      <Select
                        value={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un client…" />
                        </SelectTrigger>
                        <SelectContent>
                          {clientList?.length === 0 && (
                            <div className="px-3 py-6 text-center">
                              <Text size="xs" variant="muted">
                                Aucun client.{' '}
                                <Link
                                  href="/dashboard/clients/new"
                                  className="text-primary underline-offset-4 hover:underline"
                                >
                                  Créer un client
                                </Link>
                              </Text>
                            </div>
                          )}
                          {clientList?.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </form.Field>
                <form.Field name="issueDate">
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <Label>Date d'émission</Label>
                      <DatePicker
                        value={field.state.value}
                        onChange={field.handleChange}
                      />
                    </div>
                  )}
                </form.Field>
                <form.Field name="dueDate">
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <Label>Date d'échéance</Label>
                      <DatePicker
                        value={field.state.value}
                        onChange={field.handleChange}
                      />
                    </div>
                  )}
                </form.Field>
              </div>
            </section>

            {/* Items */}
            <section className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Text size="sm" weight="semibold">
                  Lignes
                </Text>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setItems((p) => [...p, emptyItem()])}
                >
                  <PlusIcon />
                  Ajouter
                </Button>
              </div>

              <div className="hidden sm:grid grid-cols-[1fr_80px_110px_80px_32px] gap-2">
                <Caption>Description</Caption>
                <Caption className="text-right">Qté</Caption>
                <Caption className="text-right">Prix unit.</Caption>
                <Caption className="text-right">Total</Caption>
                <span />
              </div>

              <div className="flex flex-col gap-2">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 sm:grid-cols-[1fr_80px_110px_80px_32px] gap-2 items-start"
                  >
                    <Input
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(idx, 'description', e.target.value)
                      }
                    />
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(idx, 'quantity', e.target.value)
                      }
                      className="text-right tabular-nums"
                    />
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(idx, 'unitPrice', e.target.value)
                      }
                      className="text-right tabular-nums"
                    />
                    <div className="flex h-9 items-center justify-end">
                      <Text size="sm" weight="medium" className="tabular-nums">
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </Text>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() =>
                        setItems((p) => p.filter((_, i) => i !== idx))
                      }
                      disabled={items.length === 1}
                    >
                      <TrashIcon className="text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="ml-auto flex flex-col gap-2 w-full max-w-xs">
                <div className="flex items-center justify-between">
                  <Caption>Sous-total HT</Caption>
                  <Text size="sm" className="tabular-nums">
                    {formatCurrency(subtotal)}
                  </Text>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <Caption className="shrink-0">TVA (%)</Caption>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={tax}
                      onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                      className="w-20 text-right tabular-nums"
                    />
                    <Text size="sm" className="tabular-nums shrink-0">
                      {formatCurrency(taxAmount)}
                    </Text>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Text size="sm" weight="semibold">
                    Total TTC
                  </Text>
                  <Text size="sm" weight="semibold" className="tabular-nums">
                    {formatCurrency(total)}
                  </Text>
                </div>
              </div>
            </section>

            {/* Notes */}
            <section className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
              <Text size="sm" weight="semibold">
                Notes
              </Text>
              <form.Field name="notes">
                {(field) => (
                  <Textarea
                    placeholder="Conditions de paiement, remerciements…"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={3}
                  />
                )}
              </form.Field>
            </section>

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
