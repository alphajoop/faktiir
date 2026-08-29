import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type LandingSectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  size?: 'default' | 'narrow' | 'wide' | 'full';
  variant?: 'default' | 'muted' | 'inverted' | 'bordered';
  padding?: 'default' | 'compact' | 'none';
};

const VARIANTS = {
  default: '',
  muted: 'border-t border-border bg-muted/20',
  inverted:
    'border-t border-border bg-foreground dark:bg-muted/30 text-background dark:text-foreground',
  bordered: 'border-t border-border',
} as const;

const SIZES = {
  default: 'max-w-5xl',
  narrow: 'max-w-3xl',
  wide: 'max-w-6xl',
  full: 'max-w-6xl',
} as const;

const PADDING = {
  default: 'py-24',
  compact: 'py-16',
  none: '',
} as const;

export function LandingSection({
  id,
  children,
  className,
  containerClassName,
  size = 'default',
  variant = 'default',
  padding = 'default',
}: LandingSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'scroll-mt-20 px-4',
        PADDING[padding],
        VARIANTS[variant],
        className,
      )}
    >
      <div className={cn('mx-auto', SIZES[size], containerClassName)}>
        {children}
      </div>
    </section>
  );
}

type LandingSectionHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
};

export function LandingSectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: LandingSectionHeaderProps) {
  return (
    <div
      className={cn('mb-14', align === 'center' && 'text-center', className)}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-primary">
          {eyebrow}
        </p>
      )}
      <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground',
            align === 'center' && 'mx-auto',
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
