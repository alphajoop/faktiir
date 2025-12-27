'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Sparkles, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface InvoiceLimitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSubscribed: boolean;
  monthlyUsed: number;
  monthlyQuota: number;
}

export function InvoiceLimitDialog({
  open,
  onOpenChange,
  isSubscribed,
  monthlyUsed,
  monthlyQuota,
}: InvoiceLimitDialogProps) {
  if (isSubscribed) return null;

  const remaining = monthlyQuota - monthlyUsed;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <div className="bg-warning/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Zap className="text-warning h-8 w-8" />
          </div>
          <AlertDialogTitle className="text-center text-2xl">
            Limite de factures atteinte
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base">
            Vous avez créé {monthlyUsed} factures sur {monthlyQuota} autorisées
            ce mois-ci.
            <br />
            Passez à Premium pour créer des factures illimitées !
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-6 space-y-4">
          {/* Plan Premium */}
          <Card className="border-primary bg-primary/5 relative overflow-hidden">
            <div className="absolute top-0 right-0">
              <div className="bg-primary text-primary-foreground rounded-bl-lg px-3 py-1 text-xs font-medium">
                Recommandé
              </div>
            </div>

            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-primary h-5 w-5" />
                    <h3 className="text-xl font-semibold">Plan Premium</h3>
                  </div>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Débloquez toutes les fonctionnalités
                  </p>

                  <div className="mt-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">2 000</span>
                      <span className="text-muted-foreground text-lg">
                        FCFA
                      </span>
                      <span className="text-muted-foreground text-sm">
                        / mois
                      </span>
                    </div>
                  </div>

                  <ul className="mt-6 space-y-3">
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
                </div>
              </div>

              <Button className="mt-6 w-full gap-2" size="lg" asChild>
                <Link href="/dashboard/subscription">
                  Passer à Premium
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <p className="text-muted-foreground mt-3 text-center text-xs">
                Paiement sécurisé via Wave ou Orange Money
              </p>
            </CardContent>
          </Card>

          {/* Plan Gratuit */}
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Plan Gratuit</h3>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {remaining} facture{remaining > 1 ? 's' : ''} restante
                    {remaining > 1 ? 's' : ''} ce mois
                  </p>
                </div>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Continuer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
