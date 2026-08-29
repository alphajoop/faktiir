import { Code2Icon, DownloadIcon, KeyRoundIcon, LockIcon } from 'lucide-react';
import {
  LandingSection,
  LandingSectionHeader,
} from '@/components/landing/landing-section';
import { Reveal } from '@/components/landing/reveal';

const SECURITY_POINTS = [
  {
    icon: LockIcon,
    title: 'Données isolées par compte',
    description:
      'Chaque utilisateur n’accède qu’à ses propres clients et factures. Aucun mélange entre comptes.',
  },
  {
    icon: KeyRoundIcon,
    title: 'Auth sécurisée',
    description:
      'Session protégée via cookie httpOnly. Vos identifiants ne transitent jamais en clair côté client.',
  },
  {
    icon: Code2Icon,
    title: 'Open source auditable',
    description:
      'Le code est public et auto-hébergeable. Inspectez, auditez ou déployez Faktiir chez vous.',
  },
  {
    icon: DownloadIcon,
    title: 'Export sans verrouillage',
    description:
      'Exportez vos données à tout moment. Aucun vendor lock-in : vos informations vous appartiennent.',
  },
] as const;

export function SecuritySection() {
  return (
    <LandingSection id="securite" variant="bordered">
      <Reveal>
        <LandingSectionHeader
          eyebrow="Sécurité"
          title="Vos données, sous votre contrôle."
          description="Confidentialité et transparence dès la conception."
        />
      </Reveal>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
        {SECURITY_POINTS.map((point, i) => (
          <Reveal key={point.title} delay={i * 60}>
            <div className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <point.icon className="size-5" />
              </div>
              <div>
                <h3 className="mb-1.5 font-heading text-base font-semibold text-foreground">
                  {point.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {point.description}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </LandingSection>
  );
}
