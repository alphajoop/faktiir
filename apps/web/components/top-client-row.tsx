import Link from 'next/link';
import { Caption, Text } from '@/components/ui/typography';
import type { TopClient } from '@/lib/api';
import { formatCurrency } from '@/lib/format';

interface TopClientRowProps {
  client: TopClient;
  maxTotal: number;
  rank: number;
}

export function TopClientRow({ client, maxTotal, rank }: TopClientRowProps) {
  const widthPct = maxTotal > 0 ? (client.total / maxTotal) * 100 : 0;

  return (
    <Link
      href={`/dashboard/clients/${client.id}`}
      className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/40"
    >
      <span className="w-4 shrink-0 text-center text-xs font-semibold tabular-nums text-muted-foreground">
        {rank}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 mb-1">
          <Text
            size="sm"
            weight="medium"
            className="truncate group-hover:text-primary transition-colors"
          >
            {client.name}
          </Text>
          <Text size="sm" weight="semibold" className="tabular-nums shrink-0">
            {formatCurrency(client.total)}
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary/70 transition-all duration-500"
              style={{ width: `${widthPct}%` }}
            />
          </div>
          <Caption className="shrink-0 tabular-nums">
            {client.paidCount}/{client.invoiceCount}
          </Caption>
        </div>
      </div>
    </Link>
  );
}
