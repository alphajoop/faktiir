'use client';

import { PlusIcon, TrashIcon } from 'lucide-react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { InvoiceTotals } from '@/components/invoice-totals';
import { NumericInput } from '@/components/numeric-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Caption, Text } from '@/components/ui/typography';
import { formatCurrency } from '@/lib/format';
import {
  computeTotals,
  emptyItem,
  type InvoiceLineItem,
} from '@/lib/invoice-utils';

interface InvoiceItemsEditorProps {
  items: InvoiceLineItem[];
  tax: number;
  onItemsChange: (items: InvoiceLineItem[]) => void;
  onTaxChange: (tax: number) => void;
  /** When true, deletion requires a confirm dialog */
  confirmDelete?: boolean;
}

export function InvoiceItemsEditor({
  items,
  tax,
  onItemsChange,
  onTaxChange,
  confirmDelete = true,
}: InvoiceItemsEditorProps) {
  const { subtotal, taxAmount, total } = computeTotals(items, tax);

  const updateItem = (
    idx: number,
    field: keyof Omit<InvoiceLineItem, 'id'>,
    value: string | number,
  ) => {
    onItemsChange(
      items.map((item, i) => {
        if (i !== idx) return item;
        return { ...item, [field]: value };
      }),
    );
  };

  const removeItem = (id: string) =>
    onItemsChange(items.filter((item) => item.id !== id));

  const addItem = () => onItemsChange([...items, emptyItem()]);

  return (
    <section className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Text size="sm" weight="semibold">
          Lignes de facturation
        </Text>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <PlusIcon />
          Ajouter
        </Button>
      </div>

      {/* Column headers – desktop only */}
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
            className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_80px_110px_80px_32px] items-start"
          >
            <Input
              placeholder="Description du service ou produit"
              value={item.description}
              onChange={(e) => updateItem(idx, 'description', e.target.value)}
            />

            {/* Quantité — entiers uniquement */}
            <NumericInput
              value={item.quantity}
              onChange={(v) => updateItem(idx, 'quantity', v)}
              min={1}
              placeholder="1"
              allowDecimal={false}
            />

            {/* Prix unitaire — décimaux autorisés */}
            <NumericInput
              value={item.unitPrice}
              onChange={(v) => updateItem(idx, 'unitPrice', v)}
              min={0}
              placeholder="0"
              allowDecimal
            />

            {/* Total ligne */}
            <div className="flex h-9 items-center justify-end">
              <Text size="sm" weight="medium" className="tabular-nums">
                {formatCurrency(item.quantity * item.unitPrice)}
              </Text>
            </div>

            <DeleteButton
              disabled={items.length === 1}
              confirm={confirmDelete && items.length > 1}
              onConfirm={() => removeItem(item.id)}
            />
          </div>
        ))}
      </div>

      <Separator />

      <InvoiceTotals
        subtotal={subtotal}
        taxAmount={taxAmount}
        total={total}
        tax={tax}
        onTaxChange={onTaxChange}
      />
    </section>
  );
}

function DeleteButton({
  disabled,
  confirm,
  onConfirm,
}: {
  disabled: boolean;
  confirm: boolean;
  onConfirm: () => void;
}) {
  const icon = (
    <TrashIcon
      className={disabled ? 'text-muted-foreground' : 'text-destructive'}
    />
  );

  if (disabled) {
    return (
      <Button type="button" variant="ghost" size="icon-xs" disabled>
        {icon}
      </Button>
    );
  }

  if (!confirm) {
    return (
      <Button type="button" variant="ghost" size="icon-xs" onClick={onConfirm}>
        {icon}
      </Button>
    );
  }

  return (
    <ConfirmDialog
      trigger={
        <Button type="button" variant="ghost" size="icon-xs">
          {icon}
        </Button>
      }
      title="Supprimer cette ligne ?"
      description="Cette ligne sera retirée de la facture."
      confirmLabel="Supprimer"
      onConfirm={onConfirm}
    />
  );
}
