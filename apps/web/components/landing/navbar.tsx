'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { scrollToHash } from '@/lib/scroll-to-hash';
import FaktiirLogo from '../icons/faktiir-logo';

const NAV_LINKS = [
  { href: '#features', label: 'Fonctionnalités' },
  { href: '#securite', label: 'Sécurité' },
  { href: '#faq', label: 'FAQ' },
] as const;

function handleNavAnchorClick(
  event: React.MouseEvent<HTMLAnchorElement>,
  href: string,
) {
  event.preventDefault();
  if (scrollToHash(href)) {
    window.history.pushState(null, '', href);
  }
}

export function Navbar() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    requestAnimationFrame(() => {
      scrollToHash(hash);
    });
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-transparent bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" className="shrink-0 transition-opacity hover:opacity-80">
          <FaktiirLogo className="h-5 w-auto text-primary" />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(event) => handleNavAnchorClick(event, link.href)}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button variant="ghost" size="sm" className="max-sm:hidden" asChild>
            <Link href="/login">Connexion</Link>
          </Button>
          <Button size="sm" className="max-sm:hidden" asChild>
            <Link href="/register">Commencer — c&apos;est gratuit</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
