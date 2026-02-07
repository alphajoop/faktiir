'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface InvoiceLimitBannerProps {
  isSubscribed: boolean;
  monthlyUsed: number;
  monthlyQuota: number;
}

export function InvoiceLimitBanner({
  isSubscribed,
  monthlyUsed,
  monthlyQuota,
}: InvoiceLimitBannerProps) {
  if (isSubscribed) return null;

  const percentage = monthlyQuota ? (monthlyUsed / monthlyQuota) * 100 : 0;
  const remaining = Math.max(monthlyQuota - monthlyUsed, 0);
  const isNearLimit = percentage >= 80;

  return (
    <Card
      className={`border-l-4 ${
        isNearLimit ? 'border-l-warning bg-warning/5' : 'border-l-primary'
      }`}
    >
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium">
              {remaining} facture{remaining > 1 ? 's' : ''} restante
              {remaining > 1 ? 's' : ''} ce mois
            </p>
            <span className="text-muted-foreground text-xs">
              {monthlyUsed} / {monthlyQuota}
            </span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>

        <Button variant="outline" className="gap-2 whitespace-nowrap" asChild>
          <Link href="/dashboard/subscription">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Passer à Premium</span>
            <span className="sm:hidden">Premium</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
