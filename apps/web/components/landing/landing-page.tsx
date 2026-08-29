import { FaqSection } from '@/components/landing/faq-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { FinalCtaSection } from '@/components/landing/final-cta-section';
import { HeroSection } from '@/components/landing/hero-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { LandingFooter } from '@/components/landing/landing-footer';
import { Navbar } from '@/components/landing/navbar';
import { OpenSourceSection } from '@/components/landing/open-source-section';
import { SecuritySection } from '@/components/landing/security-section';
import { StatsSection } from '@/components/landing/stats-section';

export function LandingPage() {
  return (
    <div className="min-h-svh bg-background">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <OpenSourceSection />
      <SecuritySection />
      <FaqSection />
      <FinalCtaSection />
      <LandingFooter />
    </div>
  );
}
