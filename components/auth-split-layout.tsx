import Image from 'next/image';
import Link from 'next/link';
import FaktiirIcon from '@/components/icons/faktiir-icon';
import { ModeToggle } from '@/components/mode-toggle';

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  imageUrl: string;
  imageAlt: string;
  tagline: string;
  taglineAuthor?: string;
}

export function AuthSplitLayout({
  children,
  imageUrl,
  imageAlt,
  tagline,
  taglineAuthor,
}: AuthSplitLayoutProps) {
  return (
    <div className="flex min-h-svh">
      {/* Form side */}
      <div className="relative flex w-full flex-col lg:w-[48%] xl:w-[44%]">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-5 md:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-foreground transition-opacity hover:opacity-70"
          >
            <div className="flex size-7 items-center justify-center rounded-md bg-primary">
              <FaktiirIcon className="size-4 text-primary-foreground" />
            </div>
            <span className="font-heading text-sm font-semibold tracking-tight">
              FAKTIIR
            </span>
          </Link>
          <ModeToggle />
        </div>

        {/* Mobile banner image */}
        <div className="relative mx-6 mb-6 overflow-hidden rounded-xl lg:hidden">
          <div className="relative aspect-3/1 w-full">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="calc(100vw - 3rem)"
              className="object-cover brightness-[0.4] dark:grayscale-75"
              loading="eager"
              priority
            />
            <div className="absolute inset-0 bg-primary/15" />
            {tagline && (
              <p className="absolute bottom-3 left-4 right-4 text-xs font-medium leading-snug text-background dark:text-foreground">
                {tagline}
              </p>
            )}
          </div>
        </div>

        {/* Form content */}
        <div className="flex flex-1 items-center justify-center px-6 pb-10 md:px-10">
          <div className="w-full max-w-sm animate-in fade-in-0 slide-in-from-bottom-3 duration-300">
            {children}
          </div>
        </div>
      </div>

      {/* Image side */}
      <div className="relative hidden flex-1 lg:block">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes="(min-width: 1024px) 56vw, 100vw"
          className="object-cover brightness-[0.4] dark:grayscale-75"
          loading="eager"
          priority
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-primary/15" />

        {/* Tagline overlay */}
        {tagline && (
          <div className="absolute bottom-10 left-10 right-10">
            <blockquote className="space-y-3">
              <p className="text-balance text-xl font-medium leading-snug text-background dark:text-foreground">
                &ldquo;{tagline}&rdquo;
              </p>
              {taglineAuthor && (
                <footer className="text-sm text-background/70 dark:text-foreground/70">
                  — {taglineAuthor}
                </footer>
              )}
            </blockquote>
          </div>
        )}
      </div>
    </div>
  );
}
