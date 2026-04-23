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
  /** Erreurs indexées par chemin Zod, ex: { 'items.0.description': 'Requis' } */
  errors?: Record<string, string>;
  /** Callback pour nettoyer les erreurs */
  onErrorsChange?: (errors: Record<string, string>) => void;
}

export function InvoiceItemsEditor({
  items,
  tax,
  onItemsChange,
  onTaxChange,
  confirmDelete = true,
  errors = {},
  onErrorsChange,
}: InvoiceItemsEditorProps) {
  const { subtotal, taxAmount, total } = computeTotals(items, tax);

  const updateItem = (
    idx: number,
    field: keyof Omit<InvoiceLineItem, 'id'>,
    value: string | number,
  ) => {
    const updatedItems = items.map((item, i) =>
      i !== idx ? item : { ...item, [field]: value },
    );

    // Nettoyer les erreurs pour ce champ spécifique
    const errorKey = `items.${idx}.${field}`;
    if (errors[errorKey]) {
      // Créer un nouvel objet errors sans cette erreur
      const newErrors = { ...errors };
      delete newErrors[errorKey];

      // Notifier le parent des erreurs mises à jour
      onErrorsChange?.(newErrors);
    }

    onItemsChange(updatedItems);
  };

  const removeItem = (id: string) =>
    onItemsChange(items.filter((item) => item.id !== id));

  const addItem = () => onItemsChange([...items, emptyItem()]);

  const globalError = errors.items;

  return (
    <section className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <Text size="sm" weight="semibold">
            Lignes de facturation
          </Text>
          {globalError && (
            <Text size="xs" variant="destructive">
              {globalError}
            </Text>
          )}
        </div>
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

      <div className="flex flex-col gap-3">
        {items.map((item, idx) => {
          const descError = errors[`items.${idx}.description`];
          const qtyError = errors[`items.${idx}.quantity`];
          const priceError = errors[`items.${idx}.unitPrice`];

          return (
            <div key={item.id} className="flex flex-col gap-1.5">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_80px_110px_80px_32px] items-start">
                <div className="flex flex-col gap-1">
                  <Input
                    placeholder="Description du service ou produit"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(idx, 'description', e.target.value)
                    }
                    aria-invalid={!!descError}
                    className={
                      descError
                        ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20'
                        : ''
                    }
                  />
                  {descError && (
                    <Text size="xs" variant="destructive">
                      {descError}
                    </Text>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <NumericInput
                    value={item.quantity}
                    onChange={(v) => updateItem(idx, 'quantity', v)}
                    min={1}
                    placeholder="1"
                    allowDecimal={false}
                    className={
                      qtyError
                        ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20'
                        : ''
                    }
                  />
                  {qtyError && (
                    <Text size="xs" variant="destructive">
                      {qtyError}
                    </Text>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <NumericInput
                    value={item.unitPrice}
                    onChange={(v) => updateItem(idx, 'unitPrice', v)}
                    min={0}
                    placeholder="0"
                    allowDecimal
                    className={
                      priceError
                        ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20'
                        : ''
                    }
                  />
                  {priceError && (
                    <Text size="xs" variant="destructive">
                      {priceError}
                    </Text>
                  )}
                </div>

                <div className="flex h-9 items-center justify-end">
                  <Text size="sm" weight="medium" className="tabular-nums">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </Text>
                </div>

                <div className="flex h-9 items-center">
                  <DeleteButton
                    disabled={items.length === 1}
                    confirm={confirmDelete && items.length > 1}
                    onConfirm={() => removeItem(item.id)}
                  />
                </div>
              </div>
            </div>
          );
        })}
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
