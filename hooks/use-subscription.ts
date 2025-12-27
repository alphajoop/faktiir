'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { getCurrentUser, type User } from '@/lib/api/users';

export function useSubscription() {
  const { data: session } = useSession();

  return useQuery<
    Pick<
      User,
      'isSubscribed' | 'monthlyUsed' | 'monthlyQuota' | 'invoiceMonthNumber'
    >
  >({
    queryKey: ['subscription', session?.user?.id],
    queryFn: async (): Promise<
      Pick<
        User,
        'isSubscribed' | 'monthlyUsed' | 'monthlyQuota' | 'invoiceMonthNumber'
      >
    > => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      const user = await getCurrentUser(session);
      const { isSubscribed, monthlyUsed, monthlyQuota, invoiceMonthNumber } =
        user;
      return { isSubscribed, monthlyUsed, monthlyQuota, invoiceMonthNumber };
    },
    enabled: !!session?.accessToken,
    staleTime: 60 * 1000, // 1 minute
  });
}
