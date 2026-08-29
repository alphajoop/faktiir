import Link from 'next/link';
import FaktiirLogo from '@/components/icons/faktiir-logo';
import { LandingSection } from '@/components/landing/landing-section';

export function LandingFooter() {
  return (
    <LandingSection
      padding="none"
      variant="bordered"
      className="py-8"
      containerClassName="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row"
    >
      <div className="flex items-center gap-3">
        <FaktiirLogo className="h-5 w-auto text-primary" />
        <span className="text-muted-foreground/40">·</span>
        <span>Logiciel de facturation open source</span>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/login" className="transition-colors hover:text-foreground">
          Connexion
        </Link>
        <Link
          href="/register"
          className="transition-colors hover:text-foreground"
        >
          Inscription
        </Link>
        <a
          href="https://github.com/alphajoop/faktiir"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-foreground"
        >
          GitHub
        </a>
      </div>
    </LandingSection>
  );
}
