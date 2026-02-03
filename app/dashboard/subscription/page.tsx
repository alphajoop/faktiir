'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSubscription } from '@/hooks/use-subscription';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { toast } from 'sonner';
import { checkoutSubscription } from '@/lib/api';

export default function SubscriptionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: subscription, isLoading, error } = useSubscription();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex h-[calc(80vh-4rem)] items-center justify-center">
        <Loader2 className="text-primary h-14 w-14 animate-spin" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (error) {
    return (
      <div className="flex h-[calc(80vh-4rem)] items-center justify-center">
        <Alert variant="destructive" className="w-[calc(80vh-4rem)]">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            Impossible de charger les informations d&apos;abonnement
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isPremium = subscription?.isSubscribed === true;
  const premiumPlanId = process.env.NEXT_PUBLIC_PREMIUM_PLAN_ID;

  const handleCheckout = async () => {
    if (!session?.accessToken) {
      toast.error('Non authentifié', {
        description: 'Veuillez vous reconnecter pour continuer.',
      });
      router.push('/login');
      return;
    }

    if (!premiumPlanId) {
      toast.error('Configuration manquante', {
        description:
          "Le plan Premium n'est pas configuré (NEXT_PUBLIC_PREMIUM_PLAN_ID).",
      });
      return;
    }

    setIsCheckoutLoading(true);
    try {
      const json = await checkoutSubscription(session, {
        planId: premiumPlanId,
      });

      if (json.paymentUrl) {
        window.location.href = json.paymentUrl;
        return;
      }

      toast.error('Réponse invalide', {
        description:
          'Impossible de démarrer le paiement. Réessayez dans un instant.',
      });
    } catch (e) {
      toast.error('Erreur de paiement', {
        description:
          e instanceof Error
            ? e.message
            : 'Impossible de démarrer le paiement.',
      });
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  return (
    <div className="space-y-8 md:space-y-10">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
            Abonnement
          </h1>
          <p className="text-muted-foreground mt-1 text-base md:text-lg">
            Gérez votre plan et vos avantages
          </p>
        </div>
        {isPremium && (
          <Badge variant="default" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Premium Actif
          </Badge>
        )}
      </div>

      {/* Current Status */}
      {!isPremium && subscription && (
        <Alert className="border-warning bg-warning/5">
          <Zap className="h-4 w-4" />
          <AlertTitle>Plan Gratuit</AlertTitle>
          <AlertDescription>
            Vous avez utilisé {subscription.monthlyUsed} factures sur{' '}
            {subscription.monthlyQuota} ce mois-ci. Passez à Premium pour des
            factures illimitées.
          </AlertDescription>
        </Alert>
      )}

      {/* Plans */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Plan Gratuit */}
        <Card className={!isPremium ? 'border-primary' : ''}>
          <CardHeader>
            <CardTitle>Plan Gratuit</CardTitle>
            <CardDescription>Pour démarrer</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">0</span>
              <span className="text-muted-foreground ml-2">FCFA / mois</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {[
                `${subscription?.monthlyQuota ?? 5} factures par mois`,
                'Export PDF',
                'Suivi des paiements',
                'Support email',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <CheckCircle className="text-success h-5 w-5 shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {!isPremium && (
              <Badge variant="secondary" className="w-full justify-center py-2">
                Plan Actuel
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Plan Premium */}
        <Card
          className={`border-primary relative ${isPremium ? 'bg-primary/5' : ''}`}
        >
          {!isPremium && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="gap-1">
                <Sparkles className="h-3 w-3" />
                Recommandé
              </Badge>
            </div>
          )}

          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="text-primary h-5 w-5" />
              Plan Premium
            </CardTitle>
            <CardDescription>Pour les professionnels</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">2 000</span>
              <span className="text-muted-foreground ml-2">FCFA / mois</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {[
                'Factures illimitées',
                'Logo personnalisé sur factures',
                'Export PDF haute qualité',
                'Suivi des paiements avancé',
                'Support prioritaire',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <CheckCircle className="text-success h-5 w-5 shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {isPremium ? (
              <Badge
                variant="default"
                className="w-full justify-center gap-2 py-2"
              >
                <Sparkles className="h-4 w-4" />
                Plan Actuel
              </Badge>
            ) : (
              <div className="space-y-3">
                <Button
                  className="w-full gap-2"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isCheckoutLoading}
                >
                  {isCheckoutLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {isCheckoutLoading ? 'Redirection...' : 'Passer à Premium'}
                </Button>
                <p className="text-muted-foreground text-center text-xs">
                  Paiement sécurisé via Wave ou Orange Money
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Moyens de paiement</CardTitle>
          <CardDescription>
            Méthodes de paiement acceptées pour l&apos;abonnement Premium
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12">
                <Image
                  src="/brands/wave.svg"
                  alt="Wave"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-medium">Wave</p>
                <p className="text-muted-foreground text-xs">Paiement mobile</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12">
                <Image
                  src="/brands/orange-money.svg"
                  alt="Orange Money"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-medium">Orange Money</p>
                <p className="text-muted-foreground text-xs">Paiement mobile</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
