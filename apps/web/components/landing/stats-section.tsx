import { LandingSection } from '@/components/landing/landing-section';
import { Reveal } from '@/components/landing/reveal';

const STATS = [
  { value: '100%', label: 'Open source' },
  { value: '0 XOF', label: 'Pour toujours gratuit' },
  { value: 'PDF', label: 'Export en un clic' },
  { value: '∞', label: 'Clients & factures' },
] as const;

export function StatsSection() {
  return (
    <LandingSection
      padding="none"
      className="border-y border-border bg-muted/30 py-12"
    >
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {STATS.map((stat, i) => (
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
    </LandingSection>
  );
}
