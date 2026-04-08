import type { InvoiceStatus } from '@/lib/api';
import { cn } from '@/lib/utils';

const statusConfig: Record<
  InvoiceStatus,
  { label: string; className: string }
> = {
  DRAFT: {
    label: 'Brouillon',
    className: 'bg-muted text-muted-foreground border-border',
  },
  SENT: {
    label: 'Envoyée',
    className:
      'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
  },
  PAID: {
    label: 'Payée',
    className:
      'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-800',
  },
  OVERDUE: {
    label: 'En retard',
    className:
      'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800',
  },
};

interface StatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium tabular-nums',
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
