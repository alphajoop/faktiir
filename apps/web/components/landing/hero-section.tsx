import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { GithubIcon } from '@/components/icons/github-icon';
import { AppPreview } from '@/components/landing/app-preview';
import { LandingSection } from '@/components/landing/landing-section';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <LandingSection
      padding="none"
      size="full"
      className="relative overflow-hidden pb-24 pt-20 md:pb-32 md:pt-24"
      containerClassName="max-w-4xl text-center"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-125 w-200 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl"
      />
      <div
        aria-hidden
        className="landing-grid-bg pointer-events-none absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.06]"
      />

      <div className="landing-enter landing-enter-delay-1 mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
        <GithubIcon className="size-3" />
        Open source · Gratuit · Sans engagement
      </div>

      <h1 className="landing-enter landing-enter-delay-2 font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
        La facturation
        <br />
        <span className="text-primary">qui ne vous ralentit pas.</span>
      </h1>

      <p className="landing-enter landing-enter-delay-3 mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
        Créez, envoyez et gérez vos factures professionnelles en quelques
        secondes. Conçu pour les freelances et petites entreprises
        d&apos;Afrique francophone.
      </p>

      <div className="landing-enter landing-enter-delay-4 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button size="lg" asChild className="h-11 px-6 text-base">
          <Link href="/register">
            Créer un compte gratuit
            <ArrowRightIcon className="ml-1" />
          </Link>
        </Button>
        <Button
          size="lg"
          variant="secondary"
          asChild
          className="h-11 px-6 text-base"
        >
          <a
            href="https://github.com/alphajoop/faktiir"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon className="mr-1" />
            Voir sur GitHub
          </a>
        </Button>
      </div>

      <p className="landing-enter landing-enter-delay-5 mt-5 text-xs text-muted-foreground/60">
        Aucune carte bancaire requise · Exportez vos données à tout moment
      </p>

      <div className="landing-hero-preview mt-16">
        <AppPreview />
      </div>
    </LandingSection>
  );
}
