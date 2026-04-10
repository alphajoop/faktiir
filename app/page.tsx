import {
  ArrowRightIcon,
  CheckIcon,
  DownloadIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  ReceiptIcon,
  ShieldCheckIcon,
  UsersIcon,
  ZapIcon,
} from 'lucide-react';
import Link from 'next/link';
import FaktiirIcon from '@/components/icons/faktiir-icon';
import { GithubIcon } from '@/components/icons/github-icon';
import { LandingNavbar } from '@/components/landing-navbar';
import { Reveal } from '@/components/reveal';
import { Button } from '@/components/ui/button';

function AppPreview() {
  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Glow */}
      <div
        aria-hidden
        className="absolute -inset-px rounded-2xl bg-primary/20 blur-2xl opacity-60"
      />
      {/* Card */}
      <div className="relative rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
          <div className="size-3 rounded-full bg-red-400/70" />
          <div className="size-3 rounded-full bg-yellow-400/70" />
          <div className="size-3 rounded-full bg-green-400/70" />
          <div className="ml-3 h-5 flex-1 rounded-full bg-muted" />
        </div>

        {/* Fake dashboard */}
        <div className="flex h-72">
          {/* Sidebar */}
          <div className="hidden w-44 shrink-0 border-r border-border bg-sidebar sm:flex flex-col gap-1 p-3">
            {[
              {
                icon: LayoutDashboardIcon,
                label: 'Tableau de bord',
                active: false,
              },
              { icon: ReceiptIcon, label: 'Factures', active: true },
              { icon: UsersIcon, label: 'Clients', active: false },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs ${
                  item.active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                    : 'text-sidebar-foreground/60'
                }`}
              >
                <item.icon className="size-3.5 shrink-0" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col gap-3 overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 w-20 rounded bg-muted mb-1" />
                <div className="h-2.5 w-14 rounded bg-muted/60" />
              </div>
              <div className="h-7 w-28 rounded-md bg-primary/80" />
            </div>

            <div className="grid grid-cols-4 gap-2 border-b border-border pb-2">
              {['Numéro', 'Client', 'Statut', 'Montant'].map((h) => (
                <div key={h} className="h-2.5 w-full rounded bg-muted/40" />
              ))}
            </div>

            {[
              { badge: 'Payée', color: 'bg-green-500/20 text-green-600' },
              { badge: 'Envoyée', color: 'bg-blue-500/20 text-blue-600' },
              { badge: 'En retard', color: 'bg-red-500/20 text-red-600' },
              { badge: 'Brouillon', color: 'bg-muted text-muted-foreground' },
            ].map((row) => (
              <div
                key={row.badge}
                className="grid grid-cols-4 gap-2 items-center py-1"
              >
                <div className="h-2.5 w-16 rounded bg-muted/60" />
                <div className="h-2.5 w-full rounded bg-muted/40" />
                <div
                  className={`h-4 w-16 rounded-full px-2 text-[9px] font-medium flex items-center justify-center ${row.color}`}
                >
                  {row.badge}
                </div>
                <div className="h-2.5 w-14 rounded bg-muted/60 ml-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
      <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="size-5" />
      </div>
      <h3 className="mb-2 font-heading text-base font-semibold text-foreground">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

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
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-svh bg-background">
      <LandingNavbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-4 pb-24 pt-20 md:pb-32 md:pt-24">
        {/* Glow blob */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl"
        />
        {/* Grid texture */}
        <div
          aria-hidden
          className="landing-grid-bg pointer-events-none absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.06]"
        />

        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="hero-animate-1 mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
            <GithubIcon className="size-3" />
            Open source · Gratuit · Sans engagement
          </div>

          {/* H1 */}
          <h1 className="hero-animate-2 font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            La facturation
            <br />
            <span className="text-primary">qui ne vous ralentit pas.</span>
          </h1>

          {/* Subhead */}
          <p className="hero-animate-3 mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            Créez, envoyez et gérez vos factures professionnelles en quelques
            secondes. Conçu pour les freelances et petites entreprises d'Afrique
            francophone.
          </p>

          {/* CTAs */}
          <div className="hero-animate-4 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild className="h-11 px-6 text-base">
              <Link href="/register">
                Créer un compte gratuit
                <ArrowRightIcon className="ml-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-11 px-6 text-base"
            >
              <a
                href="https://github.com/faktiir"
                target="_blank"
                rel="noopener noreferrer"
              >
                Voir sur GitHub
              </a>
            </Button>
          </div>

          {/* Trust */}
          <p className="hero-animate-5 mt-5 text-xs text-muted-foreground/60">
            Aucune carte bancaire requise · Exportez vos données à tout moment
          </p>

          {/* Preview */}
          <div className="hero-animate-6 mt-16">
            <AppPreview />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: '100%', label: 'Open source' },
              { value: '0 XOF', label: 'Pour toujours gratuit' },
              { value: 'PDF', label: 'Export en un clic' },
              { value: '∞', label: 'Clients & factures' },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 60} className="text-center">
                <div className="font-heading text-3xl font-semibold tabular-nums text-foreground">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <Reveal className="mb-14 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-primary">
              Fonctionnalités
            </p>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Tout ce dont vous avez besoin,
              <br className="hidden sm:block" />
              rien de superflu.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
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
                icon: ZapIcon,
                title: 'Statuts automatiques',
                description:
                  "Suivez l'état de chaque facture — brouillon, envoyée, payée, en retard. Passez d'un statut à l'autre en un clic.",
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
            ].map((feature, i) => (
              <Reveal key={feature.title} delay={i * 60}>
                <FeatureCard {...feature} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="border-t border-border bg-muted/20 px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24 items-center">
            <Reveal>
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-primary">
                Comment ça marche
              </p>
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Opérationnel en
                <br />
                moins de 2 minutes.
              </h2>
              <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                Pas de formation requise. Pas de documentation de 50 pages.
                Faktiir est pensé pour être intuitif dès le premier jour.
              </p>
            </Reveal>

            <div className="flex flex-col gap-8">
              {[
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
                  title: 'Émettez votre première facture',
                  description:
                    'Sélectionnez un client, ajoutez vos prestations, définissez la TVA. Téléchargez le PDF et envoyez.',
                },
              ].map((step, i) => (
                <Reveal key={step.number} delay={i * 100}>
                  <Step {...step} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Open source CTA ── */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 px-8 py-10 text-center">
              <div
                aria-hidden
                className="absolute right-8 top-1/2 -translate-y-1/2 opacity-5"
              >
                <FaktiirIcon className="size-40 text-primary" />
              </div>

              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-primary">
                Open Source
              </p>
              <h2 className="font-heading text-2xl font-semibold text-foreground md:text-3xl">
                Transparent par nature.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                Le code source est public. Inspectez, contribuez ou
                auto-hébergez Faktiir sur votre propre infrastructure.
              </p>
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button variant="outline" asChild className="gap-2">
                  <a
                    href="https://github.com/faktiir"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GithubIcon className="size-4" />
                    GitHub
                  </a>
                </Button>
                <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
                  {[
                    'MIT License',
                    'Contributions bienvenues',
                    'Auto-hébergeable',
                  ].map((item) => (
                    <span key={item} className="flex items-center gap-1">
                      <CheckIcon className="size-3 text-primary" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="border-t border-border bg-foreground px-4 py-24 dark:bg-muted/30">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-background dark:text-foreground md:text-4xl">
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
                className="h-11 bg-background text-foreground px-6 text-base hover:bg-background/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/80"
              >
                <Link href="/register">
                  Commencer gratuitement
                  <ArrowRightIcon className="ml-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                asChild
                className="h-11 px-6 text-base text-background/80 hover:bg-background/10 hover:text-background dark:text-muted-foreground dark:hover:text-foreground dark:hover:bg-muted"
              >
                <Link href="/login">Se connecter</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border px-4 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex size-5 items-center justify-center rounded bg-primary">
              <FaktiirIcon className="size-3 text-primary-foreground" />
            </div>
            <span className="font-heading font-semibold text-foreground">
              FAKTIIR
            </span>
            <span>·</span>
            <span>Logiciel de facturation open source</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hover:text-foreground transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="hover:text-foreground transition-colors"
            >
              Inscription
            </Link>
            <a
              href="https://github.com/faktiir"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
