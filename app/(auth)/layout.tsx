import FaktiirIcon from '@/components/icons/faktiir-icon';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <div className="mb-8 flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
          <FaktiirIcon className="size-5 text-primary-foreground" />
        </div>
        <span className="font-heading text-xl font-semibold tracking-tight text-foreground">
          FAKTIIR
        </span>
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
