'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Caption, Text } from '@/components/ui/typography';
import type { User } from '@/lib/api';
import { users } from '@/lib/api';
import { qk } from '@/lib/hooks';

interface InvoiceNumberingSectionProps {
  user: User;
}

/**
 * Génère un aperçu du numéro de facture selon les paramètres
 */
function previewNumber(
  prefix: string,
  nextNumber: number,
  padding: number,
): string {
  const p = prefix.trim().toUpperCase() || 'FAK';
  const padded = String(nextNumber).padStart(
    Math.max(1, Math.min(8, padding)),
    '0',
  );
  return `${p}-${padded}`;
}

export function InvoiceNumberingSection({
  user,
}: InvoiceNumberingSectionProps) {
  const qc = useQueryClient();

  const [prefix, setPrefix] = useState(user.invoicePrefix ?? 'FAK');
  const [nextNumber, setNextNumber] = useState(user.invoiceNextNumber ?? 1);
  const [padding, setPadding] = useState(user.invoicePadding ?? 4);

  // Sync si le user change (ex: après refetch)
  useEffect(() => {
    setPrefix(user.invoicePrefix ?? 'FAK');
    setNextNumber(user.invoiceNextNumber ?? 1);
    setPadding(user.invoicePadding ?? 4);
  }, [user]);

  const mutation = useMutation({
    mutationFn: () =>
      users.updateInvoiceNumbering({
        invoicePrefix: prefix.trim().toUpperCase() || 'FAK',
        invoiceNextNumber: nextNumber,
        invoicePadding: padding,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.profile });
      toast.success('Numérotation mise à jour');
    },
    onError: (e) => toast.error(e.message),
  });

  const prefixError =
    prefix.trim() && !/^[A-Za-z0-9-]+$/.test(prefix.trim())
      ? 'Lettres, chiffres et tirets uniquement'
      : null;

  const isDirty =
    prefix.trim().toUpperCase() !== (user.invoicePrefix ?? 'FAK') ||
    nextNumber !== (user.invoiceNextNumber ?? 1) ||
    padding !== (user.invoicePadding ?? 4);

  return (
    <section className="rounded-xl border border-border bg-card p-5 flex flex-col gap-5">
      <div>
        <Text size="sm" weight="semibold">
          Numérotation des factures
        </Text>
        <Caption>
          Personnalisez le format du numéro de facture généré automatiquement.
        </Caption>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Préfixe */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="invoice-prefix">Préfixe</Label>
          <Input
            id="invoice-prefix"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value.toUpperCase())}
            placeholder="FAK"
            maxLength={10}
            className="font-mono uppercase"
            aria-invalid={!!prefixError}
          />
          {prefixError ? (
            <Text size="xs" variant="destructive">
              {prefixError}
            </Text>
          ) : (
            <Caption>Ex : FAK, INV, FACT, SARL</Caption>
          )}
        </div>

        {/* Prochain numéro */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="invoice-next">Prochain numéro</Label>
          <Input
            id="invoice-next"
            type="number"
            min={1}
            value={nextNumber}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!Number.isNaN(v) && v >= 1) setNextNumber(v);
            }}
            className="tabular-nums"
          />
          <Caption>La prochaine facture utilisera ce numéro</Caption>
        </div>

        {/* Padding */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="invoice-padding">Chiffres minimum</Label>
          <Input
            id="invoice-padding"
            type="number"
            min={1}
            max={8}
            value={padding}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!Number.isNaN(v) && v >= 1 && v <= 8) setPadding(v);
            }}
            className="tabular-nums"
          />
          <Caption>Zéros de remplissage à gauche</Caption>
        </div>
      </div>

      {/* Preview */}
      <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
        <Caption>Aperçu :</Caption>
        <span className="font-mono text-sm font-semibold text-foreground tracking-wider">
          {previewNumber(prefix, nextNumber, padding)}
        </span>
        <Caption className="ml-auto">
          puis{' '}
          <span className="font-mono text-foreground">
            {previewNumber(prefix, nextNumber + 1, padding)}
          </span>
          ,{' '}
          <span className="font-mono text-foreground">
            {previewNumber(prefix, nextNumber + 2, padding)}
          </span>
          …
        </Caption>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || !!prefixError || !isDirty}
          size="sm"
        >
          {mutation.isPending && <Spinner className="size-3.5" />}
          Enregistrer
        </Button>
      </div>
    </section>
  );
}
