'use client';

import { motion } from 'motion/react';
import { duration, easing } from '@/lib/motion';

export function ScaleIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: duration.fast,
        ease: easing.smooth,
      }}
    >
      {children}
    </motion.div>
  );
}
