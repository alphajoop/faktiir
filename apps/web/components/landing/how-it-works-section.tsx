import {
  LandingSection,
  LandingSectionHeader,
} from '@/components/landing/landing-section';
import { Reveal } from '@/components/landing/reveal';

const STEPS = [
  {
    number: '01',
    title: 'Créez votre compte',
    description:
      "Inscription gratuite en 30 secondes. Renseignez votre nom, votre entreprise — c'est tout.",
  },
  {
    number: '02',
    title: 'Ajoutez vos clients',
    description:
      'Saisissez les coordonnées de vos clients une seule fois. Ils seront disponibles pour toutes vos prochaines factures.',
  },
  {
    number: '03',
    title: 'Émettez et oubliez',
    description:
      'Créez votre facture, téléchargez le PDF et envoyez. Faktiir se charge des relances automatiques si le client tarde à payer.',
  },
] as const;

export function HowItWorksSection() {
  return (
    <LandingSection variant="muted">
      <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <Reveal>
          <LandingSectionHeader
            eyebrow="Comment ça marche"
            title={
              <>
                Opérationnel en
                <br />
                moins de 2 minutes.
              </>
            }
            description="Pas de formation requise. Pas de documentation de 50 pages. Faktiir est pensé pour être intuitif dès le premier jour."
            align="left"
            className="mb-0"
          />
        </Reveal>

        <Reveal className="how-it-works-steps pl-2">
          <div className="grid grid-cols-[36px_1fr] gap-x-5">
            {STEPS.map((step, i) => (
              <Reveal
                key={step.number}
                delay={i * 80}
                className={`col-span-2 grid grid-cols-[36px_1fr] gap-x-5${
                  i < STEPS.length - 1 ? ' pb-8' : ''
                }`}
              >
                <div className="relative z-10">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-primary/30 bg-background">
                    <span className="font-heading text-sm font-semibold text-primary tabular-nums">
                      {step.number}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className="how-it-works-connector-line absolute top-9 left-1/2 h-8 w-px -translate-x-1/2"
                      style={{ transitionDelay: `${i * 80 + 120}ms` }}
                      aria-hidden
                    />
                  )}
                </div>
                <div className="pt-1">
                  <h3 className="mb-1 font-heading text-base font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </LandingSection>
  );
}
