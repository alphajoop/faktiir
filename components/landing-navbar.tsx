'use client';

import Link from 'next/link';
import FaktiirIcon from '@/components/icons/faktiir-icon';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-transparent bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
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

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button variant="ghost" size="sm" className="max-sm:hidden" asChild>
            <Link href="/login">Connexion</Link>
          </Button>
          <Button size="sm" className="max-sm:hidden" asChild>
            <Link href="/register">Commencer — c'est gratuit</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
