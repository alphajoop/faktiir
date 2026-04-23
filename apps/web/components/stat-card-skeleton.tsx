import { Skeleton } from '@/components/ui/skeleton';

export function StatCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="size-7 rounded-md" />
      </div>
      <Skeleton className="h-7 w-24" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}
