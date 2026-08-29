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

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10">
        <span className="font-heading text-sm font-semibold text-primary tabular-nums">
          {number}
        </span>
      </div>
      <div className="pt-1">
        <h3 className="mb-1 font-heading text-base font-semibold text-foreground">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

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

        <div className="flex flex-col gap-8">
          {STEPS.map((step, i) => (
            <Reveal key={step.number} delay={i * 100}>
              <Step {...step} />
            </Reveal>
          ))}
        </div>
      </div>
    </LandingSection>
  );
}
