import { AlertTriangleIcon, RefreshCwIcon, WifiOffIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  description?: string;
  icon?: 'warning' | 'offline';
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Une erreur est survenue',
  description = 'Impossible de charger les données. Vérifiez votre connexion et réessayez.',
  icon = 'warning',
  onRetry,
  className,
}: ErrorStateProps) {
  const Icon = icon === 'offline' ? WifiOffIcon : AlertTriangleIcon;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-16 text-center',
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <Icon className="size-5" />
      </div>
      <div className="flex flex-col gap-1">
        <Text size="sm" weight="medium">
          {title}
        </Text>
        <Text size="sm" variant="muted" className="max-w-xs">
          {description}
        </Text>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-1">
          <RefreshCwIcon />
          Réessayer
        </Button>
      )}
    </div>
  );
}
