import { CheckIcon } from 'lucide-react';
import FaktiirLogo from '@/components/icons/faktiir-logo';
import { GithubIcon } from '@/components/icons/github-icon';
import { LandingSection } from '@/components/landing/landing-section';
import { Reveal } from '@/components/landing/reveal';
import { Button } from '@/components/ui/button';

const HIGHLIGHTS = [
  'MIT License',
  'Contributions bienvenues',
  'Auto-hébergeable',
] as const;

export function OpenSourceSection() {
  return (
    <LandingSection padding="compact">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/40 px-8 py-12 md:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute right-6 bottom-8 w-[70%] translate-y-4 opacity-[0.045]"
          >
            <FaktiirLogo className="h-auto w-full text-foreground" />
          </div>

          <div className="relative z-10 max-w-md">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold tracking-widest text-primary uppercase">
              <span className="size-1.5 rounded-full bg-primary" />
              Open source
            </span>

            <h2 className="font-heading text-3xl leading-tight font-semibold text-foreground md:text-4xl">
              Transparent
              <br />
              par nature.
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Le code source est entièrement public. Inspectez, contribuez ou
              auto-hébergez Faktiir sur votre propre infrastructure.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Button variant="outline" asChild className="gap-2">
                <a
                  href="https://github.com/alphajoop/faktiir"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubIcon className="size-4" />
                  Voir sur GitHub
                </a>
              </Button>

              <div
                className="hidden h-14 w-px bg-border sm:block"
                aria-hidden
              />

              <div className="flex flex-col gap-2">
                {HIGHLIGHTS.map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <CheckIcon className="size-3 text-primary" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </LandingSection>
  );
}
