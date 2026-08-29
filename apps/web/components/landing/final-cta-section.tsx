import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { LandingSection } from '@/components/landing/landing-section';
import { Reveal } from '@/components/landing/reveal';
import { Button } from '@/components/ui/button';

export function FinalCtaSection() {
  return (
    <LandingSection variant="inverted" size="narrow">
      <Reveal className="text-center">
        <h2 className="font-heading text-3xl font-semibold tracking-tight text-background md:text-4xl dark:text-foreground">
          Prêt à simplifier
          <br />
          votre facturation ?
        </h2>
        <p className="mt-4 text-sm text-background/70 dark:text-muted-foreground">
          Rejoignez les freelances et entrepreneurs qui font confiance à
          Faktiir. Gratuit, pour toujours.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            asChild
            className="h-11 bg-background px-6 text-base text-foreground hover:bg-background/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/80"
          >
            <Link href="/register">
              Commencer gratuitement
              <ArrowRightIcon className="ml-1" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="h-11 bg-transparent px-6 text-base text-background dark:text-foreground dark:hover:bg-primary dark:hover:text-background"
          >
            <Link href="/login">Se connecter</Link>
          </Button>
        </div>
      </Reveal>
    </LandingSection>
  );
}
