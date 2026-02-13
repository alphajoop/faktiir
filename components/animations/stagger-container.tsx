'use client';

import { motion } from 'motion/react';
import React from 'react';
import { duration, easing } from '@/lib/motion';
import { cn } from '@/lib/utils';

const item = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: easing.smooth,
    },
  },
};

export function StaggerContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.06,
          },
        },
      }}
      className={cn('', className)}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={
                React.isValidElement(child) && child.key
                  ? child.key
                  : `stagger-item-${i}`
              }
              variants={item}
            >
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}
