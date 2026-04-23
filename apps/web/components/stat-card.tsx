import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { Caption, Text } from '@/components/ui/typography';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  sub?: string;
  trend?: { value: number | null; suffix?: string };
  iconColor?: string;
  iconBg?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  trend,
  iconColor = 'text-muted-foreground',
  iconBg = 'bg-muted',
}: StatCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <Caption>{label}</Caption>
        <div
          className={`flex size-7 items-center justify-center rounded-md ${iconBg}`}
        >
          <Icon className={`size-3.5 ${iconColor}`} />
        </div>
      </div>
      <Text size="lg" weight="semibold" className="font-heading tabular-nums">
        {value}
      </Text>
      {trend && trend.value !== null ? (
        <div className="flex items-center gap-1">
          {trend.value >= 0 ? (
            <ArrowUpIcon className="size-3 text-green-600 dark:text-green-400" />
          ) : (
            <ArrowDownIcon className="size-3 text-red-600 dark:text-red-400" />
          )}
          <Caption
            className={
              trend.value >= 0
                ? 'text-green-700 dark:text-green-400'
                : 'text-red-700 dark:text-red-400'
            }
          >
            {trend.value >= 0 ? '+' : ''}
            {trend.value}%{trend.suffix ?? ' vs année précédente'}
          </Caption>
        </div>
      ) : sub ? (
        <Caption>{sub}</Caption>
      ) : null}
    </div>
  );
}
