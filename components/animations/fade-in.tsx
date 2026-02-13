'use client';

import { motion } from 'motion/react';
import { duration, easing } from '@/lib/motion';

type FadeInProps = {
  children: React.ReactNode;
  delay?: number;
};

export function FadeIn({ children, delay = 0 }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: duration.normal,
        delay,
        ease: easing.smooth,
      }}
    >
      {children}
    </motion.div>
  );
}
