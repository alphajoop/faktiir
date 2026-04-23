import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface TableSkeletonProps {
  rows?: number;
  /** Widths for each skeleton column, e.g. ['w-20', 'w-28', 'w-16'] */
  cols: string[];
  /** Last column is right-aligned */
  lastRight?: boolean;
  className?: string;
}

/**
 * Generic table-row skeleton.
 * Keys are stable indices — no Math.random().
 */
export function TableSkeleton({
  rows = 4,
  cols,
  lastRight = true,
  className,
}: TableSkeletonProps) {
  let rowCounter = 0;
  let cellCounter = 0;

  return (
    <div className={cn('flex flex-col divide-y divide-border', className)}>
      {Array.from({ length: rows }).map(() => {
        const rowId = `skeleton-row-${++rowCounter}`;
        return (
          <div key={rowId} className="flex items-center gap-4 px-4 py-3">
            {cols.map((width) => {
              const cellId = `skeleton-cell-${++cellCounter}`;
              const isLast = cols[cols.length - 1] === width;
              return (
                <Skeleton
                  key={cellId}
                  className={cn('h-4', width, isLast && lastRight && 'ml-auto')}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
