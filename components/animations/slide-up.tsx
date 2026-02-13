'use client';

import { motion } from 'motion/react';
import { duration, easing } from '@/lib/motion';

export function SlideUp({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: duration.normal,
        ease: easing.smooth,
      }}
    >
      {children}
    </motion.div>
  );
}
