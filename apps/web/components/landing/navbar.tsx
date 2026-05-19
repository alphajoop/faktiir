'use client';

import Link from 'next/link';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import FaktiirLogo from '../icons/faktiir-logo';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-transparent bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="transition-opacity hover:opacity-80">
          <FaktiirLogo className="h-5 w-auto text-primary" />
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
