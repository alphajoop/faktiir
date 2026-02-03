import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function SubscriptionSuccessPage() {
  return (
    <main className="bg-background flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="border-border shadow-sm">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="bg-success/10 rounded-full p-3">
                <CheckCircle className="text-success h-8 w-8" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              Paiement confirmé
            </CardTitle>
            <CardDescription className="text-base">
              Votre abonnement Premium est maintenant actif.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full">
                <Link href="/dashboard/subscription">Voir mon abonnement</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard">Retour au tableau de bord</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
