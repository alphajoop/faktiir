import { Text } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-16 text-center',
        className,
      )}
    >
      {icon && (
        <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-1">
        <Text size="sm" weight="medium">
          {title}
        </Text>
        {description && (
          <Text size="sm" variant="muted">
            {description}
          </Text>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
