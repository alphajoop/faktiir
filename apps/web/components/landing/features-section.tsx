import {
  BellIcon,
  DownloadIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  ShieldCheckIcon,
  UsersIcon,
} from 'lucide-react';
import {
  LandingSection,
  LandingSectionHeader,
} from '@/components/landing/landing-section';
import { Reveal } from '@/components/landing/reveal';

const FEATURES = [
  {
    icon: FileTextIcon,
    title: 'Factures en quelques secondes',
    description:
      "Créez des factures professionnelles avec vos informations pré-remplies. Ajoutez des lignes, la TVA, des notes — en moins d'une minute.",
  },
  {
    icon: DownloadIcon,
    title: 'Export PDF immédiat',
    description:
      'Téléchargez vos factures en PDF avec votre logo et les coordonnées complètes. Prêt à envoyer à vos clients.',
  },
  {
    icon: UsersIcon,
    title: 'Gestion des clients',
    description:
      "Centralisez vos contacts : nom, e-mail, téléphone, adresse. Retrouvez l'historique de chaque client en un coup d'œil.",
  },
  {
    icon: BellIcon,
    title: 'Rappels automatiques',
    description:
      'Faktiir détecte chaque jour les factures en retard et envoie automatiquement un e-mail de relance à vos clients. Zéro oubli, zéro friction.',
    badge: 'Nouveau',
  },
  {
    icon: LayoutDashboardIcon,
    title: 'Tableau de bord clair',
    description:
      "Visualisez votre chiffre d'affaires, les factures en attente et celles en retard. Une vue complète de votre activité.",
  },
  {
    icon: ShieldCheckIcon,
    title: 'Vos données vous appartiennent',
    description:
      'Open source et auto-hébergeable. Exportez tout à tout moment. Aucun verrouillage propriétaire.',
  },
] as const;

function FeatureCard({
  icon: Icon,
  title,
  description,
  badge,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="group relative h-full rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
      {badge && (
        <span className="absolute top-4 right-4 rounded-full border border-primary/20 bg-primary/8 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
          {badge}
        </span>
      )}
      <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="size-5" />
      </div>
      <h3 className="mb-2 font-heading text-base font-semibold text-foreground">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <LandingSection id="features">
      <Reveal>
        <LandingSectionHeader
          eyebrow="Fonctionnalités"
          title={
            <>
              Tout ce dont vous avez besoin,
              <br className="hidden sm:block" />
              rien de superflu.
            </>
          }
        />
      </Reveal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, i) => (
          <Reveal key={feature.title} delay={i * 60} className="h-full">
            <FeatureCard {...feature} />
          </Reveal>
        ))}
      </div>
    </LandingSection>
  );
}
