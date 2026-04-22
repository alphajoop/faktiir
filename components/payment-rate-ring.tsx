import { CheckCircleIcon } from 'lucide-react';
import { Caption, Text } from '@/components/ui/typography';

interface PaymentRateRingProps {
  rate: number;
}

export function PaymentRateRing({ rate }: PaymentRateRingProps) {
  const radius = 36;
  const circ = 2 * Math.PI * radius;
  const filled = (rate / 100) * circ;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <Caption>Taux de paiement</Caption>
        <div className="flex size-7 items-center justify-center rounded-md bg-muted">
          <CheckCircleIcon className="size-3.5 text-muted-foreground" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <svg width={88} height={88} className="shrink-0 -rotate-90">
          <title>Taux de paiement : {rate}%</title>
          <circle
            cx={44}
            cy={44}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={8}
          />
          <circle
            cx={44}
            cy={44}
            r={radius}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth={8}
            strokeDasharray={`${filled} ${circ}`}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <div>
          <Text
            size="lg"
            weight="semibold"
            className="font-heading tabular-nums"
          >
            {rate}%
          </Text>
          <Caption>des factures payées</Caption>
        </div>
      </div>
    </div>
  );
}
