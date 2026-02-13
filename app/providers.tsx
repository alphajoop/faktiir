'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'motion/react';
import { type ReactNode, useState } from 'react';
import { duration, easing } from '@/lib/motion';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000, // 5 minutes
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig
      transition={{
        duration: duration.normal,
        ease: easing.smooth,
      }}
      reducedMotion="user"
    >
      {children}
    </MotionConfig>
  );
}
