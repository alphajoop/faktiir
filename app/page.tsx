import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FaktiirLogo from '@/components/icons/faktiir-logo';
import Link from 'next/link';
import {
  FileText,
  Download,
  CreditCard,
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  User,
} from 'lucide-react';
import { ModeToggle } from '@/components/ui/mode-toggle';

export default function LandingPage() {
  return (
    <div className="bg-background relative min-h-screen overflow-hidden">
      {/* Radial Glow Background */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            'radial-gradient(circle 600px at 50% 120px, var(--primary) 0%, transparent 70%)',
          opacity: 0.35,
        }}
      />

      {/* Rest of your content (z-10 to ensure it's above the glow) */}
      <div className="relative z-10">
        {/* Header */}
        <header>
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
            <FaktiirLogo className="text-primary h-28 w-28" />
            <div className="flex items-center gap-3">
              <ModeToggle />
              <Link href="/login">
                <Button variant="ghost" className="gap-2">
                  <User className="h-4 w-4 md:hidden" />
                  <span className="hidden md:inline">Connexion</span>
                </Button>
              </Link>
              <Link href="/register">
                <Button>Commencer</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <div className="bg-primary/10 text-primary mx-auto inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm">
              <Zap className="h-4 w-4" />
              Simple, rapide et professionnel
            </div>
            <h1 className="text-foreground mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Créez des factures pro en{' '}
              <span className="text-primary">quelques clics</span>
            </h1>
            <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg text-pretty">
              La solution de facturation la plus simple pour les freelances,
              graphistes et petits commerçants. Aucun registre de commerce
              requis.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  Créer mon compte gratuit
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <p className="text-muted-foreground text-sm">
                3 factures gratuites / mois
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-border bg-muted/30 border-t py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-foreground text-center text-3xl font-bold">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-center">
              Une solution complète pour gérer votre facturation au quotidien
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: FileText,
                  title: 'Création facile',
                  description:
                    'Créez des factures professionnelles en quelques minutes avec notre formulaire intuitif',
                },
                {
                  icon: Download,
                  title: 'Export PDF',
                  description:
                    'Téléchargez vos factures en PDF avec votre logo et vos informations personnalisées',
                },
                {
                  icon: CreditCard,
                  title: 'Suivi paiements',
                  description:
                    'Suivez facilement quelles factures sont payées et lesquelles sont en attente',
                },
                {
                  icon: Shield,
                  title: 'Données sécurisées',
                  description:
                    "Vos données restent sur votre appareil, aucune donnée sensible n'est partagée",
                },
                {
                  icon: Globe,
                  title: 'Adapté au local',
                  description:
                    'Conçu pour les freelances et commerçants africains, avec paiement en FCFA',
                },
                {
                  icon: CheckCircle,
                  title: 'Sans inscription complexe',
                  description:
                    'Pas besoin de registre de commerce, créez votre compte en 30 secondes',
                },
              ].map((feature) => (
                <Card key={feature.title} className="border-border">
                  <CardContent className="p-6">
                    <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                      <feature.icon className="text-primary h-6 w-6" />
                    </div>
                    <h3 className="text-foreground mt-4 font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-foreground text-center text-3xl font-bold">
              Tarification simple
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-center">
              Commencez gratuitement, passez à Premium quand vous êtes prêt
            </p>

            <div className="mx-auto mt-12 grid max-w-4xl gap-6 lg:grid-cols-2">
              {/* Free Plan */}
              <Card className="border-border">
                <CardContent className="p-8">
                  <h3 className="text-foreground text-xl font-semibold">
                    Gratuit
                  </h3>
                  <p className="text-muted-foreground mt-2">Pour démarrer</p>
                  <p className="mt-6">
                    <span className="text-foreground text-4xl font-bold">
                      0
                    </span>
                    <span className="text-muted-foreground"> FCFA/mois</span>
                  </p>
                  <ul className="mt-8 space-y-3">
                    {[
                      '3 factures par mois',
                      'Export PDF',
                      'Suivi des paiements',
                      'Support email',
                    ].map((item) => (
                      <li
                        key={item}
                        className="text-foreground flex items-center gap-3 text-sm"
                      >
                        <CheckCircle className="text-success h-5 w-5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/register" className="mt-8 block">
                    <Button variant="outline" className="w-full bg-transparent">
                      Commencer gratuitement
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Premium Plan */}
              <Card className="border-primary bg-primary/5 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-medium">
                    Populaire
                  </span>
                </div>
                <CardContent className="p-8">
                  <h3 className="text-foreground text-xl font-semibold">
                    Premium
                  </h3>
                  <p className="text-muted-foreground mt-2">Pour les pros</p>
                  <p className="mt-6">
                    <span className="text-foreground text-4xl font-bold">
                      2 000
                    </span>
                    <span className="text-muted-foreground"> FCFA/mois</span>
                  </p>
                  <ul className="mt-8 space-y-3">
                    {[
                      'Factures illimitées',
                      'Logo personnalisé sur factures',
                      'Export PDF haute qualité',
                      'Suivi des paiements avancé',
                      'Support prioritaire',
                    ].map((item) => (
                      <li
                        key={item}
                        className="text-foreground flex items-center gap-3 text-sm"
                      >
                        <CheckCircle className="text-success h-5 w-5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/register" className="mt-8 block">
                    <Button className="w-full">Passer à Premium</Button>
                  </Link>
                  <p className="text-muted-foreground mt-4 text-center text-xs">
                    Paiement via Wave ou Orange Money
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-border bg-muted/30 border-t py-20">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <h2 className="text-foreground text-3xl font-bold">
              Prêt à simplifier votre facturation ?
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-xl">
              Rejoignez des centaines de freelances qui utilisent déjà Faktiir
            </p>
            <Link href="/register">
              <Button size="lg" className="mt-8 gap-2">
                Créer mon compte gratuit
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-border border-t py-12">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Brand */}
              <div className="space-y-4">
                <FaktiirLogo className="text-primary h-20 w-20" />
                <p className="text-muted-foreground text-sm">
                  La solution de facturation simple pour les freelances et
                  petits commerçants.
                </p>
                {/* Social Links */}
                <div className="flex items-center gap-3">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-muted hover:bg-primary hover:text-primary-foreground flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-muted hover:bg-primary hover:text-primary-foreground flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-muted hover:bg-primary hover:text-primary-foreground flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-muted hover:bg-primary hover:text-primary-foreground flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Product */}
              <div>
                <h4 className="text-foreground mb-4 font-semibold">Produit</h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/register"
                      className="text-muted-foreground hover:text-primary text-sm transition-colors"
                    >
                      Créer un compte
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/login"
                      className="text-muted-foreground hover:text-primary text-sm transition-colors"
                    >
                      Connexion
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#pricing"
                      className="text-muted-foreground hover:text-primary text-sm transition-colors"
                    >
                      Tarification
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#features"
                      className="text-muted-foreground hover:text-primary text-sm transition-colors"
                    >
                      Fonctionnalités
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-foreground mb-4 font-semibold">Légal</h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/legal/privacy"
                      className="text-muted-foreground hover:text-primary text-sm transition-colors"
                    >
                      Politique de confidentialité
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/legal/terms"
                      className="text-muted-foreground hover:text-primary text-sm transition-colors"
                    >
                      Conditions d&apos;utilisation
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/legal/cookies"
                      className="text-muted-foreground hover:text-primary text-sm transition-colors"
                    >
                      Politique de cookies
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/legal/mentions"
                      className="text-muted-foreground hover:text-primary text-sm transition-colors"
                    >
                      Mentions légales
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-foreground mb-4 font-semibold">Contact</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="mailto:support@faktiir.com"
                      className="text-muted-foreground hover:text-primary flex items-center gap-2 text-sm transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      support@faktiir.com
                    </a>
                  </li>
                  <li>
                    <span className="text-muted-foreground text-sm">
                      Dakar, Sénégal
                    </span>
                  </li>
                </ul>
                <div className="mt-4">
                  <p className="text-muted-foreground mb-2 text-xs">
                    Paiements acceptés
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="bg-muted text-foreground rounded px-2 py-1 text-xs font-medium">
                      Wave
                    </span>
                    <span className="bg-muted text-foreground rounded px-2 py-1 text-xs font-medium">
                      Orange Money
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="border-border mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
              <p className="text-muted-foreground text-sm">
                © 2025 Faktiir. Tous droits réservés.
              </p>
              <p className="text-muted-foreground text-xs">
                Fait avec passion pour les entrepreneurs africains
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
