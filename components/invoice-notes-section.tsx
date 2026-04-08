import { Textarea } from '@/components/ui/textarea';
import { Text } from '@/components/ui/typography';

interface InvoiceNotesSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export function InvoiceNotesSection({
  value,
  onChange,
}: InvoiceNotesSectionProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
      <Text size="sm" weight="semibold">
        Notes
      </Text>
      <Textarea
        placeholder="Conditions de paiement, remerciements…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
      />
    </section>
  );
}
