import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const headingVariants = cva(
  'font-heading font-semibold tracking-tight text-foreground',
  {
    variants: {
      size: {
        h1: 'text-3xl leading-tight',
        h2: 'text-2xl leading-snug',
        h3: 'text-xl leading-snug',
        h4: 'text-lg leading-snug',
        h5: 'text-base leading-normal',
        h6: 'text-sm leading-normal',
      },
    },
    defaultVariants: { size: 'h2' },
  },
);

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: HeadingTag;
}

export function Heading({
  as: Tag = 'h2',
  size,
  className,
  ...props
}: HeadingProps) {
  return (
    <Tag
      className={cn(
        headingVariants({ size: size ?? (Tag as unknown as typeof size) }),
        className,
      )}
      {...props}
    />
  );
}

const textVariants = cva('text-foreground', {
  variants: {
    size: {
      xs: 'text-xs leading-normal',
      sm: 'text-sm leading-relaxed',
      base: 'text-base leading-relaxed',
      lg: 'text-lg leading-relaxed',
    },
    variant: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      destructive: 'text-destructive',
      success: 'text-[var(--success)]',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
    },
  },
  defaultVariants: {
    size: 'sm',
    variant: 'default',
    weight: 'normal',
  },
});

interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div' | 'label' | 'li';
}

export function Text({
  as: Tag = 'p',
  size,
  variant,
  weight,
  className,
  ...props
}: TextProps) {
  return (
    <Tag
      className={cn(textVariants({ size, variant, weight }), className)}
      {...props}
    />
  );
}

export function Caption({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'text-xs text-muted-foreground leading-normal font-normal',
        className,
      )}
      {...props}
    />
  );
}

export function Code({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        'font-mono text-xs bg-muted px-1.5 py-0.5 rounded-sm text-foreground',
        className,
      )}
      {...props}
    />
  );
}

export function PageTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        'text-2xl font-semibold tracking-tight text-foreground font-heading',
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function SectionTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        'text-base font-semibold text-foreground font-heading',
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function FieldLabel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'text-sm font-medium text-foreground leading-none',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
