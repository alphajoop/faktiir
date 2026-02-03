'use client';

import { useAnimateOnScroll } from '@/hooks/use-animate-on-scroll';

interface AnimateSectionProps {
  children: React.ReactNode;
  animationClass: string;
  className?: string;
}

export function AnimateSection({
  children,
  animationClass,
  className = '',
}: AnimateSectionProps) {
  const { ref, isVisible } = useAnimateOnScroll();

  return (
    <section
      ref={ref}
      className={`${className} ${isVisible ? animationClass : ''}`}
    >
      {children}
    </section>
  );
}
