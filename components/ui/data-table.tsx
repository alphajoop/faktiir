'use client';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Caption } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

interface SortButtonProps {
  active: boolean;
  order?: 'asc' | 'desc';
  onClick: () => void;
}

export function SortButton({ active, order, onClick }: SortButtonProps) {
  const Icon = active
    ? order === 'asc'
      ? ArrowUpIcon
      : ArrowDownIcon
    : ArrowUpDownIcon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center transition-colors',
        active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
      )}
    >
      <Icon className="size-3" />
    </button>
  );
}

interface DataTablePaginationProps {
  page: number;
  totalPages: number;
  total: number;
  label: string;
  onPageChange: (page: number) => void;
}

export function DataTablePagination({
  page,
  totalPages,
  total,
  label,
  onPageChange,
}: DataTablePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      <Caption>
        Page {page} sur {totalPages} · {total} {label}
      </Caption>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Précédent
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}

export function DataTableSkeleton({
  rows = 5,
  cols,
}: {
  rows?: number;
  cols: string[];
}) {
  let rowCounter = 0;
  let cellCounter = 0;

  return (
    <div className="flex flex-col divide-y divide-border">
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
                  className={cn('h-4', width, isLast && 'ml-auto')}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  /** Externally controlled sorting (server-side) */
  sorting?: SortingState;
  empty?: React.ReactNode;
}

export function DataTable<TData>({
  columns,
  data,
  sorting,
  empty,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Sorting is server-side — we just pass the state for display
    state: { sorting },
    manualSorting: true,
  });

  if (data.length === 0 && empty) {
    return <>{empty}</>;
  }

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((hg) => (
          <TableRow key={hg.id}>
            {hg.headers.map((h) => (
              <TableHead key={h.id}>
                {h.isPlaceholder
                  ? null
                  : flexRender(h.column.columnDef.header, h.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
