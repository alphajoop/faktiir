import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Caption, Text } from '@/components/ui/typography';
import { formatCurrency } from '@/lib/format';

interface InvoiceTotalsProps {
  subtotal: number;
  taxAmount: number;
  total: number;
  tax: number;
  /** When provided, the tax field becomes editable */
  onTaxChange?: (value: number) => void;
}

export function InvoiceTotals({
  subtotal,
  taxAmount,
  total,
  tax,
  onTaxChange,
}: InvoiceTotalsProps) {
  return (
    <div className="ml-auto flex flex-col gap-2 w-full max-w-xs">
      <div className="flex items-center justify-between">
        <Caption>Sous-total HT</Caption>
        <Text size="sm" className="tabular-nums">
          {formatCurrency(subtotal)}
        </Text>
      </div>

      <div className="flex items-center justify-between gap-4">
        <Caption className="shrink-0">
          {onTaxChange ? 'TVA (%)' : `TVA (${tax}%)`}
        </Caption>
        <div className="flex items-center gap-2">
          {onTaxChange ? (
            <Input
              type="number"
              min={0}
              max={100}
              value={tax}
              onChange={(e) => onTaxChange(parseFloat(e.target.value) || 0)}
              className="w-20 text-right tabular-nums"
            />
          ) : null}
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
  );
}
